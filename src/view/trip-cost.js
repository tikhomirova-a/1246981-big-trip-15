import AbstractView from './abstract.js';

const getTotalCost = (events) => {
  let counter = 0;
  const reducer = (accumulator, currentVal) => accumulator + currentVal.price;

  for (const event of events) {
    counter += event.basePrice + event.offers.reduce(reducer, 0);
  }
  return counter;
};

const createTripCostTemplate = (events) => {
  const cost = events.length !== 0 ? getTotalCost(events) : 0;

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
