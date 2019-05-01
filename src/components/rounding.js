import * as d3 from 'd3';
import {generateSVG} from './utils.js';
import Grid from 'd3-v4-grid';
import {rollup} from 'd3-array';
import sampleSize from 'lodash/sampleSize';
import round from 'lodash/round';
import words from 'lodash/words';
import capitalize from 'lodash/capitalize';
import orderBy from 'lodash/orderBy';
import meanBy from 'lodash/meanBy';
import colors from './colors';

//mathjs custom bundle
const core = require('mathjs/core');
const math = core.create();
math.import(require('mathjs/lib/function/statistics/std'));

const colorScale = d3.scaleLinear()
  .domain([-0.02, 0, 0.02])
  .range([colors.red, colors.gray, colors.green,])
  .interpolate(d3.interpolateHcl);

//This section contain pure globals. They do not get reset or rerun within a function.

generateSVG('#container_rounding', 'svg_rounding');

const svgDimensions = {
  width: document.querySelector('#svg_rounding').clientWidth,
  height: document.querySelector('#svg_rounding').clientHeight
}

//this checks if the g for the current data step exists or not. 
const doesGExist = (data_step_attribute) => {
  //if the current g does not exist, then it makes it
  if (d3.select(`#g${data_step_attribute}`).empty()) {
    d3.select('#svg_rounding')
      .append('g')
      .attr('id', `g${data_step_attribute}`)
      .attr('class', 'g_rounding')
      .attr('width', svgDimensions.width)
      .attr('height', svgDimensions.height)
      .style('opacity', 1);
  } 
}

//shows G1 and hides everything else
const showG1 = () => {
  d3.select('#g2')
    .style('opacity', 0);

  d3.select('#g1')
    .style('opacity', 1);
}

//shows G2 and hides everything else
const showG2 = () => {
  d3.select('#g1')
    .style('opacity', 0);

  d3.select('#g2')
    .transition()
    .duration(500)
    .style('opacity', 1);
}

//this rounds a price to the nearest nickel
const roundtoNickel = (price) => {
  price = Math.round(price * 20) / 20;
  return price;
}


//this function uses d3-grid to add x and y values to 'grid' the data

const gPaddingX = .8;
const gPaddingY = .8;

const gridData = (dataToBeGridded, rectPaddingWidth, rectPaddingHeight) => {
  const griddedData = Grid()
    .data(dataToBeGridded)
    .bands(true)
    .size([svgDimensions.width * gPaddingX, svgDimensions.height * gPaddingY])
    .padding([rectPaddingWidth, rectPaddingHeight])
    .layout();

  return griddedData;
}

//this formats, orders, and grids the data
const formatData = (preFormattedData, whichData) => {
  const numberofTransactions = 100;

  let sampledData = sampleSize(preFormattedData, numberofTransactions); //takes a random sample from the data corresponding to numberofTransactions

  if (whichData === 'lombra') {
    sampledData.forEach((d,i) => {
      d.price = +d.price; //this is the price that will be displayed to the screen
      d.priceRounded = roundtoNickel(d.price); //this is the price that is rounded to the nearest nickel
      d.remainder = round((d.price - d.priceRounded),2); //this calculates how much is gained or lost by rounding to the nearest nickel
      d.displayPrice = d.price.toFixed(2); //this is the price that will be displayed to the screen
      d.rawWords = words(d.desc).map(d => capitalize(d)); //formats description to unique words
      delete d.desc; //removes description property
      
    });
  } else if (whichData === 'whaples') {
      sampledData.forEach((d,i) => {
        d.price = +d.post_tax_amount; //this is the price that will be displayed to the screen
        d.priceRounded = roundtoNickel(d.price); //this is the price that is rounded to the nearest nickel
        d.remainder = round((d.price - d.priceRounded),2) //this calculates how much is gained or lost by rounding to the nearest nickel
        d.displayPrice = d.price.toFixed(2); //this is the price that will be displayed to the screen
      });
  }

  // sampledData = orderBy(sampledData, [d => d.price], ['asc']); //sorts the data by transaction price

  sampledData.forEach((d, i) => d.key = i + 1); // key function

  return gridData(sampledData, .2, .5); //return gridded data
}

let griddedLombraData;
let griddedWhaplesData;

const lombraStatistics = {
  mean: null,
  meanRounded: null,
  std: null,
  standardError: null
}

const whaplesStatistics = {
  mean: null,
  meanRounded: null,
  std: null,
  standardError: null
}

//-----------------------------------------------------------------------//

//drawRounding() gets rerun from scroll.js every time a new step comes into view

