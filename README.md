# html-slim

[![Node.js CI](https://github.com/kawanet/html-slim/workflows/Node.js%20CI/badge.svg)](https://github.com/kawanet/html-slim/actions/)
[![npm version](https://img.shields.io/npm/v/html-slim)](https://www.npmjs.com/package/html-slim)
[![gzip size](https://img.badgesize.io/https://unpkg.com/html-slim/dist/html-slim.min.js?compression=gzip)](https://unpkg.com/html-slim/dist/html-slim.min.js)

A utility to slim down HTML by removing spaces, comments, tags and attributes.

## SYNOPSIS

```js
import {slim} from "html-slim";

const slimFn = slim({
  // CSS selector for removing tags
  selector: "body > header, body > footer",

  // RegExp for removing tags, attributes and class tokens
  tag: /^(next-|nextjs-)/,
  attr: /^data-v-/,
  className: /^_\w{7}$/,

  // shortcut for removing scripts and styles
  script: true,
  ldJson: false,
  style: true,

  // removing spaces and comments per default
  space: true,
  comment: true,
});

const compactHtml = slimFn(originalHtml);
```

## COMMONJS

```js
const {slim} = require("html-slim");
```

On Node.js 20.19 and later `require()` reaches the ES module directly. Below
that it resolves to the bundled build instead, which carries its own copy of
the parser rather than loading the ESM-only dependencies.

## PROCESSING INSTRUCTIONS

HTML has no processing instructions. `<?php ?>`, `<?xml ?>` and malformed
declarations such as `<! foo >` parse as comments, which this removes by
default:

```html
<div><?php echo 1; ?></div>
<div><! foo ></div>
```

becomes:

```html
<div></div>
<div></div>
```

`{comment: false}` keeps them, but as comments — `<?php` comes back as
`<!--?php`. Run this on rendered output, not on templates.

## BROWSERS

```js
<script src="https://unpkg.com/html-slim/dist/html-slim.min.js"></script>
<script>
  const slimFn = slim({})
  const html = slimFn(document.documentElement.outerHTML);
  console.log(html);
</script>
```

## TYPESCRIPT

See TypeScript declaration [index.d.ts](https://github.com/kawanet/html-slim/blob/main/types/html-slim.d.ts) for detail.

## LINKS

- https://github.com/kawanet/html-slim
- https://www.npmjs.com/package/html-slim
