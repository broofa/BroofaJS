const chalk = require('chalk');
const Test = require('./Test');

const TOP_SUITE = Symbol('TOP Suite');

let currentSuite;

module.exports = class Suite {
  static before(cb) {
    currentSuite.before = cb;
  }

  static beforeEach(cb) {
    currentSuite.beforeEach = cb;
  }

  static after(cb) {
    currentSuite.after = cb;
  }

  static afterEach(cb) {
    currentSuite.afterEach = cb;
  }

  static async describe(name, suiteFunc) {
    const suite = new Suite(name);

    currentSuite.add(suite);

    const deactivate = suite.activate();

    try {
      // Invoke suite setup function
      const p = suiteFunc();
      if (p && p.then) await(p);
    } finally {
      deactivate();
    }
  }

  static async it(...args) {
    currentSuite.add(new Test(...args));
  }

  _hooks = {};
  _runnables = [];

  constructor(name = TOP_SUITE) {
    this.name = name;
  }

  activate() {
    const previousSuite = currentSuite;

    currentSuite = this;

    // Restore function
    return function() {currentSuite = previousSuite};
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
    this._runnables.push(runnable);
  }

  async run() {
    if (this.name != TOP_SUITE) console.log(`\n${chalk.bold.underline(this.name)}`);

    await this.runHook('before');

    let last;
    for (const runnable of this._runnables) {
      if (runnable instanceof Test) {
        if (last instanceof Suite && this.name != TOP_SUITE) {
          console.log(`\n${chalk.bold.underline(this.name)} (continued)`);
        }
      }

      await runnable.run(this);

      last = runnable;
    }

    await this.runHook('after');
  }

  activate() {
    const currentSuite = this;

    const previousGlobal = {...global};

    // Suite-module globals
    Object.assign(global, {
      before(cb) {currentSuite.before = cb;},
      beforeEach(cb) {currentSuite.beforeEach = cb;},

      after(cb) {currentSuite.after = cb;},
      afterEach(cb) {currentSuite.afterEach = cb;},

      async describe(name, suiteFunc) {
        const suite = new Suite(name);

        currentSuite.add(suite);

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
        currentSuite.add(new Test(...args));
      }
    });

    return () => {
      Object.assign(global, previousGlobal);
      for (const k of Object.keys(global)) {
        if (!(k in previousGlobal)) delete global[k];
      }
    };
  }
};
