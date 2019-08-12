#!/usr/bin/env node

const {spawn} = require('child_process');
const fs = require('fs');

const path = require('path');
const colors = require('colors');

const TOP = Symbol('top suite');

let breakBeforeTest = false;

class Test {
  constructor(name, func) {
    this.name = name;
    this.func = func;
  }

  async run(stats, suite) {
    console.log(colors.dim(`- ${this.name}`));

    if (breakBeforeTest) debugger;

    try {
      if (suite.beforeEach) await suite.beforeEach();
      let done;
      if (this.func.length == 1) {
        done = new Promise((resolve, reject) => {
          this.func(resolve)
        });
      } else {
        done = this.func();
      }
      await done;
    } catch (err) {
      let lines = err.stack.split('\n');
      const i = lines.findIndex(l => /\/mocha:/.test(l));
      if (i > 0) lines = lines.slice(0, i);
      lines[0] = colors.red.bold(lines[0]);
      err.stack = lines.map(l => '  ' + l).join('\n');
      console.error(err);
      stats.nFailed = (stats.nFailed || 0) + 1;
    } finally {
      stats.nTests = (stats.nTests || 0) + 1;
      if (suite.afterEach) await suite.afterEach();
    }
  }
}

class Suite {
  constructor(name) {
    this.name = name;
    this.runnables = [];
  }

  add(runnable) {
    this.runnables.push(runnable);
  }

  error(err) {
  }

  async run(stats, suite) {
    if (this.name != TOP) console.log(`\n${colors.bold.underline(this.name)}`);
    if (this.before) await this.before();
    let last, hasError;
    for (const runnable of this.runnables) {
      if (runnable instanceof Test && last instanceof Suite) {
        if (this.name != TOP) console.log(`\n${colors.bold.underline(this.name)} continued ...`);
      }
      hasError |= await runnable.run(stats, this);
      last = runnable;
    }

    if (this.after) await this.after();

    return stats;
  }
}

let suites;
function _suite() {return suites[suites.length-1]};

Object.assign(global, {
  before(cb) {_suite().before = cb;},
  beforeEach(cb) {_suite().beforeEach = cb;},
  after(cb) {_suite().after = cb;},
  afterEach(cb) {_suite().afterEach = cb;},

  async describe(name, func) {
    const suite = new Suite(name);
    _suite().add(suite);
    suites.push(suite);
    try {
      const p = func();
      if (p && p.then) await(p);
    } catch(err) {
      console.error(err);
      process.exit(1);
    } finally {
      suites.pop();
    }
  },

  async it(...args) {
    _suite().add(new Test(...args));
  }
});

async function runFile(filename, stats) {
  // Each file starts with a clean require cache
  for (const k in require.cache) delete require.cache[k];

  // Each file starts with a clean suite stack
  suites = [new Suite(TOP)];

  try {
    require(filename);
    await suites[0].run(stats);
  } catch (err) {
    err.message = `${filename}\n${err.message}`;
    throw err;
  }
}

function flattenPaths(name, accum = []) {
  let stat = fs.lstatSync(name);

  if (stat.isFile()) {
    // Run the file
    accum.push(name);
  } else if (stat.isDirectory()) {
    // Run each file in the directory
    let entries = fs.readdirSync(name)
      .filter(e => /\.js$/.test(e))
      .map(e => path.join(name, e));

    for (const entry of entries) {
      const estat = fs.lstatSync(entry);
      if (estat.isDirectory()) continue;
      if (!estat.isFile()) continue;

      accum.push(entry);
    };
  }

  return accum;
}

async function main() {
  const stats = {nTests: 0, nFailed: 0};
  const args = process.argv.slice(2);

  const paths = args.reduce((acc, p) => flattenPaths(path.resolve(process.cwd(), p), acc), []);

  for (let filepath of paths) {
    let stat;
    await runFile(filepath, stats);
  }

  if (!stats.nFailed) {
    console.log(colors.green(`\nAll tests passed! \u{1f389}`));
  } else {
    console.log(colors.red(`\n${stats.nFailed} failures\u{1f61e}`));
    process.exit(1);
  }
}

const nodeArgs = process.argv.filter(arg => arg.startsWith('-'));

if (nodeArgs.length) {
  // Break before tests?
  if (nodeArgs.includes('--inspect-brk')) unitArgs.unshift('-b');

  // We have flags that need to be passed to node, so launch node with those
  // flags set properly
  const unitArgs = process.argv.filter(arg => !arg.startsWith('-'));
  unitArgs.shift(); // Remove exec path
  const proc = spawn(process.execPath, [...nodeArgs, ...unitArgs], {stdio: 'inherit'});

  proc.on('error', console.error);
  proc.on('exit', (code, sig) => process.exit(code));
} else {
  breakBeforeTest = nodeArgs.includes('-b');

  // Looks good.   Go ahead and run the tests
  main();
}
