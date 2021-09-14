import AbstractObserver from '../utils/abstract-observer.js';

export default class Descriptions extends AbstractObserver {
  constructor() {
    super();
    this._descriptions = null;
  }

  setDescriptions(descriptions) {
    this._descriptions = new Map([...descriptions]);
  }

  getDescriptions() {
    return this._descriptions;
  }
}
