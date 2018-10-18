#!/usr/bin/env node

const fs = require('fs');
const globby = require('globby');
const path = require('path');

async function main() {
  const nodes = fs.readdirSync('.');
  let subpackages = await globby(['**/*/package.json', '!**/node_modules/**']);
  subpackages = subpackages.map(path => {
    const pkg = require('../' + path);
    const pkgName = path.replace('/package.json', '');
    console.log(pkg.name, pkg.description);

    return `| [${pkg.name}](${pkgName}) | ${pkg.description} |`
  });

  fs.writeFileSync(path.join(__dirname, '../README.md'), `
# BroofaJS

Misc. JS modules that may be of broader interest.  Each module is independent of the others, and
often free from dependencies on other modules.  License is typically ISC, but see the respective\`package.json\` files for detailed info.

| module | description |
| --- | --- |
${subpackages.join('\n')}
`);
}

main();
