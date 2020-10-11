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

`simplur` is an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that formats pluralization tokens based on the quantities injected into the string.

### Simple case
Pluralization tokens have the form  "`[singular|plural]`" and are resolved
using the first expression found to the left of each token or, if no
left-expression is available, the first expression to the right.

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

### Custom quantities

Quantity values may be customized using value of the form, `[quantity, format function]`.  For example:

```javascript
function format(qty) {
  return qty == 1 ? 'sole' :
    qty == 2 ? 'twin' :
    qty;
}

simplur`Her ${[1, format]} br[other|ethren] left`; // ⇨ 'Her sole brother left'
simplur`Her ${[2, format]} br[other|ethren] left`; // ⇨ 'Her twin brethren left'
simplur`Her ${[3, format]} br[other|ethren] left`; // ⇨ 'Her 3 brethren left'
```

#### Hiding quantities

Quantites may be hidden by omitting the format function (i.e. just pass value in
    an Array), or by returning `null` or `undefined`.

**Note:** *Whitespace immediately following a hidden quantity will be removed.*

```javascript
simplur`${[1]} gen[us|era]`; // ⇨ 'genus'
simplur`${[2]} gen[us|era]`; // ⇨ 'genera'

function hideSingular(qty) {
  return qty == 1 ? null : qty;
}

// Note: Since the quantity is not displayed, it's position in the string is
// less important
simplur`Delete the ${[1, hideSingular]} cact[us|i]?`; // ⇨ 'Delete the cactus?'
simplur`Delete the ${[2, hideSingular]} cact[us|i]?`; // ⇨ 'Delete the 2 cacti?'
```

Custom

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)