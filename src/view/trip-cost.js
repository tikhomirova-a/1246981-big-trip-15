import AbstractView from './abstract.js';

const getTotalCost = (events) => {
  let counter = 0;

  for (const event of events) {
    counter += event.basePrice;
  }
  return counter;
};

const createTripCostTemplate = (events) => {
  const cost = getTotalCost(events);

  return `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
            </p>`;
};

export default class TripCost extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }
}
