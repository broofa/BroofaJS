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
import * as simplur from 'simplur';
```

## Usage

`simplur` is applied as an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).  Any token of the form "`[singular|plural]`", will be replaced with the appropriate value depending on the value of the expression being injected.  For example ...

Simple case:


```javascript
simplur`I have ${1} kitt[en|ies]`; // ⇨ 'I have 1 kitten'
simplur`I have ${3} kitt[en|ies]`; // ⇨ 'I have 3 kitties'

```

Simplur also supports look-ahead substitution:

```javascript
simplur`There [is|are] ${1} m[an|en]`; // ⇨ 'There is 1 man'
simplur`There [is|are] ${5} m[an|en]`; // ⇨ 'There are 5 men'

```

It also works with multiple injected values (substitution uses preceeding
    expression value)

```javascript
simplur`There [is|are] ${1} fox[|es] and ${4} octopus[|es]`; // ⇨ 'There is 1 fox and 4 octopuses'
simplur`There [is|are] ${4} fox[|es] and ${1} octopus[|es]`; // ⇨ 'There are 4 foxes and 1 octopus'

```

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)
