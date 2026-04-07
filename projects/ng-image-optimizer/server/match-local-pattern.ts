import type { LocalPattern } from './config';
import { makeRe } from 'picomatch';

export function matchLocalPattern(pattern: LocalPattern, url: URL): boolean {
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

export function hasLocalMatch(
  localPatterns: LocalPattern[] | undefined,
  urlPathAndQuery: string,
): boolean {
  if (!localPatterns) {
    return true;
  }
  const url = new URL(urlPathAndQuery, 'http://n');
  return localPatterns.some((p) => matchLocalPattern(p, url));
}
