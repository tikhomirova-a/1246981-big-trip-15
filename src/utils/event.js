import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

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
