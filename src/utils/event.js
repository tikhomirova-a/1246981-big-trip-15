import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export const getDuration = (start, end) => {
  const dateDifference = dayjs(end).diff(dayjs(start));
  const durationTime = dayjs.duration(dateDifference);

  const durationMinutes = durationTime.minutes() === 0 ? '' : durationTime.minutes().toString().padStart(2, '0').padEnd(4, 'M ');
  const durationDays = durationTime.days() === 0 ? '' : durationTime.days().toString().padStart(2, '0').padEnd(4, 'D ');
  const durationHours = durationTime.hours() === 0 && durationTime.days() === 0 ? '' : durationTime.hours().toString().padStart(2, '0').padEnd(4, 'H ');

  return `${durationDays}${durationHours}${durationMinutes}`;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
