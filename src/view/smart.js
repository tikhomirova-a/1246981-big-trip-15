import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(updatedData, onlyDataUpdating) {
    if (!updatedData) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      updatedData,
    );

    if (onlyDataUpdating) {
      return;
    }
    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
