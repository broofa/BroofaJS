# asyncProxy

A simple, intuitive solution for converting node-style APIs to Promises.

This module is similar to utilities such as `bluebird.promisifyAll` and
`promiseproxy`. The main difference is that it's behavior is driven by calling
code rather than magical introspection or ad-hoc configuration options.

Key features ...

* **Tiny**. No dependencies, ~0.3KB when minified/compressed.
* **Zero API footprint**.  Does not modify the original API.
* **Drop-in replacement**.  asyncProxy objects are literal proxies for the original API.  Treat them exactly as you would the original API.
* **Simple promisification logic**. Just add "Async" to method name.  `api.fooAsync()` == `api.foo()`-promisified.
* **Simple multi-args logic**.  API callback takes more than one argument?  Array destructuring, FTW!

## Installation

You know the drill ...

```
npm i @broofa/asyncproxy
```

``` javascript
const asyncProxy = require('@broofa/asyncproxy');
```

## Example: Promisify `fs.readFile` (basic usage)

```javascript
// Wrap api in asyncProxy()
const fs = asyncProxy(require('fs'));

// An asyncProxy-ified apis is *identical* to the original api
console.log(fs === require('fs'));  // ==> true

// ... but promisifies any method invoked as `${methodName}Async`
const fileContents = await fs.readFileAsync('README.md', 'utf8');
```

## Example: Promisify `child.exec` (multiple callback arguments)

Anytime 2+ arguments are passed to a callback, the Promise resolves to an
argument Array:

```
// Promisified `exec` method
const child_process = asyncProxy(require('child_process'));

// Use array destructuring to extract result values
let [stdout, stderr] = await execAsync('ls');
```

## Example: Custom method name pattern

Appending `Async` to indicate a promise-returning method is the general
convention, but this may not always be desirable.  The `methodRegex` option
is used to detect which methods should be promisified.

E.g.  To use an "async\_"-prefix:

```
const fs = asyncProxy(require('fs'), {methodRegex: /^async_/});

const fileContents = await fs.async_readFile('README.md', 'utf8');
```
