import AbstractView from './abstract.js';

const createTripCostTemplate = () => (
  `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>`
);

export default class TripCost extends AbstractView {
  getTemplate() {
    return createTripCostTemplate();
  }
}
