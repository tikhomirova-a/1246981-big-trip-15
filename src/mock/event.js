import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const cities = ['Amsterdam', 'Chamonix','Geneva'];
const offerTitles = ['Switch to comfort class', 'Add luggage', 'Add meal', 'Choose seats', 'Travel by train'];
const offerPrices = ['100', '5', '30', '15', '40'];
const descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'In rutrum ac purus sit amet tempus.', 'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.'];

const offer = new Map();
const destinationInfo = new Map();

const generateOption = () => (
  {
    price: offerPrices[getRandomInteger(0, offerPrices.length - 1)],
    title: offerTitles[getRandomInteger(0, offerTitles.length - 1)],
  }
);

export const generateOffers = () => {
  for (const type of types) {
    const options = new Array(getRandomInteger(0, 5)).fill().map(generateOption);

    offer.set(type, options);
  }
  return offer;
};

export const generateDestinationInfo = () => {
  for (const city of cities) {
    destinationInfo.set(city, {
      description: descriptions[getRandomInteger(0, descriptions.length - 1)],
      photos: [
        {
          src: `http://picsum.photos/248/152?r=${Math.random()}`,
          altText: descriptions[getRandomInteger(0, descriptions.length - 1)],
        },
      ],
    });
  }
};

const generateDateFrom = () => {
  const timeDiff = getRandomInteger(1, 10);
  return dayjs().add(timeDiff, 'day').toDate();
};

const generateDateTo = (start) => (
  dayjs(start).add(getRandomInteger(0, 1), 'day').add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 60), 'minute').toDate()
);

export const generateEvent = () => {
  const type = types[getRandomInteger(0, types.length - 1)];
  const destination = cities[getRandomInteger(0, cities.length - 1)];
  const dateFrom = generateDateFrom();
  return {
    basePrice: getRandomInteger(10, 1500),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    description: destinationInfo.get(destination).description,
    destination: destination,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: offer.get(type),
    photos: destinationInfo.get(destination).photos,
    type,
  };
};
