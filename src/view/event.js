import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const getDuration = (start, end) => {
  const dateDifference = dayjs(end).diff(dayjs(start));
  const durationTime = dayjs.duration(dateDifference);
  let durationDays;
  let durationHours;
  let durationMinutes;
  if (durationTime.minutes() === 0) {
    durationMinutes = '';
  } else {
    durationMinutes = durationTime.minutes() < 10 ? `0${durationTime.minutes()}M ` : `${durationTime.minutes()}M `;
  }
  if (durationTime.days() === 0) {
    durationDays = '';
  } else {
    durationDays = durationTime.days() < 10 ? `0${durationTime.days()}D ` : `${durationTime.days()}D `;
  }
  if (durationTime.hours() === 0) {
    durationHours = durationDays === '' ? '' : 'OOH ';
  } else {
    durationHours = durationTime.hours() < 10 ? `0${durationTime.hours()}H ` : `${durationTime.hours()}H `;
  }
  return `${durationDays + durationHours + durationMinutes}`;
};

const createOffersTemplate = (offers) => {
  const offerItems = [];
  for (const offer of offers) {
    const {title, price} = offer;
    offerItems.push(`<li class="event__offer">
                    <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${price}</span>
                  </li>`);
  }
  return `<ul class="event__selected-offers">${offerItems.join('')}</ul>`;
};

export const createEventTemplate = (event) => {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = event;
  const startDate = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const endDate = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');

  const offersTemplate = offers.size === 0 ? '' : createOffersTemplate(offers);

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('MMM DD')}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${startDate}">${dayjs(startDate).format('HH:mm')}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${endDate}">${dayjs(endDate).format('HH:mm')}</time>
                  </p>
                  <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                ${offersTemplate}
                <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};
