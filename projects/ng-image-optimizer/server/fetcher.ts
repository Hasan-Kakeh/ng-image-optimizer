import fs from 'node:fs';
import path from 'node:path';
import { ImageError, extractEtag } from './utils';
import { isIP } from 'node:net';
import { lookup } from 'node:dns/promises';

export interface ImageUpstream {
  buffer: Buffer;
  contentType: string | null | undefined;
  cacheControl: string | null | undefined;
  etag: string;
}

const isPrivateIp = (ip: string) => {
  return /^(::f{4}:)?10\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(ip) ||
    /^(::f{4}:)?192\.168\.\d{1,3}\.\d{1,3}/.test(ip) ||
    /^(::f{4}:)?172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}/.test(ip) ||
    /^(::f{4}:)?127\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(ip) ||
    /^(::f{4}:)?169\.254\.\d{1,3}\.\d{1,3}/.test(ip) ||
    /^f[cd][0-9a-f]{2}:/i.test(ip) ||
    /^fe80:/i.test(ip) ||
    /^::1$/.test(ip) ||
    /^::$/.test(ip);
};

export async function fetchExternalImage(
  href: string,
  dangerouslyAllowLocalIP: boolean,
  maximumResponseBody: number,
  count = 3,
): Promise<ImageUpstream> {
  if (!dangerouslyAllowLocalIP) {
    const { hostname } = new URL(href);
    let ips = [hostname];
    if (!isIP(hostname)) {
      const records = await lookup(hostname, { family: 0, all: true }).catch(() => [{ address: hostname }]);
      ips = records.map(r => r.address);
    }
    const privateIps = ips.filter(isPrivateIp);
    if (privateIps.length > 0) {
      throw new ImageError(400, '"url" parameter is not allowed (resolved to private IP)');
    }
  }

  const res = await fetch(href, {
    signal: AbortSignal.timeout(7000),
    redirect: 'manual',
  }).catch(err => err as Error);

  if (res instanceof Error) {
    if (res.name === 'TimeoutError') throw new ImageError(504, 'upstream image response timed out');
    throw res;
  }

  const locationHeader = res.headers.get('Location');
  if ([301, 302, 303, 307, 308].includes(res.status) && locationHeader) {
    if (count === 0) throw new ImageError(508, 'too many redirects');
    const redirect = new URL(locationHeader, href).href;
    return fetchExternalImage(redirect, dangerouslyAllowLocalIP, maximumResponseBody, count - 1);
  }

  if (!res.ok || !res.body) {
    throw new ImageError(res.status || 400, 'upstream image response is invalid');
  }

  const chunks: Uint8Array[] = [];
  let totalSize = 0;
  
  // Need to process stream chunks manually to cap size
  const reader = res.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalSize += value.byteLength;
    if (totalSize > maximumResponseBody) {
      throw new ImageError(413, 'upstream response exceeded maximum size');
    }
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);
  const etag = extractEtag(res.headers.get('ETag'), buffer);

  return {
    buffer,
    contentType: res.headers.get('Content-Type'),
    cacheControl: res.headers.get('Cache-Control'),
    etag,
  };
}

export async function fetchInternalImage(
  url: string,
  browserDistFolder: string,
): Promise<ImageUpstream> {
  const filePath = path.join(browserDistFolder, url.startsWith('/') ? url.slice(1) : url);
  if (!fs.existsSync(filePath)) {
    throw new ImageError(404, 'Local image not found');
  }
  const buffer = fs.readFileSync(filePath);
  return {
    buffer,
    contentType: undefined,
    cacheControl: undefined,
    etag: extractEtag(null, buffer),
  };
}
