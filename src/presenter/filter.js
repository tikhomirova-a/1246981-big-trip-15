import FiltersView from '../view/filters.js';
import {render, replace, remove} from '../utils/render.js';
import {UpdateType, FilterType} from '../utils/const.js';
import {filter} from '../utils/event.js';

export default class Filter {
  constructor(filtersContainer, filterModel, eventsModel) {
    this._filtersContainer = filtersContainer;
    this._filtersComponent = null;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new FiltersView(filters, this._filterModel.getFilter());
    this._filtersComponent.setFilterChangeHandler(this._handleFilterChange);

    if (prevFiltersComponent === null) {
      render(this._filtersContainer, this._filtersComponent);
      return;
    }

    replace(this._filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  _handleFilterChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        count: filter[FilterType.PAST](events).length,
      },
    ];
  }
}
