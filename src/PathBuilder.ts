export class PathBuilder
{
  get target() {
    let separatorI = this._path.lastIndexOf(`/`);
    return this._path.slice(separatorI + 1);
  }
  set target(value) {this._path = this.directory + value}

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
    let separatorI = this._path.lastIndexOf(`/`);
    return this._path.slice(0, separatorI + 1);
  }
  set directory(value) {this._path = value + this.target}

  constructor(
    private _path: string
  )
  {
  }

  toString() {return this._path}
}