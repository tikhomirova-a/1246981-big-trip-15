import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEventListTemplate} from './view/event-list.js';
import {createEventTemplate} from './view/event.js';
import {createEditEventTemplate} from './view/edit-event.js';
import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';

const Position = {
  BEFOREEND: 'beforeend',
  AFTERSTART: 'afterbegin',
};
const EVENT_COUNT = 15;

export const offers = generateOffers();
generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const render = (container, template, place = Position.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripNav = tripMain.querySelector('.trip-controls__navigation');
const tripFiltersContainer = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const eventsContainer = pageMain.querySelector('.trip-events');

render(tripMain, createTripInfoTemplate(), Position.AFTERSTART);

const tripInfo = tripMain.querySelector('.trip-info');

render(tripInfo, createTripCostTemplate());
render(tripNav, createSiteMenuTemplate());
render(tripFiltersContainer, createFiltersTemplate());
render(eventsContainer, createTripSortTemplate());
render(eventsContainer, createEventListTemplate());

const eventList = eventsContainer.querySelector('.trip-events__list');

for (let i = 0; i < EVENT_COUNT; i++) {
  if (i === 0) {
    render(eventList, createEditEventTemplate(events[i], offers));
  } else {
    render(eventList, createEventTemplate(events[i]));
  }
}
