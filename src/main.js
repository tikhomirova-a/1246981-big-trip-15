import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import OffersModel from './model/offers.js';
import DescriptionsModel from './model/descriptions.js';
import FilterModel from './model/filter.js';

const EVENT_COUNT = 15;

export const offers = generateOffers();
const descriptions = generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const offersModel = new OffersModel();
offersModel.setOffers(offers);

const descriptionsModel = new DescriptionsModel();
descriptionsModel.setDescriptions(descriptions);

const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = tripMain.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter(tripMain, eventsContainer, eventsModel, offersModel, descriptionsModel, filterModel);
tripPresenter.init();
new FilterPresenter(filtersContainer, filterModel, eventsModel).init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
  tripPresenter.createEvent();
});
