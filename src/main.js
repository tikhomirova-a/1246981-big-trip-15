import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filters.js';
import TripSortView from './view/trip-sort.js';
import EventListView from './view/event-list.js';
import EventView from './view/event.js';
import EditEventView from './view/edit-event.js';
import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';
import {Position, render} from './utils.js';

const EVENT_COUNT = 15;

export const offers = generateOffers();
generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const renderEvent = (eventList, event, allOffers) => {
  const eventComponent = new EventView(event);
  const editEventComponent = new EditEventView(event, allOffers);

  const onRollUpBtnClick = () => {
    eventList.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  const onEditFormSubmit = () => {
    eventList.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', onRollUpBtnClick);
  editEventComponent.getElement().querySelector('form').addEventListener('submit', onEditFormSubmit);

  render(eventList, eventComponent.getElement());
};

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripNav = tripMain.querySelector('.trip-controls__navigation');
const tripFiltersContainer = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const eventsContainer = pageMain.querySelector('.trip-events');

render(tripMain, new TripInfoView().getElement(), Position.AFTERBEGIN);

const tripInfo = tripMain.querySelector('.trip-info');

render(tripInfo, new TripCostView().getElement());
render(tripNav, new SiteMenuView().getElement());
render(tripFiltersContainer, new FiltersView().getElement());
render(eventsContainer, new TripSortView().getElement());

const eventListComponent = new EventListView();
render(eventsContainer, eventListComponent.getElement());

for (let i = 0; i < EVENT_COUNT; i++) {
  renderEvent(eventListComponent.getElement(), events[i], offers);
}
