var assert = require('assert');
var asyncConcat = require('..');
var {Readable} = require('stream');

describe(__filename, () => {
  it('concats', async () => {
    const input = 'now is the time for all good men'.split(/ /g, '');

    // Create a stream that has > 1 chunk of data
    const src = new Readable();
    src._read = function(size) {
      for (const word of input) {
        this.push(word, 'utf8');
      }
      this.push(null);
    };

    // Concat the stream as both string and Buffer
    const output = await Promise.all([
      asyncConcat(src, 'utf8'),
      asyncConcat(src)
    ]);

    assert.equal(input.join(''), output[0]);
    assert(Buffer.from(input.join('')).equals(output[1]));
  });
});
