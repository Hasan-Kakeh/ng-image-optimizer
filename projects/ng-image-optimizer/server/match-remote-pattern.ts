import type { RemotePattern } from './config';
import { makeRe } from 'picomatch';

export function matchRemotePattern(pattern: RemotePattern | URL, url: URL): boolean {
  if (pattern.protocol !== undefined) {
    if (pattern.protocol.replace(/:$/, '') !== url.protocol.replace(/:$/, '')) {
      return false;
    }
  }
  if (pattern.port !== undefined) {
    if (pattern.port !== url.port) {
      return false;
    }
  }

  if (pattern.hostname === undefined) {
    throw new Error(`Pattern should define hostname but found\n${JSON.stringify(pattern)}`);
  } else {
    if (!makeRe(pattern.hostname).test(url.hostname)) {
      return false;
    }
  }

  if (pattern.search !== undefined) {
    if (pattern.search !== url.search) {
      return false;
    }
  }

  if (!makeRe(pattern.pathname ?? '**', { dot: true }).test(url.pathname)) {
    return false;
  }

  return true;
}

export function hasRemoteMatch(remotePatterns: Array<RemotePattern | URL>, url: URL): boolean {
  return remotePatterns.some((p) => matchRemotePattern(p, url));
}
