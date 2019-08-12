# @broofa/mocha

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
npm i @broofa/mocha
```

## Usage

```
$ mocha test/foo.js test/bar.js
```

### `debugger` behavior

@broofa/mocha automatically triggers a `debugger` statement before each test
function when run with `--inspect-brk`.
