import {render, remove} from '../utils/render.js';
import {sortByDay, sortByPrice, sortByTime, filter} from '../utils/event.js';
import {Position, SortType, UserAction, UpdateType, FilterType} from '../utils/const.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SiteMenuView from '../view/site-menu.js';
import NoEventMsgView from '../view/no-event-msg.js';
import TripSortView from '../view/trip-sort.js';
import EventListView from '../view/event-list.js';
import LoadingView from '../view/loading.js';
import ErrorView from '../view/error.js';
import EventPresenter from '../presenter/event.js';
import NewEventPresenter from './new-event.js';

export default class Trip {
  constructor(tripMain, eventsContainer, eventsModel, offersModel, descriptionsModel, filterModel, api) {
    this._tripMain = tripMain;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;
    this._filterModel = filterModel;
    this._tripNav = this._tripMain.querySelector('.trip-controls__navigation');
    this._eventsContainer = eventsContainer;
    this._eventPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;
    this._api = api;

    this._TripInfoComponent = new TripInfoView();
    this._tripCostComponent = new TripCostView();
    this._menuViewComponent = new SiteMenuView();
    this._noEventComponent = null;
    this._sortComponent = null;
    this._eventListComponent = new EventListView();
    this._loadingComponent = new LoadingView();
    this._errorComponent = new ErrorView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newEventPresenter = null;
  }

  init() {
    this._renderTripInfo();
    this._renderCost();
    this._renderMenu();
    this._renderTrip();
  }

  createEvent() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (!this._newEventPresenter) {
      this._newEventPresenter = new NewEventPresenter(this._eventListComponent, this._offersModel.getOffers(), this._descriptionsModel.getDescriptions(), this._handleViewAction);
    }
    this._newEventPresenter.init();
  }

  _getEvents() {
    this._filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[this._filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(sortByDay);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
    }
  }

  _handleViewAction(actionType, updateType, updatedEvent) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._api.updateEvent(updatedEvent).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        });
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
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        if (!this._offersModel.getOffers() || this._offersModel.getOffers().size === 0) {
          remove(this._loadingComponent);
          this._renderError();
          return;
        } else {
          remove(this._errorComponent);
        }

        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    if (this._newEventPresenter) {
      this._newEventPresenter.destroy();
    }
    this._eventPresenter.forEach((presenter) => presenter.resetMode());
  }

  _renderTripInfo() {
    render(this._tripMain, this._TripInfoComponent, Position.AFTERBEGIN);
  }

  _renderCost() {
    render(this._TripInfoComponent, this._tripCostComponent);
  }

  _renderMenu() {
    render(this._tripNav, this._menuViewComponent);
  }

  _renderNoEvent() {
    this._noEventComponent = new NoEventMsgView(this._filterType);
    render(this._eventsContainer, this._noEventComponent);
  }

  _renderLoading() {
    render(this._eventsContainer, this._loadingComponent);
  }

  _renderError() {
    render(this._eventsContainer, this._errorComponent);
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip();
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
    if (this._newEventPresenter) {
      this._newEventPresenter.destroy();
    }
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _renderEvents(eventList, offers, descriptions, changeData, changeMode) {
    const events = this._getEvents();
    for (let i = 0; i < events.length; i++) {
      const eventPresenter = new EventPresenter(eventList, offers, descriptions, changeData, changeMode);
      eventPresenter.init(events[i]);
      this._eventPresenter.set(events[i].id, eventPresenter);
    }
  }

  _clearTrip({resetSortType = false} = {}) {
    this._clearEventList();

    remove(this._sortComponent);
    remove(this._loadingComponent);
    if (this._noEventComponent) {
      remove(this._noEventComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const eventsCount = this._getEvents().length;

    if (eventsCount === 0) {
      this._renderNoEvent();
      return;
    }
    this._renderSort();
    this._renderEventList();
    this._renderEvents(this._eventListComponent, this._offersModel.getOffers(), this._descriptionsModel.getDescriptions(), this._handleViewAction, this._handleModeChange);
  }
}
