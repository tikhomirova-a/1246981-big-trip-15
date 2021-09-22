import AbstractObserver from '../utils/abstract-observer.js';

export default class Events extends AbstractObserver {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events, descriptions) {
    this._events = events.slice();
    this._descriptions = descriptions;

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        basePrice: event['base_price'],
        dateFrom: new Date(event['date_from']),
        dateTo: new Date(event['date_to']),
        destination: event.destination.name,
        destinationDesc: event.destination.description,
        destinationPhotos: event.destination.pictures,
        isFavorite: event['is_favorite'],
      },
    );

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const pictures = [];
    for (const photo of event.destinationPhotos) {
      pictures.push({
        src: photo.src,
        description: `${photo.altText} ? ${photo.altText} : ${photo.description}`,
      });
    }

    const adaptedEvent = Object.assign(
      {},
      event,
      {
        'base_price': Number.parseInt(event.basePrice, 10),
        'date_from': event.dateFrom,
        'date_to': event.dateTo,
        'is_favorite': event.isFavorite,
        'destination': {
          description: event.destinationDesc,
          name: event.destination,
          pictures,
        },
      },
    );

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.destinationDesc;
    delete adaptedEvent.destinationPhotos;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
