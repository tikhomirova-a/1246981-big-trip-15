import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, count} = filter;
  return `<div class="trip-filters__filter">
                  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
                  ${type === currentFilterType ? 'checked' : ''}
                  ${count === 0 ? 'disabled' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
                </div>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');
  return `<form class="trip-filters" action="#" method="get">
                ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterChangeHandler(evt) {
    this._callback.filterChange(evt.target.value);
  }

  setFilterChangeHandler(cb) {
    this._callback.filterChange = cb;
    this.getElement().addEventListener('change', this._filterChangeHandler);
  }
}
