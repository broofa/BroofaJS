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
General, pluralization is based on the preceeding value.

```javascript --run main
simplur`I have ${1} kitt[en|ies]`; // RESULT
simplur`I have ${3} kitt[en|ies]`; // RESULT
```

### Look-ahead substitution
If there's no preceeding value, the following value is used.
```javascript --run main
simplur`There [is|are] ${1} m[an|en]`; // RESULT
simplur`There [is|are] ${5} m[an|en]`; // RESULT
```

### Multiple tokens
You can have multiple tokens.  These follow the same rules as above.
```javascript --run main
simplur`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // RESULT
simplur`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // RESULT
```

### Custom quantity strings
To customize the displayed quantity, provide an array of the form `[quantity, text]`.
```javascript --run main
simplur`You have ${[0, 'no']} chinchilla[|s]`; // RESULT
simplur`You have ${[1, 'one lonely']} chinchilla[|s]`; // RESULT
simplur`You have ${[3, 'all the']} chinchilla[|s]`; // RESULT
```

You may find this more generally useful when combined with a formatting
function, thusly:
```javascript --run main
function formatQuantity(v) {
  switch (v) {
    case 0: return 'no';
    case 1: return 'one annoying';
    case 2: return 'two';
    default: return v > 3 ? 'too many' : v;
  }
}

for (let i = 0; i <= 4; i++) {
  console.log(simplur`She has ${[i, formatQuantity(i)]} br[other|ethren]`);
}
```
