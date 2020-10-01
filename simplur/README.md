<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->

# Simplur

Simple, versatile string pluralization

## Installation

```
npm i simplur
```

Use CommonJS or ESM to import

```javascript
const simplur = require('simplur');
```

```javascript
import simplur from 'simplur';
```

## Usage

`simplur` is applied as an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).  Tokens of the form "`[singular|plural]`" are replaced based on the values injected before (or after) them.

### Simple case
The singular/plural string is chosen based on the value injected to the left of
each token or, if no left-value is provided, the first value injected to the
right of the token.

```javascript
simplur`I have ${1} kitt[en|ies]`; // ⇨ 'I have 1 kitten'
simplur`I have ${3} kitt[en|ies]`; // ⇨ 'I have 3 kitties'

simplur`There [is|are] ${1} m[an|en]`; // ⇨ 'There is 1 man'
simplur`There [is|are] ${5} m[an|en]`; // ⇨ 'There are 5 men'
```

### Multiple tokens
Multiple tokens and quantities are allowed.  These follow the same rules as above.

```javascript
simplur`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // ⇨ 'There is 1 fox and 4 octopi'
simplur`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // ⇨ 'There are 4 foxes and 1 octopus'
```

### Customizing quantities
Custom quantities may be specified by providing an Array value of the form `[quantity, formatFunction]`.

```javascript
function formatQuantity(v) {
  return v < 1 ? 'no' :
    v == 1 ? 'one annoying' :
    v < 3 ? 'a few' :
    null;
}

simplur`She has ${[0, formatQuantity]} br[other|ethren]`; // ⇨ 'She has no brethren'
simplur`She has ${[1, formatQuantity]} br[other|ethren]`; // ⇨ 'She has one annoying brother'
simplur`She has ${[2, formatQuantity]} br[other|ethren]`; // ⇨ 'She has a few brethren'
simplur`She has ${[3, formatQuantity]} br[other|ethren]`; // ⇨ 'She has 3 brethren'
```

----
Markdown generated from README.md by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)