import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import isToday from 'dayjs/plugin/isToday.js';
import {FilterType} from './const.js';

dayjs.extend(duration);
dayjs.extend(isToday);

export const getDuration = (start, end) => {
  const dateDifference = dayjs(end).diff(dayjs(start));
  const durationTime = dayjs.duration(dateDifference);
  const durationValues = [];
  if (durationTime.days() !== 0) {
    durationValues.push(`${durationTime.days().toString().padStart(2, '0')}D`);
  }
  if (durationTime.hours() !== 0 || durationTime.days() !== 0) {
    durationValues.push(`${durationTime.hours().toString().padStart(2, '0')}H`);
  }
  if (durationTime.minutes() !== 0) {
    durationValues.push(`${durationTime.minutes().toString().padStart(2, '0')}M`);
  }
  return durationValues.join(' ');
};

export const sortByDay = (eventA, eventB) => (dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom)));

export const sortByPrice = (eventA, eventB) => (eventB.basePrice - eventA.basePrice);

export const sortByTime = (eventA, eventB) => {
  const diffA = dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
  const diffB = dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom));
  return diffB - diffA;
};

export const isDayEqual = (a, b) => (dayjs(a.dateFrom).day() === dayjs(b.dateFrom).day());

export const isDurationEqual = (a, b) => (getDuration(a.dateFrom, a.dateTo) === getDuration(b.dateFrom, b.dateTo));

export const isPriceEqual = (a, b) => (a.basePrice === b.basePrice);

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom).isAfter(dayjs(), 'day') || dayjs(event.dateFrom).isToday()),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateTo).isBefore(dayjs(), 'day')),
};
