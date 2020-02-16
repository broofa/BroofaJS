const chalk = require('chalk');

module.exports = class Test {
  constructor(name, testFunc) {
    this.name = name;
    this.testFunc = testFunc;
  }

  async run(suite) {
    console.log(`- ${this.name}`);

    await suite.runHook('beforeEach');

    try {
      await this.testFunc();
    } catch (err) {
      this.error = err;
      console.log(chalk.red(err.message));
    }

    await suite.runHook('afterEach');
  }
};
