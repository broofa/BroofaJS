# nocha

A lightweight, drop-in alternative to `mocha`

Mocha is a great unit test tool, but it can be rather heavy.  It
adds [12MB worth of dependencies](http://npm.broofa.com/?q=mocha),
and debugging errors can be challenging because of how logging and error
reporting work, and how it integrates with things like Chrome Developer Tools.

This is minimal implementation of Mocha's BDD API.  BDD-based tests (tests that
use `describe()`, `it()`, `before()`, `beforeEach()`, etc) should work with no
modification.

The log output is slightly different than the original `mocha` to improve
readability and error reporting.

Also, this adds a `--break` feature (see below) that allows for setting on-the-fly debugging breakpoints.

## Installation

```
npm i nocha
```

## Usage

```
$ nocha test/foo.js test/bar.js
```

## flags

The flags below refer to step #'s, which precede each task and suite title in
console output.  E.g. "1.3 **Validates Email**"'s step number is `1.3`.

### --only=[step number]

Run the named step, and only the named step.

### --break=[step number]

Waits for debugger to connect then breaks immediately prior to running the
designated step.

## ES6 module support

Tests with the `.mjs` extension will be loaded as ES6 modules.  These tests must
explicitely import mocha functions as follows:

```
import {describe, it, before, beforeEach, after, afterEach} from 'nocha';
```

## Debugging
