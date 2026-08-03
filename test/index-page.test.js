import { describe, expect, it } from 'vitest';
import { click, loadHtmlPage } from './helpers/dom.js';

function loadIndex({ prefersLight = false } = {}) {
  const dom = loadHtmlPage('index.html', {
    beforeParse(window) {
      window.matchMedia = (query) => ({
        media: query,
        matches: query.includes('light') ? prefersLight : false,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {}
      });
    }
  });
  return { dom, document: dom.window.document };
}

describe('index page', () => {
  it('stamps the current year in the footer', () => {
    const { document } = loadIndex();

    expect(document.getElementById('year').textContent)
      .toBe(String(new Date().getFullYear()));
  });

  it('starts in dark theme when light mode is not preferred', () => {
    const { document } = loadIndex();

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.getElementById('themeToggle').textContent).toBe('☀');
  });

  it('starts in light theme when the OS prefers light', () => {
    const { document } = loadIndex({ prefersLight: true });

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.getElementById('themeToggle').textContent).toBe('☾');
  });

  it('toggles between themes on every button click', () => {
    const { document } = loadIndex();
    const button = document.getElementById('themeToggle');

    click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(button.textContent).toBe('☾');

    click(button);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(button.textContent).toBe('☀');
  });

  it('opens every social link safely in a new tab', () => {
    const { document } = loadIndex();
    const links = [...document.querySelectorAll('.cta a')];

    expect(links.map((link) => link.href)).toEqual([
      'https://www.linkedin.com/in/kenjiyamamoto/',
      'https://github.com/kenjiyamamoto',
      'https://twitter.com/kenjiyamamoto'
    ]);
    for (const link of links) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener');
    }
  });
});
