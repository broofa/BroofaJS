# nocha

An drop-in replacement for [parts of] `mocha` that makes debugging unit tests easier.

* `--only` option for limiting  to a specific test
* `--break` to break immediately before entering a test 
* ES6 support (experimental)

## Usage

```
$ nocha test/foo.js test/bar.js
```

## Example - Normal run
```
$ nocha test/index.js
test/index.js
1 Scrobble
2 All the things
2.1 Frabjous day
2.2 Some of the things

All tests passed! 🎉
```

## Example - Run a single test
```
$ nocha --only=2.1 test/
test/index.js
2 All the things
2.1 Frabjous day
```

## Example - Pause debugger at a given test
```
$ nocha --break=2.1 test/
Debugger listening on ws://127.0.0.1:9229/ab07086f-8e63-401f-8079-d4a58803fcc8
For help, see: https://nodejs.org/en/docs/inspector

    <Pauses here until Developer Tools attach, then resumes>

Debugger attached.
test/index.js
1 Scrobble
2 All the things
2.1 Frabjous day

    <Pauses in debugger immediately before stepping into your test function>

2.2 Some of the things

All tests passed! 🎉
```

## Flags

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
