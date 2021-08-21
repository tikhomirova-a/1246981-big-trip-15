import {createElement} from '../utils.js';

const createNoEventMsgTemplate = (filter = 'everything') => {
  let message;
  if (filter === 'past') {
    message = 'There are no past events now';
  } else if (filter === 'future') {
    message = 'There are no future events now';
  } else {
    message = 'Click New Event to create your first point';
  }
  return `<p class="trip-events__msg">${message}</p>`;
};

export default class NoEventMsg {
  constructor(filter) {
    this._element = null;
    this._filter = filter;
  }

  getTemplate() {
    return createNoEventMsgTemplate(this._filter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
