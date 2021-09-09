import {render} from '../utils/render.js';
import {updateItem, sortByDay, sortByPrice, sortByTime} from '../utils/event.js';
import {Position, SortType} from '../utils/const.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SiteMenuView from '../view/site-menu.js';
import FiltersView from '../view/filters.js';
import NoEventMsgView from '../view/no-event-msg.js';
import TripSortView from '../view/trip-sort.js';
import EventListView from '../view/event-list.js';
import EventPresenter from '../presenter/event.js';

const EVENT_COUNT = 15;

export default class Trip {
  constructor(tripMain, eventsContainer) {
    this._eventCount = EVENT_COUNT;
    this._tripMain = tripMain;
    this._tripNav = this._tripMain.querySelector('.trip-controls__navigation');
    this._filtersContainer = this._tripMain.querySelector('.trip-controls__filters');
    this._eventsContainer = eventsContainer;
    this._eventPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._TripInfoComponent = new TripInfoView();
    this._tripCostComponent = new TripCostView();
    this._menuViewComponent = new SiteMenuView();
    this._filtersComponent = new FiltersView();
    this._noEventComponent = new NoEventMsgView();
    this._sortComponent = new TripSortView();
    this._eventListComponent = new EventListView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(events, offers, descriptions) {
    this._events = events.slice();
    this._offers = offers;
    this._descriptions = descriptions;
    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  _handleModeChange() {
    this._eventPresenter.forEach((presenter) => presenter.resetMode());
  }

  _renderTripInfo() {
    render(this._tripMain, this._TripInfoComponent, Position.AFTERBEGIN);
  }

  _renderCost() {
    render(this._TripInfoComponent, this._tripCostComponent);
  }

  _renderMenuView() {
    render(this._tripNav, this._menuViewComponent);
  }

  _renderFilters() {
    render(this._filtersContainer, this._filtersComponent);
  }

  _renderControls() {
    this._renderMenuView();
    this._renderFilters();
  }

  _renderNoEvent() {
    render(this._eventsContainer, this._noEventComponent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._events.sort(sortByDay);
        break;
      case SortType.PRICE:
        this._events.sort(sortByPrice);
        break;
      case SortType.TIME:
        this._events.sort(sortByTime);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortEvents(sortType);
    this._clearEventList();
    this._renderEvents(this._eventListComponent, this._events, this._offers, this._descriptions, this._handleEventChange, this._handleModeChange);
  }

  _renderSort() {
    render(this._eventsContainer, this._sortComponent);
    this._sortComponent.setFormChangeHandler(this._handleSortChange);
  }

  _renderEventList() {
    render(this._eventsContainer, this._eventListComponent);
  }

  _clearEventList() {
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _renderEvents(eventList, events, offers, descriptions, changeData, changeMode) {
    for (let i = 0; i < this._eventCount; i++) {
      const eventPresenter = new EventPresenter(eventList, offers, descriptions, changeData, changeMode);
      eventPresenter.init(events[i]);
      this._eventPresenter.set(events[i].id, eventPresenter);
    }
  }

  _renderTrip() {
    this._renderTripInfo();
    this._renderCost();
    this._renderControls();

    if (this._events.length === 0) {
      this._renderNoEvent();
      return;
    }
    this._renderSort();
    this._renderEventList();
    this._sortEvents(SortType.DAY);
    this._renderEvents(this._eventListComponent, this._events, this._offers, this._descriptions, this._handleEventChange, this._handleModeChange);
  }
}
