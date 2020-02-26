const chalk = require('chalk');
const Runnable = require('./Runnable');

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
        const p = this.testFunc();
        if (!p || !p.then) return resolve(p);

        const timer = setTimeout(() => reject(Error('timed out')), 3000);
        p.then(val => {
          clearTimeout(timer);
          resolve(val);
        });
      });
    } catch (err) {
      this.error = err;
      console.log(this.id.replace(/./g, ' '), chalk.red(`ERROR: ${err.message}`));
    }

    await this.parent.runHook('afterEach');
  }
};
