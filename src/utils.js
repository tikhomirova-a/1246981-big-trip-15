export const Position = {
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
};

export const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

export const Filter = {
  PAST: 'past',
  FUTURE: 'future',
  EVERYTHING: 'everything',
};

export const render = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.AFTERBEGIN:
      container.prepend(element);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};
