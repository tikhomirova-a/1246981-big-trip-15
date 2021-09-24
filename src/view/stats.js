import dayjs from 'dayjs';
import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getPointTypes, makeItemsUniq, countPointsPriceByType, countPointsByType, countDurationByType} from '../utils/statistics.js';
import {formatDuration} from '../utils/event.js';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, events) => {
  const types = getPointTypes(events);
  const uniqTypes = makeItemsUniq(types);
  const priceCounts = countPointsPriceByType(events, uniqTypes);
  moneyCtx.height = BAR_HEIGHT * uniqTypes.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: priceCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, events) => {
  const types = getPointTypes(events);
  const uniqTypes = makeItemsUniq(types);
  const typeCounts = countPointsByType(events, uniqTypes);
  typeCtx.height = BAR_HEIGHT * uniqTypes.length;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: typeCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, events) => {
  const types = getPointTypes(events);
  const uniqTypes = makeItemsUniq(types);
  const timeCounts = countDurationByType(events, uniqTypes);
  timeCtx.height = BAR_HEIGHT * uniqTypes.length;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: timeCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => formatDuration(dayjs.duration(val)),
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = () => `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="money" width="900"></canvas>
          </div>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="type" width="900"></canvas>
          </div>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
          </div>
        </section>`;

export default class Stats extends SmartView {
  constructor(events) {
    super();

    this._data = events;
    this._moneyChart = null;
    this._timeChart = null;
    this._typeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._timeChart !== null || this._typeChart !== null) {
      this._moneyChart = null;
      this._timeChart = null;
      this._typeChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._timeChart !== null || this._typeChart !== null) {
      this._moneyChart = null;
      this._timeChart = null;
      this._typeChart = null;
    }

    const moneyCtxElement = this.getElement().querySelector('#money');
    const timeCtxElement = this.getElement().querySelector('#time-spend');
    const typeCtxElement = this.getElement().querySelector('#type');

    this._moneyChart = renderMoneyChart(moneyCtxElement, this._data);
    this._typeChart = renderTypeChart(typeCtxElement, this._data);
    this._timeChart = renderTimeChart(timeCtxElement, this._data);
  }
}
