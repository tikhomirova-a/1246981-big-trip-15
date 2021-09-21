import AbstractObserver from '../utils/abstract-observer.js';

export default class Descriptions extends AbstractObserver {
  constructor() {
    super();
    this._descriptions = null;
  }

  setDescriptions(descriptions) {
    this._descriptions = new Map([...descriptions]);
  }

  getDescriptions() {
    return this._descriptions;
  }

  static adaptToClient(destinationItems) {
    const adaptedDescription = new Map();

    for (const item of destinationItems) {

      const photos = [];
      for (const picture of item.pictures) {
        photos.push({
          src: picture.src,
          altText: picture.description,
        });
      }

      adaptedDescription.set(item.name, {
        description: item.description,
        photos,
      });
    }

    return adaptedDescription;
  }
}
