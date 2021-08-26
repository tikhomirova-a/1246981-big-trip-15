import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';
import TripPresenter from './presenter/trip.js';

const EVENT_COUNT = 15;

export const offers = generateOffers();
generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);
const tripMain = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

new TripPresenter(tripMain, eventsContainer).init(events, offers);
