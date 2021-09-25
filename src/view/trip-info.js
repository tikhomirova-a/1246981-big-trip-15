import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const ROUTE_CITIES_AMOUNT = 3;
const Indices = {
  FIRST: 0,
  SECOND: 1,
};

const getRoute = (events) => events.map((event) => event.destination);

const getDates = (events) => {
  const start = events[Indices.FIRST].dateFrom;
  const end = events[events.length - 1].dateTo;

  if (dayjs(start).month() === dayjs(end).month()) {
    return `${dayjs(start).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(end).format('DD')}`;
  } else {
    return `${dayjs(start).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(end).format('MMM DD')}`;
  }
};

const createTripInfoTemplate = (events) => {
  if (events.length === 0) {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }

  const cities = getRoute(events);
  const dates = getDates(events);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${cities[Indices.FIRST]}&nbsp;&mdash;&nbsp;${cities.length > ROUTE_CITIES_AMOUNT ? '...' : cities[Indices.SECOND]}&nbsp;&mdash;&nbsp;${cities[cities.length - 1]}</h1>

              <p class="trip-info__dates">${dates}</p>
            </div>
          </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
