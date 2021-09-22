import EditEventView from '../view/edit-event.js';
import {render, remove} from '../utils/render.js';
import {Key, UserAction, UpdateType, Position} from '../utils/const.js';

export default class NewEvent {
  constructor(eventListContainer, allOffers, descriptions, changeData) {
    this._eventListContainer = eventListContainer;
    this._allOffers = allOffers;
    this._descriptions = descriptions;
    this._changeData = changeData;

    this._editEventComponent = null;

    this._submitHandler = this._submitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._formCloseHandler = callback;

    if (this._editEventComponent !== null) {
      return;
    }

    this._editEventComponent = new EditEventView(this._allOffers, this._descriptions, {isNew: true});
    this._editEventComponent.setFormSubmitHandler(this._submitHandler);
    this._editEventComponent.setDeleteBtnClickHandler(this._deleteClickHandler);

    render(this._eventListContainer, this._editEventComponent, Position.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editEventComponent === null) {
      return;
    }

    if (this._formCloseHandler !== null) {
      this._formCloseHandler();
    }

    this._editEventComponent.reset();
    remove(this._editEventComponent);
    this._editEventComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._editEventComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editEventComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._editEventComponent.shake(resetFormState);
  }

  _submitHandler(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
