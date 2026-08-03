# kenjiyamamoto
personal website

## Tests

Unit tests run the site's scripts inside jsdom with [Vitest](https://vitest.dev).

```sh
npm install
npm test        # run the suite
npm run coverage
```

`static/js/base.js` is imported directly, so it appears in the coverage report.
The inline scripts of `index.html` and `geo.html` are exercised by parsing the
real HTML files in jsdom, which v8 cannot instrument, so they are excluded from
the coverage numbers.
