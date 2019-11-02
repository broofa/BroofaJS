```javascript --hide
runmd.onRequire = path => path.replace(/^simplur$/, '..');
```

# Simplur

Simple, versatile string pluralization

## Installation

```
npm i /simplur
```

Use CommonJS or ESM to import

```javascript --run main
const simplur = require('simplur');
```

```javascript
import * as simplur from 'simplur';
```

## Usage

`simplur` is applied as an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).  Any token of the form "`[singular|plural]`", will be replaced with the appropriate value depending on the value of the expression being injected.  For example ...

Simple case:


```javascript --run main
simplur`I have ${1} kitt[en|ies]`; // RESULT
simplur`I have ${3} kitt[en|ies]`; // RESULT
```

Simplur also supports look-ahead substitution:

```javascript --run main
simplur`There [is|are] ${1} m[an|en]`; // RESULT
simplur`There [is|are] ${5} m[an|en]`; // RESULT
```

It also works with multiple injected values (substitution uses preceeding
    expression value)

```javascript --run main
simplur`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // RESULT
simplur`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // RESULT
```
