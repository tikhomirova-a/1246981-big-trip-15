import {render, remove} from '../utils/render.js';
import {sortByDay, sortByPrice, sortByTime, filter} from '../utils/event.js';
import {Position, SortType, UserAction, UpdateType, FilterType, MenuItem, State} from '../utils/const.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SiteMenuView from '../view/site-menu.js';
import NoEventMsgView from '../view/no-event-msg.js';
import TripSortView from '../view/trip-sort.js';
import EventListView from '../view/event-list.js';
import LoadingView from '../view/loading.js';
import ErrorView from '../view/error.js';
import StatsView from '../view/stats.js';
import EventPresenter from '../presenter/event.js';
import NewEventPresenter from './new-event.js';

export default class Trip {
  constructor(tripMain, eventsContainer, eventsModel, offersModel, descriptionsModel, filterModel, api) {
    this._tripMain = tripMain;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;
    this._filterModel = filterModel;
    this._tripNavElement = this._tripMain.querySelector('.trip-controls__navigation');
    this._eventsContainer = eventsContainer;
    this._eventPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;
    this._api = api;

    this._tripInfoComponent = null;
    this._tripCostComponent = null;
    this._menuViewComponent = new SiteMenuView();
    this._noEventComponent = null;
    this._sortComponent = null;
    this._eventListComponent = new EventListView();
    this._loadingComponent = new LoadingView();
    this._errorComponent = new ErrorView();
    this._statsComponent = null;
    this._newEventBtnElement = this._tripMain.querySelector('.trip-main__event-add-btn');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
    this._handleNewEventFormClose = this._handleNewEventFormClose.bind(this);

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

  _destroy() {
    this._clearTrip({resetSortType: true});
    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _reinitTrip() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  createEvent() {
    this._destroy();
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._reinitTrip();
    if (this._eventsModel.getEvents().length === 0) {
      remove(this._noEventComponent);
      this._renderEventList();
    }
    this._newEventBtnElement.disabled = true;
    this._menuViewComponent.setMenuItem(MenuItem.TABLE);

    if (!this._newEventPresenter) {
      this._newEventPresenter = new NewEventPresenter(this._eventListComponent, this._offersModel.getOffers(), this._descriptionsModel.getDescriptions(), this._handleViewAction);
    }
    this._newEventPresenter.init(this._handleNewEventFormClose);
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
        this._eventPresenter.get(updatedEvent.id).setViewState(State.SAVING);

        this._api.updateEvent(updatedEvent)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter.get(updatedEvent.id).setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._newEventPresenter.setSaving();

        this._api.addEvent(updatedEvent)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._newEventPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter.get(updatedEvent.id).setViewState(State.DELETING);

        this._api.deleteEvent(updatedEvent)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, updatedEvent);
          })
          .catch(() => {
            this._eventPresenter.get(updatedEvent.id).setViewState(State.ABORTING);
          });
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
          this._newEventBtnElement.disabled = true;
          return;
        } else {
          remove(this._errorComponent);
          this._newEventBtnElement.disabled = false;
        }

        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTripInfo();
        this._renderCost();
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

  _handleNewEventFormClose() {
    this._newEventBtnElement.disabled = false;
    this._menuViewComponent.setMenuItem(MenuItem.TABLE);
  }

  _handleSiteMenuClick(menuItem) {
    switch(menuItem) {
      case(MenuItem.TABLE):
        this._menuViewComponent.setMenuItem(MenuItem.TABLE);
        remove(this._statsComponent);
        this._reinitTrip();
        break;
      case(MenuItem.STATS):
        this._menuViewComponent.setMenuItem(MenuItem.STATS);
        this._destroy();
        this._renderStats();
        break;
    }
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._getEvents());
    render(this._tripMain, this._tripInfoComponent, Position.AFTERBEGIN);
  }

  _renderCost() {
    if (this._isLoading) {
      return;
    }
    this._tripCostComponent = new TripCostView(this._eventsModel.getEvents());
    render(this._tripInfoComponent, this._tripCostComponent);
  }

  _renderMenu() {
    this._menuViewComponent.setMenuClickHandler(this._handleSiteMenuClick);
    render(this._tripNavElement, this._menuViewComponent);
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
    for (const event of events) {
      const eventPresenter = new EventPresenter(eventList, offers, descriptions, changeData, changeMode);
      eventPresenter.init(event);
      this._eventPresenter.set(event.id, eventPresenter);
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

  _renderStats() {
    if (this._statsComponent !== null) {
      remove(this._statsComponent);
    }

    this._statsComponent = new StatsView(this._eventsModel.getEvents());
    render(this._eventsContainer, this._statsComponent, Position.AFTEREND);
  }
}
