```javascript --hide
runmd.onRequire = path => path.replace(/^simplur$/, '..');
```

# Simplur

Simple, versatile string pluralization

## Installation

```
npm i simplur
```

Use CommonJS or ESM to import

```javascript --run main
const simplur = require('simplur');
```

```javascript --run es6
import simplur from 'simplur';
```

## Usage

`simplur` is applied as an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).  Tokens of the form "`[singular|plural]`" are replaced based on the values injected before (or after) them.

### Simple case
The singular/plural string is chosen based on the value injected to the left of
each token or, if no left-value is provided, the first value injected to the
right of the token.

```javascript --run main
simplur`I have ${1} kitt[en|ies]`; // RESULT
simplur`I have ${3} kitt[en|ies]`; // RESULT

simplur`There [is|are] ${1} m[an|en]`; // RESULT
simplur`There [is|are] ${5} m[an|en]`; // RESULT
```

### Multiple tokens
Multiple tokens and quantities are allowed.  These follow the same rules as above.

```javascript --run main
simplur`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // RESULT
simplur`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // RESULT
```

### Customizing quantities
Custom quantities may be specified by providing an Array value of the form `[quantity, formatFunction]`.

```javascript --run main
function formatQuantity(v) {
  return v < 1 ? 'no' :
    v == 1 ? 'one annoying' :
    v < 3 ? 'a few' :
    null;
}

simplur`She has ${[0, formatQuantity]} br[other|ethren]`; // RESULT
simplur`She has ${[1, formatQuantity]} br[other|ethren]`; // RESULT
simplur`She has ${[2, formatQuantity]} br[other|ethren]`; // RESULT
simplur`She has ${[3, formatQuantity]} br[other|ethren]`; // RESULT
```
