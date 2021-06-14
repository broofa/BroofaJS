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

`simplur` is an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that formats pluralization tokens based on the quantities injected into the string.

### Simple case
Pluralization tokens have the form  "`[singular|plural]`" and are resolved
using the first expression found to the left of each token or, if no
left-expression is available, the first expression to the right.

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

### Custom quantities

Quantity values may be customized using value of the form, `[quantity, format function]`.  For example:

```javascript --run main
function format(qty) {
  return qty == 1 ? 'sole' :
    qty == 2 ? 'twin' :
    qty;
}

simplur`Her ${[1, format]} br[other|ethren] left`; // RESULT
simplur`Her ${[2, format]} br[other|ethren] left`; // RESULT
simplur`Her ${[3, format]} br[other|ethren] left`; // RESULT
```

#### Hiding quantities

Quantites may be hidden by omitting the format function (i.e. just pass value in
    an Array), or by returning `null` or `undefined`.

**Note:** *Whitespace immediately following a hidden quantity will be removed.*

```javascript --run main
simplur`${[1]} gen[us|era]`; // RESULT
simplur`${[2]} gen[us|era]`; // RESULT

function hideSingular(qty) {
  return qty == 1 ? null : qty;
}

simplur`Delete the ${[1, hideSingular]} cact[us|i]?`; // RESULT
simplur`Delete the ${[2, hideSingular]} cact[us|i]?`; // RESULT
```

Custom
