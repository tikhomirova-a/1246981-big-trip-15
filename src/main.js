import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filters.js';
import TripSortView from './view/trip-sort.js';
import EventListView from './view/event-list.js';
import EventView from './view/event.js';
import EditEventView from './view/edit-event.js';
import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';
import {Position, renderElement} from './utils.js';

const EVENT_COUNT = 15;

export const offers = generateOffers();
generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripNav = tripMain.querySelector('.trip-controls__navigation');
const tripFiltersContainer = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const eventsContainer = pageMain.querySelector('.trip-events');

renderElement(tripMain, new TripInfoView().getElement(), Position.AFTERBEGIN);

const tripInfo = tripMain.querySelector('.trip-info');

renderElement(tripInfo, new TripCostView().getElement());
renderElement(tripNav, new SiteMenuView().getElement());
renderElement(tripFiltersContainer, new FiltersView().getElement());
renderElement(eventsContainer, new TripSortView().getElement());

const eventListComponent = new EventListView();
renderElement(eventsContainer, eventListComponent.getElement());

for (let i = 0; i < EVENT_COUNT; i++) {
  if (i === 0) {
    renderElement(eventListComponent.getElement(), new EditEventView(events[i], offers).getElement());
  } else {
    renderElement(eventListComponent.getElement(), new EventView(events[i]).getElement());
  }
}
