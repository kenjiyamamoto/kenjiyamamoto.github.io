// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const PAGE = `
  <a id="instagram" href="#instafeed">Instagram</a>
  <div id="instafeed"></div>
  <script id="first-script"></script>`;

let run;
let instances;

function stubInstafeed() {
  instances = [];
  run = vi.fn();
  globalThis.Instafeed = function Instafeed(options) {
    this.options = options;
    this.run = run;
    instances.push(this);
  };
}

async function loadBase(html = PAGE) {
  document.body.innerHTML = html;
  stubInstafeed();
  vi.resetModules();
  await import('../static/js/base.js');
}

function click(element, init = {}) {
  const event = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    ...init
  });
  element.dispatchEvent(event);
  return event;
}

afterEach(() => {
  delete globalThis.Instafeed;
  delete window.twttr;
  document.body.innerHTML = '';
});

describe('instagram feed', () => {
  let instagram;
  let content;

  beforeEach(async () => {
    await loadBase();
    instagram = document.getElementById('instagram');
    content = document.getElementById('instafeed');
  });

  it('creates a single Instafeed with the configured feed options', () => {
    expect(instances).toHaveLength(1);
    expect(instances[0].options).toMatchObject({
      get: 'user',
      userId: '7608',
      sortBy: 'most-liked',
      limit: 10
    });
  });

  it('does not fetch the feed before the trigger is clicked', () => {
    expect(run).not.toHaveBeenCalled();
    expect(content.className).toBe('');
  });

  it('runs the feed and reveals the container on click', () => {
    const event = click(instagram);

    expect(run).toHaveBeenCalledTimes(1);
    expect(content.className).toBe('animated bounceIn delay-1s show');
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not re-run the feed while it already has content', () => {
    click(instagram);
    content.innerHTML = '<img src="photo.jpg">';
    const event = click(instagram);

    expect(run).toHaveBeenCalledTimes(1);
    expect(content.innerHTML).toBe('<img src="photo.jpg">');
    expect(event.defaultPrevented).toBe(true);
  });

  it('clears the feed when the container backdrop is clicked', () => {
    click(instagram);
    content.innerHTML = '<img src="photo.jpg">';
    click(content);

    expect(content.innerHTML).toBe('');
    expect(content.className).toBe('');
  });

  it('keeps the feed open when one of its children is clicked', () => {
    click(instagram);
    content.innerHTML = '<img id="photo" src="photo.jpg">';
    click(document.getElementById('photo'));

    expect(content.innerHTML).toBe('<img id="photo" src="photo.jpg">');
    expect(content.className).toBe('animated bounceIn delay-1s show');
  });

  it('registers the backdrop handler only once', () => {
    click(instagram);
    click(instagram);
    content.innerHTML = '<img src="photo.jpg">';
    click(content);

    expect(content.innerHTML).toBe('');
  });
});

describe('twitter widget bootstrap', () => {
  it('injects the widgets script before the first existing script', async () => {
    await loadBase();
    const injected = document.getElementById('twitter-wjs');

    expect(injected).not.toBeNull();
    expect(injected.tagName).toBe('SCRIPT');
    expect(injected.src).toBe('https://platform.twitter.com/widgets.js');
    expect(injected.nextElementSibling.id).toBe('first-script');
  });

  it('exposes a ready queue on window.twttr', async () => {
    await loadBase();
    const callback = vi.fn();

    window.twttr.ready(callback);

    expect(window.twttr._e).toEqual([callback]);
    expect(callback).not.toHaveBeenCalled();
  });

  it('reuses the existing twttr object when the script is already present', async () => {
    const existing = { widgets: 'already-loaded' };
    window.twttr = existing;

    await loadBase(`
      <a id="instagram" href="#instafeed">Instagram</a>
      <div id="instafeed"></div>
      <script id="twitter-wjs"></script>`);

    expect(window.twttr).toBe(existing);
    expect(document.body.querySelectorAll('script')).toHaveLength(1);
  });
});