const drawRounding = (data_step_attribute, data) => {

  //this only formats the data once
  if ((griddedLombraData == undefined) && (griddedWhaplesData == undefined)) {
    griddedLombraData = formatData(data[0],'lombra');
    griddedWhaplesData = formatData(data[1], 'whaples');

    lombraStatistics.mean = meanBy(griddedLombraData.nodes(), 'remainder');
    lombraStatistics.meanRounded = round(lombraStatistics.mean, 2).toFixed(2);
    lombraStatistics.std = math.std(griddedLombraData.nodes().map(d => d.remainder));
    lombraStatistics.standardError = lombraStatistics.std / Math.sqrt(griddedLombraData.nodes().length);
   
    whaplesStatistics.mean = meanBy(griddedWhaplesData.nodes(), 'remainder');
    whaplesStatistics.meanRounded = round(whaplesStatistics.mean, 2).toFixed(2);
    whaplesStatistics.std = math.std(griddedWhaplesData.nodes().map(d => d.remainder));
    whaplesStatistics.standardError = whaplesStatistics.std / Math.sqrt(griddedWhaplesData.nodes().length);

    console.log(lombraStatistics);
    console.log(whaplesStatistics);
  
  }

  //these are the "globals" of the drawRounding function

  const gDoesNotExist = d3.select(`#g${data_step_attribute}`).empty(); //this calculates if the current g does not exist

  data_step_attribute = parseInt(data_step_attribute); //this converts the attribute being pulled in from the data step to a number

  //This big function is used in the switch statement that draws the grid

  const drawGrid = (lombraOrWhaplesData) => {

    const transactions = d3.select('#grid')
      .selectAll('.transactions')
      .data(lombraOrWhaplesData.nodes());

    transactions.enter()
      .append('rect')
      .attr('class', 'transactions')
      .style('fill', colors.lightblue)
      .merge(transactions)
      .attr('id', d => `transaction${d.key}`)
      .attr('width', lombraOrWhaplesData.nodeSize()[0])
      .attr('height', lombraOrWhaplesData.nodeSize()[1])
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('data-remainder', d => `remainder${d.remainder}`.replace('.', ''))
      .transition()
      .duration(500)
      .style('fill', d => (lombraOrWhaplesData === griddedLombraData) ? colors.lightblue : colors.lavender)
      // .style('fill', 'var(--buyingPowerSilver)')
      .attr('y', d => d.y);
    
    //these are the price labels
    const priceLabels = d3.select('#gPriceLabels')
      .selectAll('.priceLabels')
      .data(lombraOrWhaplesData.nodes());
  
    //labels enter selection
    const labelsEnter = priceLabels.enter() 
      .append('text')
      .attr('class', 'priceLabels')
      .attr('x', d => d.x + lombraOrWhaplesData.nodeSize()[0] / 2)
      .attr('y', d => d.y + - lombraOrWhaplesData.nodeSize()[1] / 10 )
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', svgDimensions.width/80)
      .style('fill', 'black');

    labelsEnter.append('tspan')
      .text('$')
      .attr('class', 'dollar_sign');
    
    //appends tspan to labels enter selection containing all digits before last digit
    labelsEnter.append('tspan')
      .text(d => d.displayPrice.substr(0, d.displayPrice.length - 1)) //all the characters before the last digit
      .attr('class', 'other_digits');
    
    //appends tpsan to labels enter selection containing the last digit
    labelsEnter.append('tspan')
      .text(d => d.displayPrice.substr(-1)) //last digit (that will be rounded)
      .attr('class', 'rounding_digit');

      
    //labels update selection
     const labelsUpdate = priceLabels
        .attr('opacity', 0)
        .transition() 
        .duration(500)
        .style('fill', 'black')
        .attr('opacity', 1);

      //updates other digits 
      labelsUpdate.select('.other_digits')
        .text(d => d.displayPrice.substr(0, d.displayPrice.length - 1)); //all the characters before the last digit
      
      //updates rounding digit
      labelsUpdate.select('.rounding_digit')
        .text(d => d.displayPrice.substr(-1)); //digit character (that will be rounded)
        
      
  } //end of drawGrid()

  const hideAllLabels = () => {
    d3.selectAll('.priceLabels')
      .attr('opacity', 0);

    d3.selectAll('.proportionLabels')
      .attr('opacity', 0);

    d3.select('.titleLabel')
      .attr('opacity', 0);
  }

  const showRemainders = (lombraOrWhaplesData) => {
    d3.selectAll('.transactions')
      .data(lombraOrWhaplesData.nodes())
      .transition()
      .duration(500)
      .attr('width', lombraOrWhaplesData.nodeSize()[0])
      .attr('height', lombraOrWhaplesData.nodeSize()[1])
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .style('fill', d => colorScale(d.remainder));
  }

  const formatRoundingDigit = (format) => {
    if (format === 'format') {
      d3.selectAll('.rounding_digit')
        .transition()
        .duration(500)
        .style('fill', d => d3.color(colorScale(d.remainder)).darker())
        .attr('font-size', svgDimensions.width/60);
      } else if (format === 'reset') {
        d3.selectAll('.rounding_digit') 
          .style('fill', 'black')
          .attr('font-size', svgDimensions.width/80);
      }
  }

  const showPriceLabels = () => {
      const labelsUpdate = d3.selectAll('.priceLabels')
        .attr('opacity', 1)
        .style('fill', 'black');

      //updates other digits 
      labelsUpdate.select('.other_digits')
        .text(d => d.displayPrice.substr(0, d.displayPrice.length - 1)); //all the characters before the last digit
      
      //updates rounding digit
      labelsUpdate.select('.rounding_digit')
        .text(d => d.displayPrice.substr(-1)); //digit character (that will be rounded)  
  }

  const annealTransactions = (lombraOrWhaplesData) => {

    let newGriddedData = orderBy(lombraOrWhaplesData.nodes(), [d => d.remainder], ['asc']); //sorts the data by the remainder

    newGriddedData = gridData(newGriddedData, 0, 0);

    const groupedData = rollup(newGriddedData.nodes(), (v => v.length / newGriddedData.nodes().length), d => d.remainder); //calculate proportions

    const groupedDataArray = [];

    groupedData.forEach((proportion,remainder) => {
      groupedDataArray.push(
        { remainder,
          proportion: parseInt(proportion*100) + '%',
        }
      );
    });

    //anneals transactions
    d3.selectAll('.transactions')
      .data(newGriddedData.nodes(), d => d.key)
      .transition()
      .duration(500)
      .style('fill', d => colorScale(d.remainder))
      .attr('x', d => d.x)
      .transition()
      .duration(500)
      .attr('y', d => d.y)
      .transition()
      .duration(250)
      .attr('width', newGriddedData.nodeSize()[0])
      .transition()
      .duration(250)
      .attr('height', newGriddedData.nodeSize()[1]);

      const proportionLabels = d3.select('#svg_rounding')
        .selectAll('.proportionLabels')
        .data(groupedDataArray)
        .join('text')
        .attr('class', 'proportionLabels')
        .attr('font-size', svgDimensions.width * .015)
        .attr('text-anchor', 'middle')
        .attr('x', svgDimensions.width * .5 - gPaddingX)
        .attr('y', (d,i) => {
          switch (i) {
            case 0: return svgDimensions.height * .03;
            case 1: return svgDimensions.height * .06;
            case 2: return svgDimensions.height * .92;
            case 3: return svgDimensions.height * .95;
            case 4: return svgDimensions.height * .98;
          }
        }) 
        .style('fill', d => d3.color(colorScale(d.remainder)).darker())
        .text(d => {
          switch (d.remainder) {
            case -0.02:
              return `Stores gain 2 cents from ${d.proportion} of the sales.`;
            case -0.01:
              return `Stores gain 1 cent from ${d.proportion} of the sales.`;
            case 0:
              return `No rounding occurs in ${d.proportion} of the sales.`;
            case 0.01:
              return `Customers gain 1 cent from ${d.proportion} of the sales.`;
            case 0.02:
              return `Customers gain 2 cents from ${d.proportion} of the sales.`;
          }
        })
        .attr('opacity', 0);
        
    const showProportionLabels = () => {
      proportionLabels
        .transition()
        .duration(500)
        .attr('opacity', 1);
    }

    setTimeout(showProportionLabels, 1600);

  }

  const showTitle = (title) => {
    if (d3.select('.titleLabel').empty()) {
     d3.select('#svg_rounding')
        .append('text')
        .attr('class', 'titleLabel')
        .text(`Each rectangle represents the price of ${title === 'item' ? 'an individual':'a'} ${title}.`)
        .style('fill', title === 'item' ? d3.color(colors.lightblue).darker() : d3.color(colors.lavender).darker())
        // .style('fill', 'var(--buyingPowerSilver)')
        .attr('x', svgDimensions.width * .5)
        .attr('y', svgDimensions.height * .95)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .attr('font-size', svgDimensions.width/40)
        .transition()
        .duration(500)
        .attr('opacity', 1);
    } else if (!d3.select('.titleLabel').empty()) {
        d3.select('.titleLabel')
          .text(`Each rectangle represents the price of ${title === 'item' ? 'an':'a'} ${title}.`)
          .style('fill', title === 'item' ? d3.color(colors.lightblue).darker() : d3.color(colors.lavender).darker())
          .transition()
          .duration(500)
          .attr('opacity', 1);
    }
    
  }

  const averageRemainders = (whichRemainderMean, reGridData) => {
    d3.selectAll('.transactions')
      .data(reGridData.nodes())
      .transition()
      .duration(750)
      .attr('x', 0)
      .transition()
      .duration(500)
      .attr('y', 0)
      .attr('width', reGridData.nodeSize()[0])
      .attr('height', reGridData.nodeSize()[1])
      .style('fill', colorScale(whichRemainderMean))
      .transition()
      .duration(500)
      .attr('x', d => d.x)
      .attr('y', d => d.y);

    const averageLabels = () => {

      d3.selectAll('.priceLabels')
        .data(reGridData.nodes())
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .style('fill', d3.color(colorScale(whichRemainderMean)).darker());

  
      d3.selectAll('.priceLabels')
        .select('.other_digits')
        .text(whichRemainderMean.substr(0, whichRemainderMean.length - 1).replace('-','')); //remove minus sign from text


      d3.selectAll('.priceLabels')
        .select('.rounding_digit')
        .attr('font-size', svgDimensions.width/80)
        .style('fill', d3.color(colorScale(whichRemainderMean)).darker())
        .text(whichRemainderMean.substr(-1));
    }  

    setTimeout(averageLabels, 1600); //show the average labels after a delay
  }

  
  //this statement switches between the g elements
  switch (data_step_attribute) {

    //svg slide
    case 1:
      doesGExist(data_step_attribute);
      showG1();
      hideAllLabels();

      //if the external svg is not appended to the g, append it. Otherwise, do nothing.
      if (d3.select('#g1').select('image').empty()) {
        d3.select('#g1')
          .append('image')
          .attr('xlink:href', './images/rounding_overview.png')
          .attr('width', svgDimensions.width)
          .attr('height', svgDimensions.height);
      }
      break;

    //lombra intro
    case 2:
      doesGExist(data_step_attribute);
      showG2();
      hideAllLabels();
      showTitle('item');
      
      //if the g element for #g2 doesn't exist, create it and center it
      if (d3.select('#grid').empty()) {
        d3.select('#g2')
          .append('g')
          .attr('id', 'grid')
          .attr('width', svgDimensions.width * gPaddingX)
          .attr('height', svgDimensions.height * gPaddingY)
          .attr('transform', `translate(${svgDimensions.width/2 * (1 - gPaddingX)}, ${svgDimensions.height * .4 * (1 - gPaddingY)})`);
      }

      //if the g element for the price labels doesn't exist, create it and center it
      if (d3.select('#gPriceLabels').empty()) {
        d3.select('#g2')
          .append('g')
          .attr('id', 'gPriceLabels')
          .attr('transform', `translate(${svgDimensions.width/2 * (1 - gPaddingX)}, ${svgDimensions.height * .4 * (1 - gPaddingY)})`);
      }
      drawGrid(griddedLombraData); //draw grid with lombra data    
      formatRoundingDigit('reset');
      break;

    //lombra remainders and colored rectangles
    case 3:
      showG2();
      showRemainders(griddedLombraData); //colors the rectangle
      formatRoundingDigit('format');
      hideAllLabels();
      showPriceLabels();
      break;

    //annealed lombra transactions
    case 4:
      showG2();
      hideAllLabels();
      annealTransactions(griddedLombraData);
      break;

    //averaged lombra transactions
    case 5:
      showG2();
      averageRemainders(lombraStatistics.meanRounded, griddedLombraData);
      hideAllLabels();
      break;
    
    //whaples intro
    case 6:
      showG2();
      drawGrid(griddedWhaplesData); //draw grid with whaples data
      formatRoundingDigit('reset');
      hideAllLabels();
      showTitle('transaction');
      break;

    //whaples remainders and colored rectangles
    case 7:
      showG2();
      showRemainders(griddedWhaplesData); //colors the rectangle
      formatRoundingDigit('format');
      hideAllLabels();
      showPriceLabels();
      break;  
    
    //annealed whaples transactions
    case 8:
      showG2();
      hideAllLabels();
      annealTransactions(griddedWhaplesData);
      break;

    //averaged whaples transactions
    case 9:
      showG2();
      hideAllLabels();
      averageRemainders(whaplesStatistics.meanRounded, griddedWhaplesData);
      break;

  }    
} //end of drawRounding()

export default drawRounding;
export {lombraStatistics, whaplesStatistics};

