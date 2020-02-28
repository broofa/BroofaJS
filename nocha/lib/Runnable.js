const chalk = require('chalk');
const {argv} = require('yargs');

/**
 * A "runnable" thing.  Can be a Suite or a Test
 */
module.exports = class Test {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
  }

  shouldSkip() {
    const skip = this.id && argv.only &&
      this.id != argv.only &&
      !this.id.startsWith(`${argv.only}.`) &&
      !String(argv.only).startsWith(`${this.id}.`);
    return skip;
  }

  shouldBreak() {
    return argv.break && argv.break == this.id;
  }

  get id() {
    if (!this.parent) return null;
    const parentId = this.parent.id;
    const id = this.parent.runnables.indexOf(this) + 1;
    return parentId == null ? `${id}` : `${parentId}.${id}`;
  }

  get title() {
    return this.parent ? `${chalk.dim(this.id)} ${this.name}` : '(top)';
  }
};
