const chalk = require('chalk');
const Runnable = require('./Runnable');

module.exports = class Test extends Runnable {
  constructor(parent, name, testFunc) {
    super(parent, name);
    this.testFunc = testFunc;
  }

  async run(suite) {
    if (this.shouldSkip()) return;

    console.log(this.title);

    try {
      await this.parent.runHook('beforeEach');

      await new Promise((resolve, reject) => {
        if (this.shouldBreak()) debugger;
        // --break users: You can step into your test function by stepping into
        // `testFunc` here ...
        const p = this.testFunc();

        if (!p || !p.then) return resolve(p);

        const timer = setTimeout(() => reject(Error('timed out')), 3000);
        p
          .then(val => {
            clearTimeout(timer);
            resolve(val);
          })
          .catch(err => {
            clearTimeout(timer);
            reject(err);
          });
      });

      await this.parent.runHook('afterEach');
    } catch (err) {
      this.error = err;
      console.log(
        this.id.replace(/./g, ' '),
        chalk.red(err)
      );
    }
  }
};
