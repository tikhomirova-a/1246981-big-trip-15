import AbstractObserver from '../utils/abstract-observer.js';

export default class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = null;
  }

  setOffers(offers) {
    this._offers = new Map([...offers]);
  }

  getOffers() {
    return this._offers;
  }

  static adaptToClient(offers) {
    const adaptedOffers = new Map();
    for (const offer of offers) {
      adaptedOffers.set(offer.type, offer.offers);
    }
    return adaptedOffers;
  }
}
