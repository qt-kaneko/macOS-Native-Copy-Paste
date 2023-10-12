export default class PathBuilder
{
  get target() {
    let separatorI = this.#path.lastIndexOf(`/`);
    return this.#path.slice(separatorI + 1);
  }
  set target(value) {this.#path = this.directory + value}

  get targetName() {
    let target = this.target;
    let separatorI = target.lastIndexOf(`.`);
    return separatorI !== -1 ? target.slice(0, separatorI) : target;
  }
  set targetName(value) {this.target = value + this.targetExtension}
  
  get targetExtension() {
    let target = this.target;
    let separatorI = target.lastIndexOf(`.`);
    return separatorI !== -1 ? target.slice(separatorI) : ``;
  }
  set targetExtension(value) {this.target = this.targetName + value}

  get directory() {
    let separatorI = this.#path.lastIndexOf(`/`);
    return this.#path.slice(0, separatorI + 1);
  }
  set directory(value) {this.#path = value + this.target}

  #path;

  constructor(path: string)
  {
    this.#path = path;
  }

  toString() {return this.#path}
}