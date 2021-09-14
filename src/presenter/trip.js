import {render, remove} from '../utils/render.js';
import {sortByDay, sortByPrice, sortByTime} from '../utils/event.js';
import {Position, SortType, UserAction, UpdateType} from '../utils/const.js';
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
  constructor(tripMain, eventsContainer, eventsModel, offersModel, descriptionsModel) {
    this._renderedEventCount = EVENT_COUNT;
    this._tripMain = tripMain;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;
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
    this._sortComponent = null;
    this._eventListComponent = new EventListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._offers = this._offersModel.getOffers();
    this._descriptions = this._descriptionsModel.getDescriptions();

    this._renderTripInfo();
    this._renderCost();
    this._renderControls();
    this._renderTrip();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._eventsModel.getEvents().slice().sort(sortByDay);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortByPrice);
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort(sortByTime);
    }
    return this._eventsModel.getEvents();
  }

  _handleViewAction(actionType, updateType, updatedEvent) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, updatedEvent);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, updatedEvent);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, updatedEvent);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetRenderedEventCount: true, resetSortType: true});
        this._renderTrip();
        break;
    }
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

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip({resetRenderedEventCount: true});
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new TripSortView(this._currentSortType);
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

  _renderEvents(eventList, offers, descriptions, changeData, changeMode) {
    const events = this._getEvents();
    for (let i = 0; i < this._renderedEventCount; i++) {
      const eventPresenter = new EventPresenter(eventList, offers, descriptions, changeData, changeMode);
      eventPresenter.init(events[i]);
      this._eventPresenter.set(events[i].id, eventPresenter);
    }
  }

  _clearTrip({resetRenderedEventCount = false, resetSortType = false} = {}) {
    const eventsCount = this._getEvents().length;
    this._clearEventList();

    remove(this._sortComponent);
    remove(this._noEventComponent);

    if (resetRenderedEventCount) {
      this._renderedEventCount = EVENT_COUNT;
    } else {
      this._renderedEventCount = Math.min(eventsCount, this._renderedEventCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTrip() {
    const eventsCount = this._getEvents().length;

    if (eventsCount === 0) {
      this._renderNoEvent();
      return;
    }
    this._renderSort();
    this._renderEventList();
    this._renderEvents(this._eventListComponent, this._offers, this._descriptions, this._handleViewAction, this._handleModeChange);
  }
}
