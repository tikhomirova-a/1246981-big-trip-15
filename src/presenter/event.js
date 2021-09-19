import EventView from '../view/event.js';
import EditEventView from '../view/edit-event.js';
import {render, replace, remove} from '../utils/render.js';
import {Key, UserAction, UpdateType} from '../utils/const.js';
import {isDayEqual, isDurationEqual, isPriceEqual} from '../utils/event.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class Event {
  constructor(eventList, offers, descriptions, changeData, changeMode) {
    this._eventList = eventList;
    this._offers = offers;
    this._descriptions = descriptions;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;

    this._rollUpBtnClickHandler = this._rollUpBtnClickHandler.bind(this);
    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._hideFormBtnClickHandler = this._hideFormBtnClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteBtnClickHandler = this._favoriteBtnClickHandler.bind(this);
    this._deleteBtnClickHandler = this._deleteBtnClickHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventView(event);
    this._editEventComponent = new EditEventView(this._offers, this._descriptions, event);

    this._eventComponent.setRollUpBtnClickHandler(this._rollUpBtnClickHandler);
    this._eventComponent.setFavoriteBtnClickHandler(this._favoriteBtnClickHandler);
    this._editEventComponent.setFormSubmitHandler(this._editFormSubmitHandler);
    this._editEventComponent.setHideFormBtnClickHandler(this._hideFormBtnClickHandler);
    this._editEventComponent.setDeleteBtnClickHandler(this._deleteBtnClickHandler);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this._eventList, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }

  resetMode() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._editEventComponent, this._eventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._editEventComponent);
    window.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESC || evt.key === Key.ESCAPE) {
      evt.preventDefault();
      this._editEventComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _rollUpBtnClickHandler() {
    this._replaceEventToForm();
    window.addEventListener('keydown', this._escKeyDownHandler);
  }

  _editFormSubmitHandler(updatedEvent) {
    const isMinorUpdate = !isDayEqual(this._event, updatedEvent)
      || !isDurationEqual(this._event, updatedEvent)
      || !isPriceEqual(this._event, updatedEvent);

    this._changeData(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedEvent);
    this._replaceFormToEvent();
  }

  _hideFormBtnClickHandler() {
    this._editEventComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _favoriteBtnClickHandler() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  _deleteBtnClickHandler(event) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  }
}
