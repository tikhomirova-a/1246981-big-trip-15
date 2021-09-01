import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const CITIES = ['Amsterdam', 'Chamonix','Geneva'];
const OFFER_TITLES = ['Switch to comfort class', 'Add luggage', 'Add meal', 'Choose seats', 'Travel by train'];
const OFFER_PRICES = ['100', '5', '30', '15', '40'];
const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'In rutrum ac purus sit amet tempus.', 'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.'];
const PHOTOS_SOURCES = [
  'https://images.unsplash.com/photo-1622084948546-75baef2503b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
  'https://images.unsplash.com/photo-1630060790346-3861366371d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=738&q=80',
  'https://images.unsplash.com/photo-1484766280341-87861644c80d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=631&q=80',
  'https://images.unsplash.com/photo-1429734956993-8a9b0555e122?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=779&q=80',
  'https://images.unsplash.com/photo-1496631488200-c0b85f3044a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80',
];
const offer = new Map();
const destinationInfo = new Map();

const generateOption = () => (
  {
    price: OFFER_PRICES[getRandomInteger(0, OFFER_PRICES.length - 1)],
    title: OFFER_TITLES[getRandomInteger(0, OFFER_TITLES.length - 1)],
  }
);

export const generateOffers = () => {
  for (const type of TYPES) {
    const options = new Array(getRandomInteger(0, 5)).fill().map(generateOption);

    offer.set(type, options);
  }
  return offer;
};

export const generateDestinationInfo = () => {
  for (const city of CITIES) {
    destinationInfo.set(city, {
      description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
      photos: [
        {
          src: PHOTOS_SOURCES[getRandomInteger(0, PHOTOS_SOURCES.length - 1)],
          altText: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
        },
        {
          src: PHOTOS_SOURCES[getRandomInteger(0, PHOTOS_SOURCES.length - 1)],
          altText: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
        },
      ],
    });
  }
  return destinationInfo;
};

const generateDateFrom = () => {
  const timeDiff = getRandomInteger(1, 10);
  return dayjs().add(timeDiff, 'day').toDate();
};

const generateDateTo = (start) => (
  dayjs(start).add(getRandomInteger(0, 1), 'day').add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 60), 'minute').toDate()
);

export const generateEvent = () => {
  const type = TYPES[getRandomInteger(0, TYPES.length - 1)];
  const destination = CITIES[getRandomInteger(0, CITIES.length - 1)];
  const dateFrom = generateDateFrom();
  return {
    basePrice: getRandomInteger(10, 1500),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    destination,
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: offer.get(type),
    type,
  };
};
