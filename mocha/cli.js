#!/usr/bin/env node

const {Suite} = require('./lib/Suite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {argv} = require('yargs');
const {spawn} = require('child_process');

let breakBeforeTest = false;

async function runFile(filename) {
  const suiteName = filename.replace(process.cwd() + '/', '');
  console.log(chalk.bold.underline(suiteName));

  suite = new Suite(null, suiteName);
  const deactivate = suite.activate();

  // Purge require() cache
  for (const k in require.cache) delete require.cache[k];

  try {
    require(filename);
    await suite.run();
  } finally {
    deactivate();
  }

  return suite;
}

/**
 * Recursive directory search
 */
function flattenPaths(name, accum = []) {
  const stat = fs.lstatSync(name);

  if (stat.isFile()) {
    // Run the file
    accum.push(name);
  } else if (stat.isDirectory()) {
    // Run each file in the directory
    const entries = fs.readdirSync(name)
      .filter(e => /\.m?js$/.test(e))
      .map(e => path.join(name, e));

    for (const entry of entries) {
      const estat = fs.lstatSync(entry);
      if (estat.isDirectory()) continue;
      if (!estat.isFile()) continue;

      accum.push(entry);
    }
  }

  return accum;
}

async function main() {
  const args = process.argv.slice(2);

  const paths = args.reduce((acc, p) => flattenPaths(path.resolve(process.cwd(), p), acc), []);

  const allSuites = new Suite();

  for (const filepath of paths) {
    allSuites.add(await runFile(filepath));
  }

  const errors = allSuites.getErrors();

  if (!errors.length) {
    console.log(chalk.green('All tests passed! \u{1f389}'));
  } else {
    console.log(chalk.red.inverse(`${errors.length} failures\u{1f61e}`));

    errors.forEach(test => {
      console.log()
      console.log(chalk.red(`${test.title}`));
      console.log(test.error);
    });

    process.exit(1);
  }
}

console.log(process.argv);
const nodeArgs = process.argv.filter(arg => arg.startsWith('-'));

if (nodeArgs.length) {
  // We have flags that need to be passed to node, so launch node with those
  // flags set properly
  const unitArgs = process.argv.filter(arg => !arg.startsWith('-'));
  unitArgs.shift(); // Remove exec path

  // Break before tests?
  // if (nodeArgs.includes('--inspect-brk')) unitArgs.unshift('-b');

  const proc = spawn(process.execPath, [...nodeArgs, ...unitArgs], {stdio: 'inherit'});

  proc.on('error', console.error);
  proc.on('exit', (code, sig) => process.exit(code));
} else {
  breakBeforeTest = nodeArgs.includes('-b');

  // Looks good.   Go ahead and run the tests
  main();
}
