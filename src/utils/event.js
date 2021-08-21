import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export const getDuration = (start, end) => {
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
