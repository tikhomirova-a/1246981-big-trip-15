import {render} from '../utils/render.js';
import {updateItem} from '../utils/event.js';
import {Position} from '../utils/const.js';
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

    this._TripInfoComponent = new TripInfoView();
    this._tripCostComponent = new TripCostView();
    this._menuViewComponent = new SiteMenuView();
    this._filtersComponent = new FiltersView();
    this._noEventComponent = new NoEventMsgView();
    this._sortComponent = new TripSortView();
    this._eventListComponent = new EventListView();

    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(events, offers) {
    this._events = events.slice();
    this._offers = offers;
    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter.get(updatedEvent.id).init(updatedEvent);
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

  _renderSort() {
    render(this._eventsContainer, this._sortComponent);
  }

  _renderEventList() {
    render(this._eventsContainer, this._eventListComponent);
  }

  _renderEvents(eventList, events, offers, changeData) {
    for (let i = 0; i < this._eventCount; i++) {
      const eventPresenter = new EventPresenter(eventList, offers, changeData);
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
    this._renderEvents(this._eventListComponent, this._events, this._offers, this._handleEventChange);
  }
}
