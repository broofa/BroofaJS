const chalk = require('chalk');
const Runnable = require('./Runnable');
const {argv} = require('yargs');

module.exports = class Test extends Runnable {
  constructor(parent, name, testFunc) {
    super(parent, name);
    this.testFunc = testFunc;
  }

  async run(suite) {
    console.log(this.title);

    await this.parent.runHook('beforeEach');

    try {
      await new Promise((resolve, reject) => {
        // Hi, if you're in your debugger you can get to your test function by
        // "step"-ing into `testFunc()` in the next line
        if (argv.break && argv.break == this.id) debugger;
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
    } catch (err) {
      this.error = err;
      console.log(this.id.replace(/./g, ' '), chalk.red(`ERROR: ${err.message}`));
    }

    await this.parent.runHook('afterEach');
  }
};
