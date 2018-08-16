#!/usr/bin/env node

const fs = require('fs');
const globby = require('globby');
const path = require('path');

async function main() {
  const nodes = fs.readdirSync('.');
  let subpackages = await globby(['**/*/package.json', '!**/node_modules/**']);
  console.log(subpackages);
  subpackages = subpackages.map(path => {
    const pkg = require('../' + path);
    const pkgName = path.replace('/package.json', '');

    return `
## [${pkg.name}](${pkgName})

${pkg.description}
    `
  });

  fs.writeFileSync(path.join(__dirname, '../README.md'), `
# BroofaJS

Misc. JS utilities that may be of broader interest.  See subdirectories for documentation

${subpackages.join('\n')}
    `);
}

main();
