import 'normalize.css/normalize.css';
import './scss/styles.scss';
import {initializeScroll} from './components/scroll';
import {csv} from 'd3-fetch';
import drawBarChart from './components/polling_bar_chart';
import drawWaffleChart from './components/polling_waffle_chart';

let devOrProd = '';

if (process.env.NODE_ENV === 'development') {
  devOrProd = 'dist/'
}

const dataFiles = [`${devOrProd}data/lombra_sample.csv`,`${devOrProd}data/whaples_sample.csv`]

// console.log(dataFiles);

// console.log(process.env.NODE_ENV);

const promises = dataFiles.map(url => csv(url));

Promise.all(promises).then(data => {
  initializeScroll(data);
});

drawBarChart();
drawWaffleChart();

