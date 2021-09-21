import AbstractView from './abstract.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-target="table">Table</a>
                <a class="trip-tabs__btn" href="#" data-target="stats">Stats</a>
              </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._items = this.getElement().querySelectorAll('[data-target]');
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (!evt.target.classList.contains('trip-tabs__btn')) {
      return;
    }

    if (evt.target.classList.contains('trip-tabs__btn--active')) {
      evt.preventDefault();
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.target);
  }

  setMenuClickHandler(cb) {
    this._callback.menuClick = cb;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-target=${menuItem}]`);

    if (item !== null) {
      this._items.forEach((element) => {
        element.classList.remove('trip-tabs__btn--active');
      });

      item.classList.add('trip-tabs__btn--active');
    }
  }
}
