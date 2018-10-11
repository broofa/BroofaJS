# asyncConcat

Async method to concatenate a stream into a buffer

## Installation

`npm install @broofa/asyncconcat`

## Usage

```
const asyncConcat = require('@broofa/asyncconcat');

// Concatenate stream as a String
const asString = await asyncConcat(someStream, 'utf8');

// Concatenate stream as a Buffer
const asBuffer = await asyncConcat(someStream);
```
