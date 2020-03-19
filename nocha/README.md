# nocha

An drop-in replacement for [parts of] `mocha` that makes debugging unit tests easier.

* `--only` option for limiting  to a specific test
* `--break` to break immediately before entering a test 
* ES6 support (experimental)

## Usage

```
$ nocha test/foo.js test/bar.js
```

## flags

The flags below refer to step #'s, which precede each task and suite title in
console output.  E.g. "1.3 **Validates Email**"'s step number is `1.3`.

### --only={step number}

Run the named step, and only the named step.

### --break={step number}

Waits for debugger to connect then breaks immediately prior to running the
designated step.

## ES6 module support (experimental)

Tests with the `.mjs` extension will be loaded as ES6 modules.  These tests must
explicitely import mocha functions as follows:

```
import {describe, it, before, beforeEach, after, afterEach} from 'nocha';
```
