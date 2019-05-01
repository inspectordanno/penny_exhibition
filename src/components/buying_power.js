import * as d3 from 'd3';
import {generateSVG} from './utils.js';
import numeral from 'numeral';

//initial object of items

class Item {
  constructor(name, year, price, fileName) {
    this.name = name;
    this.year = year;
    this.price = price;
    this.file = `./images/${fileName}.svg`
  }
}

let prefilteredItems = [
  //coffee
  new Item('cup of coffee', 1910, 0.05, 'coffee'),
  new Item('cup of coffee', 1960, 0.20, 'coffee'),
  new Item('cup of coffee', 2010, 1.50, 'coffee'),

  //Hershey's chocolate bar
  new Item(`Hersheyʼs chocolate bar`, 1910, 0.02, 'chocolate'),
  new Item(`Hersheyʼs chocolate bar`, 1960, 0.05, 'chocolate'),
  new Item(`Hersheyʼs chocolate bar`, 2010, 0.99, 'chocolate'),

  //postage stamp
  new Item('postage stamp', 1910, 0.02, 'stamp'),
  new Item('postage stamp', 1960, 0.04, 'stamp'),
  new Item('postage stamp', 2010, 0.44, 'stamp'),

  //New York Times
  new Item('New York Times', 1910, 0.01, 'newspaper'),
  new Item('New York Times', 1960, 0.05, 'newspaper'),
  new Item('New York Times', 2010, 2.00, 'newspaper'),

  //loaf of bread
  new Item('loaf of bread', 1910, 0.03, 'bread'),
  new Item('loaf of bread', 1960, 0.23, 'bread'),
  new Item('loaf of bread', 2010, 2.50, 'bread')
];

//adding buying power metric to each item
//then convering buying power to something that will be converted to a fraction

prefilteredItems = prefilteredItems.map((d,i) => { 
  d.buying_power = Math.round((.01 / d.price) * 1000) / 1000;
  d.percent = numeral(d.buying_power).format('0.0%').replace('.0', '') //formats to percent, removes .0
  return d;
})

const root_svg = generateSVG('#container_buying_power', 'svg_buying_power');

const svgDimensions = {
  width: document.querySelector('#svg_buying_power').clientWidth,
  height: document.querySelector('#svg_buying_power').clientHeight
}

const title_g = root_svg
  .append('g')
  .attr('id', 'title')
  .attr('transform', 'translate(0,-3.5)')

const content_g = root_svg
  .append('g')
  .attr('id', 'content')
  // .attr('transform', 'translate(0,1)')


const barWidth = svgDimensions.width * .25;
const barHeight = svgDimensions.height * .6;

const barX = i => {
  return svgDimensions.width * (.025 +(.35 * i));
} 

const barY = svgDimensions.height * .35;

 //append overall bars
 for (let i = 0; i <= 2; i++) {
  content_g.append('rect')
    .attr('class', 'overallBar')
    .attr('x', barX(i)) //the initial starting point is the first number. the second number is how much space there should be between the bars.
    .attr('y', barY)
    .attr('width', barWidth)
    .attr('height', barHeight)
    .style('fill', 'var(--buyingPowerSilver)');
}

