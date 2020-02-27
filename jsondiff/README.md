<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->

# @broofa/jsondiff

Pragmatic and intuitive diff and patch functions for JSON data

## Installation

`npm install @broofa/jsondiff`

## Usage

Require it:

```javascript
const jsondiff = require('@broofa/jsondiff');

// ... or ES6 module style:
// import jsondiff from '@broofa/jsondiff';

```

Start with some `before` and `after` state:
```javascript
console.log(before);

⇒ {
⇒   name: 'my object',
⇒   description: "it's an object!",
⇒   details: { it: 'has', an: 'array', with: [ 'a', 'few', 'elements' ] }
⇒ }
```

```javascript
console.log(after);

⇒ {
⇒   name: 'updated object',
⇒   title: "it's an object!",
⇒   details: {
⇒     it: 'has',
⇒     an: 'array',
⇒     with: [ 'a', 'few', 'more', 'elements', { than: 'before' } ]
⇒   }
⇒ }
```

Create a patch that descibes the difference between the two:
```javascript
const patch = jsondiff.diff(before, after);
console.log(patch);

⇒ {
⇒   name: 'updated object',
⇒   description: '-',
⇒   details: { with: [ '+', '+', 'more', 'elements', { than: 'before' } ] },
⇒   title: "it's an object!"
⇒ }
```
*(Note the special DROP and KEEP values ("-" and "+")! These are explained in **Patch Objects**, below.)*

Apply `patch` to the before state to reproduce the `after` state:
```javascript
const patched = jsondiff.patch(before, patch);
console.log(patched);

⇒ {
⇒   name: 'updated object',
⇒   details: {
⇒     it: 'has',
⇒     an: 'array',
⇒     with: [ 'a', 'few', 'more', 'elements', { than: 'before' } ]
⇒   },
⇒   title: "it's an object!"
⇒ }
```

## Why yet-another diff module?

There are already several modules in this space - `deep-diff`, `rfc6902`, or `fast-json-patch`, to name a few. `deep-diff` is the most popular, however `rfc6902` is (to my mind) the most compelling because it will interoperate with other libraries that support [RFC6902 standard](https://tools.ietf.org/html/rfc6902).

However ... the patch formats used by these modules tends to be cryptic and overly verbose -
a list of the mutations needed to transform between the two states.  In the case
of `deep-diff` you end up with this patch:

```javascript
console.log(deepPatch);

⇒ [
⇒   {
⇒     kind: 'E',
⇒     path: [ 'name' ],
⇒     lhs: 'my object',
⇒     rhs: 'updated object'
⇒   },
⇒   { kind: 'D', path: [ 'description' ], lhs: "it's an object!" },
⇒   {
⇒     kind: 'A',
⇒     path: [ 'details', 'with' ],
⇒     index: 4,
⇒     item: { kind: 'N', rhs: [ [Function: Object] ] }
⇒   },
⇒   {
⇒     kind: 'A',
⇒     path: [ 'details', 'with' ],
⇒     index: 3,
⇒     item: { kind: 'N', rhs: 'elements' }
⇒   },
⇒   {
⇒     kind: 'E',
⇒     path: [ 'details', 'with', 2 ],
⇒     lhs: 'elements',
⇒     rhs: 'more'
⇒   },
⇒   { kind: 'N', path: [ 'title' ], rhs: "it's an object!" }
⇒ ]
```

And for `rfc6902`:

```javascript
console.log(rfcPatch);

⇒ [
⇒   { op: 'remove', path: '/description' },
⇒   { op: 'add', path: '/title', value: "it's an object!" },
⇒   { op: 'replace', path: '/name', value: 'updated object' },
⇒   { op: 'add', path: '/details/with/2', value: 'more' },
⇒   { op: 'add', path: '/details/with/-', value: { than: 'before' } }
⇒ ]
```

The advantage(?) of this module is that the patch structure mirrors the
structure of the target data.  As such, it terse, readable, and resilient.

That said, this module may not be for everyone.  In particular, readers may find
the DROP and KEEP values (described below) to be... "interesting".


## API

### jsondiff.diff(before, after)

Creates and returns a "patch object" that describes the differences between
`before` and `after`.  This object is suitable for use in `patch()`.

### jsondiff.patch(before, patch)

Applies a `patch` object to `before` and returns the result.

Note: Any result value that is deep-equal to it's `before` counterpart will
reference the 'before' value directly, allowing `===` to be used as a test
for deep equality.

### jsondiff.value(val)

Normalize patch values. Currently this just converts `DROP` values to
`undefined`, otherwise returns the value. This is useful in determining if a
patch has a meaningful value.  E.g.

```javascript
const newPatch = {foo: jsondiff.DROP, bar: 123};

newPatch.foo; // ⇨ '-'
jsondiff.value(newPatch.foo); // ⇨ undefined
jsondiff.value(newPatch.bar); // ⇨ 123
jsondiff.value(newPatch.whups); // ⇨ undefined

```

## Patch Objects

Patch objects are JSON objects with the same structure (schema) as the object
they apply to.  Applying a patch is (almost) as simple as doing a deep copy of
the patch onto the target object.  There are two special cases:

1. `jsondiff.DROP` ("`-`") values are "dropped" (deleted or set
   to `undefined`)
2. `jsondiff.KEEP` ("`+`") values are "kept" (resolve to the corresponding
   value in the target)

Note: `DROP` and `KEEP` are, admittedly, a hack.  If these exact string values
appear in data outside of patch objects, `diff()` and `patch()` may not function
correctly. That said, this is not expected to be an issue in real-world
conditions. (Both strings include a "private use" Unicode character that should
make them fairly unique.)

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)