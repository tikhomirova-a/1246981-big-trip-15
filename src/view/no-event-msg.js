import AbstractView from './abstract.js';
import {FilterType} from '../utils/const.js';

const createNoEventMsgTemplate = (filter = FilterType.EVERYTHING) => {
  let message;
  switch (filter) {
    case FilterType.PAST:
      message = 'There are no past events now';
      break;
    case FilterType.FUTURE:
      message = 'There are no future events now';
      break;
    default:
      message = 'Click New Event to create your first point';
  }
  return `<p class="trip-events__msg">${message}</p>`;
};

export default class NoEventMsg extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createNoEventMsgTemplate(this._filter);
  }
}