function drawBuyingPower(item) {

  //draw overall bars (if they do not exist)
  //attach g's (if they do not exist)

  
  //remove all text before drawing
  d3.selectAll('.buying_power_text')
    .remove();
  
  //remove all images before drawing
  d3.selectAll('.svgImage')
    // .transition()
    // .attr('opacity', 0)
    .remove();

  const yearText = title_g.append('text')
    .attr('class', 'buying_power_text')
    .attr('x', svgDimensions.width * .5)
    .attr('y', svgDimensions.height *.035)
    .attr('text-anchor', 'middle')
    // .style('font-family', 'Dosis, sans-serif')
    .style('font-size', '1.5em');
  
  yearText.append('tspan')
    .text(`How far does one penny go when buying a `)
    .style('fill', 'var(--copper)');
  
  yearText.append('tspan')
    .text(`${item}?`)
    .attr('x', svgDimensions.width * .5)
    .attr('y', svgDimensions.height * .12)
    .attr('id', 'item_title')
    .style('fill', 'var(--buyingPowerSilver)')
    .style('font-size', '2em');

  const buyingPowerScale = d3.scaleLinear()
    .domain([0,1])
    .range([0, barHeight]);  

  const filteredItems = prefilteredItems.filter(d => {
        return d.name === item; 
      });
  
  //drawing external svgs

  const drawImages = (xCoordinate, opacity) => {

    content_g.append('image')
      .attr('class', 'svgImage')
      .attr('x', xCoordinate)
      .attr('y', svgDimensions.height * .22)
      .attr('opacity', 0)
      .attr('width', svgDimensions.width * .03) //30px on desktop
      .attr('height', svgDimensions.width * .03) //30px on desktop
      .attr('href', filteredItems[0].file) //this gets the file attribute
      .transition()
      .duration(1000)
      .attr('opacity', opacity);
  }

  drawImages(svgDimensions.width * .135, 1);
  drawImages(svgDimensions.width * .49, .5);
  drawImages(svgDimensions.width * .84, .2);
  
  const drawYearText = (year, xCoordinate) => {
    //find the item corresponding to the year, and make a fraction out of the buying power using fraction.js
    function displayBuyingPower() {
      const found = filteredItems.find(d => d.year === parseInt(year));
      // const fraction = new Fraction(found.toFraction).toFraction(true);
      // return fraction;
      return found.percent;
    }

    function displayCost() {
      //finds the item, displays the price, converts price to string of 2 decimal places
      const found = filteredItems.find(d => d.year === parseInt(year));
      return (found.price).toFixed(2);
    }

    //appending year
    content_g.append('text')
      .attr('class', 'buying_power_text')
      .text(`In ${year}`)
      .attr('x', xCoordinate)
      .attr('y', svgDimensions.height * .20)
      .attr('text-anchor', 'middle')
      // .style('font-family', 'Dosis, sans-serif')
      .style('fill', 'var(--copper)')
      .style('font-size', '2em');
    
    //appending year
    content_g.append('text')
      .attr('class', 'buying_power_text')
      .text(`A penny could buy ${displayBuyingPower()}`)
      .attr('x', xCoordinate)
      .attr('y', svgDimensions.height * .3)
      .attr('text-anchor', 'middle')
      // .style('font-family', 'Dosis, sans-serif')
      .style('fill', 'var(--copper)')
      .style('font-size', '1em');
    
    const itemText = content_g.append('text')
      .attr('class', 'buying_power_text')
      .attr('x', xCoordinate)
      .attr('y', svgDimensions.height * .33)
      .attr('text-anchor', 'middle')
      // .style('font-family', 'Dosis, sans-serif')
      .style('fill', `var(--copper)`)
      .style('font-size', '1em');
    
    itemText.append('tspan')
      .text('of a ');
    
    itemText.append('tspan')
      .text(`${item}.`)
      .style('fill', 'var(--buyingPowerSilver)');

    //appending Cost:
    const costText = content_g.append('text')
      .attr('class', 'buying_power_text')
      .attr('x', xCoordinate)
      .attr('y', svgDimensions.height * .992)
      .attr('text-anchor', 'middle')
      // .style('font-family', 'Dosis, sans-serif')
      .style('fill', `var(--copper)`)
      .style('font-size', '1em');  

    costText.append('tspan')
      .text('The ')
    
    costText.append('tspan')
      .text(`${item}`)
      .style('fill', 'var(--buyingPowerSilver)');

    costText.append('tspan')
      .text(` cost $${displayCost()}.`);
    
  }

  drawYearText('1910', svgDimensions.width * .15);
  drawYearText('1960', svgDimensions.width * .5);
  drawYearText('2010', svgDimensions.width * .85);


  //update selection
  const bars = content_g.selectAll('.buyingPowerBar')
      .data(filteredItems);
  
  //enter selection
  const enterBars = bars.enter()
    .append('rect')
    .attr('class', 'buyingPowerBar')
    .attr('x', (d, i) => {
      return barX(i);
    })
    .attr('y', svgDimensions.height * .95)
    .attr('width', barWidth)
    .attr('height', 0)
    .style('fill', 'var(--copper)')
    .transition()
    .duration(500)
    .attr('y', d => {
        return (barHeight - buyingPowerScale(d.buying_power)) + barY; // the top of each bar is a relationship between the height and corresponding data value
      })
    .attr('height', d => buyingPowerScale(d.buying_power))
    
    //update selection continued
    const updateBars = bars
      .transition()
      .duration(500)
      .attr('y', d => {
        return (barHeight - buyingPowerScale(d.buying_power)) + barY; // the top of each bar is a relationship between the height and corresponding data value
      })
      .attr('height', d => buyingPowerScale(d.buying_power))

    //exit selection
    const exitBars = bars.exit()
      .remove()
}

export default drawBuyingPower;