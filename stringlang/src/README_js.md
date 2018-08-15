```javascript --hide
runmd.onRequire = path => path.replace(/^stringlang/, './');
```

# StringLang

Count characters by unicode block

## Installation

```
npm i @broofa/stringlang
```

## Example

```javascript --run
const StringLang = require('stringlang');

const sl = new StringLang('Hello World or Καλημέρα κόσμε or こんにちは 世界');

// Use inspect() to see all block counts
sl.inspect(); // RESULT

// There is also a property for each block containing the character counts
const monkeys = new StringLang('🙈🙉🙊');
monkeys.emoticons; // RESULT
```
