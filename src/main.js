import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filters.js';
import TripSortView from './view/trip-sort.js';
import EventListView from './view/event-list.js';
import EventView from './view/event.js';
import EditEventView from './view/edit-event.js';
import NoEventMsgView from './view/no-event-msg.js';
import {generateDestinationInfo, generateEvent, generateOffers} from './mock/event.js';
import {Key, Position} from './utils/const.js';
import {render, replace} from './utils/render.js';

const EVENT_COUNT = 15;

export const offers = generateOffers();
generateDestinationInfo();
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const renderEvent = (eventList, event, allOffers) => {
  const eventComponent = new EventView(event);
  const editEventComponent = new EditEventView(event, allOffers);

  const replaceEventToForm = () => {
    replace(editEventComponent, eventComponent);
  };

  const onEscKeydown = (evt) => {
    if (evt.key === Key.ESC || evt.key === Key.ESCAPE) {
      evt.preventDefault();
      replaceFormToEvent();
    }
  };

  function replaceFormToEvent() { // объявлять всё функции единообразно как стрелочные
    replace(eventComponent, editEventComponent);
    window.removeEventListener('keydown', onEscKeydown);
  }

  const onRollUpBtnClick = () => {
    replaceEventToForm();
    window.addEventListener('keydown', onEscKeydown);
  };

  const onEditFormSubmit = () => {
    replaceFormToEvent();
  };

  const onHideFormBtnClick = () => {
    replaceFormToEvent();
  };

  eventComponent.setRollUpBtnClickHandler(onRollUpBtnClick);
  editEventComponent.setFormSubmitHandler(onEditFormSubmit);
  editEventComponent.setHideFormBtnClickHandler(onHideFormBtnClick);

  render(eventList, eventComponent);
};

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripNav = tripMain.querySelector('.trip-controls__navigation');
const tripFiltersContainer = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const eventsContainer = pageMain.querySelector('.trip-events');

render(tripMain, new TripInfoView(), Position.AFTERBEGIN);

const tripInfo = tripMain.querySelector('.trip-info');

render(tripInfo, new TripCostView());
render(tripNav, new SiteMenuView());
render(tripFiltersContainer, new FiltersView());

if (events.length === 0) {
  render(eventsContainer, new NoEventMsgView());
} else {
  render(eventsContainer, new TripSortView());

  const eventListComponent = new EventListView();
  render(eventsContainer, eventListComponent);

  for (let i = 0; i < EVENT_COUNT; i++) {
    renderEvent(eventListComponent, events[i], offers);
  }
}
