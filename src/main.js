import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import OffersModel from './model/offers.js';
import DescriptionsModel from './model/descriptions.js';
import FilterModel from './model/filter.js';
import Api from './api.js';
import {UpdateType} from './utils/const.js';

const AUTHORIZATION = 'Basic abzLZujAQ8cIM1KT';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

const offersModel = new OffersModel();

const descriptionsModel = new DescriptionsModel();

const filterModel = new FilterModel();

const tripMainElement = document.querySelector('.trip-main');
const eventsContainerElement = document.querySelector('.trip-events');
const filtersContainerElement = tripMainElement.querySelector('.trip-controls__filters');

Promise.all([
  api.getOffers().catch(() => []),
  api.getDescriptions().catch(() => []),
  api.getEvents().catch(() => []),
])
  .then(([offers, descriptions, events]) => {
    offersModel.setOffers(offers);
    descriptionsModel.setDescriptions(descriptions);
    eventsModel.setEvents(UpdateType.INIT, events);
  });


const tripPresenter = new TripPresenter(tripMainElement, eventsContainerElement, eventsModel, offersModel, descriptionsModel, filterModel, api);
tripPresenter.init();
new FilterPresenter(filtersContainerElement, filterModel, eventsModel).init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  tripPresenter.createEvent(evt);
});
