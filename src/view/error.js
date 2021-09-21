import AbstractView from './abstract.js';

const createLoadingTemplate = () => ('<p class="trip-events__msg">Loading error</p>');

export default class Error extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
