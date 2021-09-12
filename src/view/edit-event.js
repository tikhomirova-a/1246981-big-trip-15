import dayjs from 'dayjs';
import {CITIES} from '../mock/event.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createEditOffersTemplate = (allOffers, checkedOffers = []) => {
  const checkedTitles = checkedOffers.map((offer) => offer.title);
  const offerItems = [];
  let count = 0;

  for (const offer of allOffers) {
    const {title, price} = offer;
    const titleWords = title.split(' ');
    offerItems.push(`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleWords[titleWords.length - 1]}-${count}"
        type="checkbox" name="event-offer-${titleWords[titleWords.length - 1]}" ${checkedTitles.includes(title) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${titleWords[titleWords.length - 1]}-${count}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
      </div>`);

    count++;
  }
  return offerItems.length !== 0 ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${offerItems.join('')}
    </div>
  </section>` : '';
};

const createDescriptionTemplate = (description, photos) => {
  const photoItems = [];
  for (const photo of photos) {
    photoItems.push(`<img class="event__photo" src="${photo.src}" alt="${photo.altText}">`);
  }
  return `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${photoItems.join('')}
                      </div>
                    </div>
                  </section>`;
};

const createEditEventTemplate = (data, allOffers, descriptions) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    hasDescription,
  } = data;

  const editOffersTemplate = createEditOffersTemplate(allOffers.get(type), offers);
  const descriptionTemplate = hasDescription ? createDescriptionTemplate(descriptions.get(destination).description, descriptions.get(destination).photos) : '';
  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'taxi' === type ? 'taxi checked' : 'taxi'}>
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'bus' === type ? 'bus checked' : 'bus'}>
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'train' === type ? 'train checked' : 'train'}>
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'ship' === type ? 'ship checked' : 'ship'}>
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'drive' === type ? 'drive checked' : 'drive'}>
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'flight' === type ? 'flight checked' : 'flight'}>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'check-in' === type ? 'check-in checked' : 'check-in'}>
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'sightseeing' === type ? 'sightseeing checked' : 'sightseeing'}>
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${'restaurant' === type ? 'restaurant checked' : 'restaurant'}>
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${CITIES.map((city) => `<option value="${city}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:MM')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:MM')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${editOffersTemplate}

                  ${hasDescription ? descriptionTemplate : ''}
                </section>
              </form>
            </li>`;
};

export default class EditEvent extends SmartView {
  constructor(event, allOffers, descriptions) {
    super();
    this._data = EditEvent.parseEventToData(event);
    this._allOffers = allOffers;
    this._descriptions = descriptions;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._hideFormBtnClickHandler = this._hideFormBtnClickHandler.bind(this);
    this._formChangeHandler = this._formChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._dateToCorrectHandler = this._dateToCorrectHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createEditEventTemplate(this._data, this._allOffers, this._descriptions);
  }

  _setDatePicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    } else if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._data.dateFrom,
        defaultHour: dayjs(this._data.dateFrom).get('hour'),
        defaultMinute: dayjs(this._data.dateFrom).get('minute'),
        enableTime: true,
        ['time_24hr']: true,
        onClose: [
          this._dateFromChangeHandler,
          this._dateToCorrectHandler,
        ],
      },
    );

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._data.dateTo,
        defaultHour: dayjs(this._data.dateTo).get('hour'),
        defaultMinute: dayjs(this._data.dateTo).get('minute'),
        minDate: this._data.dateFrom,
        enableTime: true,
        ['time_24hr']: true,
        onClose:
          this._dateToChangeHandler,
      },
    );
  }

  _dateFromChangeHandler([userDate]) {
    if (!userDate) {
      userDate = this._data.dateFrom;
    }
    this.updateData({
      dateFrom: userDate,
      dateTo: this._data.dateTo,
    });
  }

  _dateToCorrectHandler([userDate]) {
    if (!userDate) {
      userDate = this._data.dateFrom;
    }
    if (dayjs(userDate).isAfter(this._data.dateTo)) {
      this.updateData({
        dateTo: userDate,
      });
    }
  }

  _dateToChangeHandler([userDate]) {
    if (!userDate) {
      userDate = this._data.dateTo;
    }
    this.updateData({
      dateTo: userDate,
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditEvent.parseDataToEvent(this._data, this._descriptions.get(this._data.destination)));
  }

  _hideFormBtnClickHandler() {
    this._callback.hideBtnClick();
  }

  _formChangeHandler(evt) {
    if (evt.target.name === 'event-type') {

      this.updateData({
        type: evt.target.value,
        offers: [],
      });

    } else if (evt.target.name === 'event-destination') {

      this.updateData({
        destination: evt.target.value,
      });

    } else if (evt.target.classList.contains('event__offer-checkbox')) {
      const availableOffers = this._allOffers.get(this._data.type);
      let newOffers = this._data.offers;

      const targetOffer = availableOffers.find((offer) => {
        const titleWords = offer.title.split(' ');
        return `event-offer-${titleWords[titleWords.length - 1]}` === evt.target.name;
      });

      if (evt.target.checked) {
        newOffers.push(targetOffer);
      } else {
        newOffers = newOffers.filter((offer) => offer.title !== targetOffer.title);
      }

      this.updateData({
        offers: newOffers,
      });
    }
  }

  _priceInputHandler(evt) {
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  setFormSubmitHandler(cb) {
    this._callback.formSubmit = cb;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setHideFormBtnClickHandler(cb) {
    this._callback.hideBtnClick = cb;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._hideFormBtnClickHandler);
  }

  static parseEventToData(event, descriptions) {
    return Object.assign(
      {},
      event,
      {
        hasDescription: descriptions !== null,
      },
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.hasDescription;

    return data;
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event--edit').addEventListener('change', this._formChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setHideFormBtnClickHandler(this._callback.hideBtnClick);
  }

  reset(event) {
    this.updateData(
      EditEvent.parseEventToData(event),
    );
  }
}
