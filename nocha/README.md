# nocha

A lightweight, drop-in alternative to `mocha`

Mocha is a great unit test tool, but it can be rather heavy.  It
adds [12MB worth of dependencies](http://npm.broofa.com/?q=mocha),
and debugging errors can be challenging because of how logging and error
reporting work, and how it integrates with things like Chrome Developer Tools.

This is minimal implementation of Mocha's BDD API.  BDD-based tests (tests that
use `describe()`, `it()`, `before()`, `beforeEach()`, etc) should work with no
modification.

The log output is slightly different than the original `mocha` to make logging
more intuitive.  All console and error output is immediately written to the
console.

## Installation

```
npm i nocha
```

## Usage

```
$ nocha test/foo.js test/bar.js
```

## flags

### --break=[suite or task number]

Wait for debugger to connect, then break immediately prior to running the
designated suite or task number.  You can find the number, preceeeding each
suite or task in the console output.

## ES6 module support

Tests with the `.mjs` extension will be loaded as ES6 modules.  These tests must
explicitely import mocha functions as follows:

```
import {describe, it, before, beforeEach, after, afterEach} from 'nocha';
```

## Debugging
