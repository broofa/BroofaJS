const chalk = require('chalk');

/**
 * A "runnable" thing.  Can be a Suite or a Test
 */
module.exports = class Test {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
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
