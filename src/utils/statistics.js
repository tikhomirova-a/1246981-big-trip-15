import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import {formatDuration} from './event.js';

dayjs.extend(duration);

export const getPointTypes = (points) => points.map((point) => point.type);

export const makeItemsUniq = (items) => [...new Set(items)];

export const countPointsPriceByType = (points, types) => {
  const result = new Map();
  types.map((item) => result.set(item, 0));

  for (const point of points) {
    result.set(point.type, result.get(point.type) + point.basePrice);
  }
  return Array.from(result.values());
};

export const countPointsByType = (points, types) => {
  const result = new Map();
  types.map((item) => result.set(item, 0));

  for (const point of points) {
    result.set(point.type, result.get(point.type) + 1);
  }
  return Array.from(result.values());
};

const getDifference = (start, end) => dayjs(end).diff(dayjs(start));

export const countDurationByType = (points, types) => {
  const result = new Map();
  types.map((item) => result.set(item, 0));

  for (const point of points) {
    const time = getDifference(point.dateFrom, point.dateTo);
    result.set(point.type, result.get(point.type) + time);
  }

  return Array.from(result.values()).map((item) => formatDuration(dayjs.duration(item)));
};
