import { describe, expect, it } from 'vitest';
import { loadHtmlPage } from './helpers/dom.js';

const CALLBACK = 'globoapi_geo_callback';

function loadGeo() {
  const dom = loadHtmlPage('geo.html');
  return { dom, window: dom.window, document: dom.window.document };
}

function findGeoScript(document) {
  return [...document.body.querySelectorAll('script[src]')]
    .find((script) => script.src.includes('api.globo.com'));
}

describe('geo page', () => {
  it('appends a jsonp script carrying the callback name', () => {
    const { document } = loadGeo();

    expect(findGeoScript(document).src)
      .toBe(`http://api.globo.com/geo/?callback=${CALLBACK}`);
  });

  it('exposes the callback on window until it is invoked', () => {
    const { window } = loadGeo();

    expect(typeof window[CALLBACK]).toBe('function');
  });

  it('renders city and ip once the callback resolves', async () => {
    const { window, document } = loadGeo();

    window[CALLBACK]({ city: { name: 'Rio de Janeiro' }, ip: '200.0.0.1' });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.querySelector('.city').innerHTML).toBe('Rio de Janeiro');
    expect(document.querySelector('.ip').innerHTML).toBe('200.0.0.1');
  });

  it('cleans up the injected script and the global callback', () => {
    const { window, document } = loadGeo();

    window[CALLBACK]({ city: { name: 'Rio de Janeiro' }, ip: '200.0.0.1' });

    expect(findGeoScript(document)).toBeUndefined();
    expect(CALLBACK in window).toBe(false);
  });
});
