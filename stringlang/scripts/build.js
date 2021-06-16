import fetch from 'node-fetch';
import assert from 'assert';

async function main() {
  // Fetch block definitions from unicode.org site
  const body = await fetch('http://www.unicode.org/Public/UNIDATA/Blocks.txt')
    .then(res => res.text());


  // Build case statements for each block.
  let lastMax = 0;
  const BLOCKS = body.split(/\n/)
    .filter(line => /^[0-9A-F]+\.\./.test(line))
    .map(line => {
      let [min, max, block] = line.split(/\.\.|; /);
      min = parseInt(min, 16);
      max = parseInt(max, 16);

      assert(min < max, `Invalid range for '${block}' (${min} - ${max})`);

      // NOTE: JS object entries _are ordered_, so we
      assert(lastMax <= min, `Non-monotonic order for "${block}"`);
      lastMax = max;

      return `  ['${block}', ${min}, ${max}]`;
    });

  process.stdout.write('export default [\n'+BLOCKS.join(',\n') + '\n];');
}

main().catch(console.error);
