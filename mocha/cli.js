#!/usr/bin/env node

const Suite = require('./lib/Suite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {argv} = require('yargs');
const {spawn} = require('child_process');

let breakBeforeTest = false;

async function runFile(filename) {
  console.log(chalk.inverse('\n' + filename));
  // Each file starts with a clean require cache
  for (const k in require.cache) delete require.cache[k];

  suite = new Suite();
  const deactivate = suite.activate();

  try {
    if (/\.mjs$/.test(filename)) {
      import(filename);
    } else {
      require(filename);
    }
  } finally {
    deactivate();
  }

  await suite.run();
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
  const stats = {nTests: 0, nFailed: 0};
  const args = process.argv.slice(2);

  const paths = args.reduce((acc, p) => flattenPaths(path.resolve(process.cwd(), p), acc), []);

  for (const filepath of paths) {
    await runFile(filepath, stats);
  }

  if (!stats.nFailed) {
    console.log(chalk.green('\nAll tests passed! \u{1f389}'));
  } else {
    console.log(chalk.red(`\n${stats.nFailed} failures\u{1f61e}`));
    process.exit(1);
  }
}

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
