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
General, pluralization is based on the preceeding value.

```javascript
simplur`I have ${1} kitt[en|ies]`; // ⇨ 'I have 1 kitten'
simplur`I have ${3} kitt[en|ies]`; // ⇨ 'I have 3 kitties'
```

### Look-ahead substitution
If there's no preceeding value, the following value is used.
```javascript
simplur`There [is|are] ${1} m[an|en]`; // ⇨ 'There is 1 man'
simplur`There [is|are] ${5} m[an|en]`; // ⇨ 'There are 5 men'
```

### Multiple tokens
You can have multiple tokens.  These follow the same rules as above.
```javascript
simplur`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // ⇨ 'There is 1 fox and 4 octopi'
simplur`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // ⇨ 'There are 4 foxes and 1 octopus'
```

### Custom quantity strings
To customize the displayed quantity, provide an array of the form `[quantity, text]`.
```javascript
simplur`You have ${[0, 'no']} chinchilla[|s]`; // ⇨ 'You have no chinchillas'
simplur`You have ${[1, 'one lonely']} chinchilla[|s]`; // ⇨ 'You have one lonely chinchilla'
simplur`You have ${[3, 'all the']} chinchilla[|s]`; // ⇨ 'You have all the chinchillas'
```

You may find this more generally useful when combined with a formatting
function, thusly:
```javascript
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
⇒ She has no brethren
⇒ She has one annoying brother
⇒ She has two brethren
⇒ She has 3 brethren
⇒ She has too many brethren
```

----
Markdown generated from README.md by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)