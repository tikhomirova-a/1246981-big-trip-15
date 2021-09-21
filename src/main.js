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

const tripMain = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = tripMain.querySelector('.trip-controls__filters');
api.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);
  })
  .catch(() => {
    offersModel.setOffers([]);
  })

  .then(() => {
    api.getDescriptions()
      .then((destinations) => {
        descriptionsModel.setDescriptions(destinations);
      })
      .catch(() => {
        descriptionsModel.setDescriptions([]);
      })

      .then(() => {
        api.getEvents()
          .then((events) => {
            eventsModel.setEvents(UpdateType.INIT, events);
          })
          .catch(() => {
            eventsModel.setEvents(UpdateType.INIT, []);
          });
      });
  });

const tripPresenter = new TripPresenter(tripMain, eventsContainer, eventsModel, offersModel, descriptionsModel, filterModel, api);
tripPresenter.init();
new FilterPresenter(filtersContainer, filterModel, eventsModel).init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
  tripPresenter.createEvent();
});
