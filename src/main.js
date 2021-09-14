import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';

const EVENT_COUNT = 15;

export const offers = generateOffers();
const descriptions = generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripMain = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

new TripPresenter(tripMain, eventsContainer, eventsModel).init(offers, descriptions);
