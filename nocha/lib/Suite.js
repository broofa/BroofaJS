const chalk = require('chalk');
const Runnable = require('./Runnable');
const Test = require('./Test');
const util = require('util');
const {argv} = require('yargs');

let currentSuite;

class Suite extends Runnable {
  _hooks = {};
  runnables = [];

  constructor(parent = null, name = null) {
    super(parent, name);
  }

  set before(v) {this._hooks.before = v;}
  set beforeEach(v) {this._hooks.beforeEach = v;}
  set after(v) {this._hooks.after = v;}
  set afterEach(v) {this._hooks.afterEach = v;}

  async runHook(hookName) {
    if (!(hookName in this._hooks)) return;
    const p = this._hooks[hookName].apply(null);
    return p && p.then ? await p : p;
  }

  add(runnable) {
    this.runnables.push(runnable);
  }

  async run() {
    if (this.shouldSkip()) return;

    if (this.parent) console.log(`${chalk.bold(this.title)}`);

    // --break users: You ended up here because you set --break, you can step
    // into this Suite's "before" hook below (if defined), or step into this
    // suite's "runnable" sub-Suites or sub-Tasks in the for-runnable-of loop
    // after that.

    await this.runHook('before');

    const deactivate = this.activate();
    try {
      if (this.shouldBreak()) debugger;

      // --break users: You can step through this suite's tests in this
      // loop here ...
      for (const runnable of this.runnables) {
        await runnable.run(this);
      }
      console.log();

    } finally {
      await this.runHook('after');
      deactivate();
    }
  }

  getErrors(errors = []) {
    for (const runnable of this.runnables) {
      if (runnable instanceof Test) {
        if (runnable.error) errors.push(runnable);
      } else {
        runnable.getErrors(errors);
      }
    }

    return errors;
  }

  activate() {
    const self = this;

    const before = {...global};

    const GLOBALS = {
      before(cb) {self.before = cb;},
      beforeEach(cb) {self.beforeEach = cb;},

      after(cb) {self.after = cb;},
      afterEach(cb) {self.afterEach = cb;},

      async describe(name, suiteFunc) {
        const suite = new Suite(self, name);

        self.add(suite);

        const deactivate = suite.activate();

        try {
          // Invoke suite setup function
          const p = suiteFunc();
          if (p && p.then) await(p);
        } catch (err) {
          console.error(err);
          process.exit(1);
        } finally {
          deactivate();
        }
      },

      async it(...args) {
        self.add(new Test(self, ...args));
      },

      log(...args) {
        const out = util.inspect(...args).replace(/^/mg, '  ');
        console.log(chalk.dim(out));
      }
    };

    // Suite-module globals
    Object.assign(global, GLOBALS);

    return () => {
      for (const k of Object.keys(global)) {
        if (k in before) {
          global[k] = before[k];
        } else {
          delete global[k];
        }
      }
    };
  }
};

exports.Suite = Suite;
