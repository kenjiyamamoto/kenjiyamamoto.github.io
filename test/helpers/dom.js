import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = new URL('../../', import.meta.url);

export function readRepoFile(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, ROOT)), 'utf8');
}

export function createDom(html, options = {}) {
  return new JSDOM(html, {
    url: 'https://kenjiyamamoto.com/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    ...options
  });
}

export function loadHtmlPage(relativePath, options = {}) {
  return createDom(readRepoFile(relativePath), options);
}

export function click(element, init = {}) {
  const event = new element.ownerDocument.defaultView.MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    ...init
  });
  element.dispatchEvent(event);
  return event;
}
