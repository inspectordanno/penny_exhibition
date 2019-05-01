import * as d3 from 'd3';
import { generateSVG } from './utils.js';
import { zincData, seigniorageData } from './seigniorage_data';

console.log(zincData);
console.log(seigniorageData);

generateSVG('#container_seigniorage', 'svg_seigniorage');

const svgDimensions = {
  width: document.querySelector('#svg_seigniorage').clientWidth,
  height: document.querySelector('#svg_seigniorage').clientHeight
}

console.log(svgDimensions.width);
console.log(svgDimensions.height);

const doesGExist = (data_step_attribute) => {
  const empty = d3.select(`#g_${data_step_attribute}`).empty();
  //turn off all other ones
  d3.selectAll('.g_seigniorage')
      .style('opacity', 0);
  //if the current g does not exist, then it makes it
  if (empty) {
    d3.select('#svg_seigniorage')
      .append('g')
      .attr('id', `g_${data_step_attribute}`)
      .attr('class', 'g_seigniorage')
      .attr('width', svgDimensions.width)
      .attr('height', svgDimensions.height)
      .style('opacity', 1)
  } else if (!empty) {
    d3.selectAll('.g_seigniorage')
      .style('opacity', 0);

    d3.select(`#g_${data_step_attribute}`)
      .style('opacity', 1);
  }
}

const drawseigniorage = (data_step_attribute) => {
  const appendComposition = () => {
    if (d3.select(`#g_${data_step_attribute}`).select('image').empty()) {
      d3.select(`#g_${data_step_attribute}`)
        .append('image')
        .attr('xlink:href', './images/composition.png')
        .attr('width', svgDimensions.width)
        .attr('height', svgDimensions.height);
    }
  }

  const drawLineChart = (lineData, accessor, tickFormat, strokeColor, x1, x2, titleLabelText, axisLabelText, lineOpacity, lineY) => {

    const chartMargin = {top: svgDimensions.height * .1, right: svgDimensions.width * .1, bottom: svgDimensions.height * .1, left: svgDimensions.width * .16};
    const chartWidth  = svgDimensions.width - chartMargin.left - chartMargin.right;
    const chartHeight = svgDimensions.height - chartMargin.top - chartMargin.bottom;

    const xScale = d3.scaleLinear()
      .domain(d3.extent(lineData.map(d => d.year)))
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(lineData.map(d => d[accessor])))
      .range([chartHeight, 0])
      .nice();

    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d[accessor]));
      // .curve(d3.curveMonotoneX);

    //if chart doesn't exist, append chart pieces
    if (d3.select('.line_chart').empty()) {

      //title label
      d3.select('#g_zinc')
        .append('text')
        .attr('x', svgDimensions.width * .5)
        .attr('y', svgDimensions.height * .075)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5vw')
        .attr('class', 'title_label')

      //left axis label
      d3.select('#g_zinc')
        .append('text')
        .attr('x', svgDimensions.width * .005)
        .attr('y', svgDimensions.height * .5)
        .style('font-size', '1vw')
        .attr('class', 'left_axis_label')

      //bottom axis label
      d3.select('#g_zinc')
        .append('text')
        .attr('x', svgDimensions.width * .5)
        .attr('y', svgDimensions.height * .97)
        .style('font-size', '1vw')
        .attr('class', 'bottom_axis_label')
        .text('Year')

      const lineChart = d3.select('#g_zinc')
        .append('g')
        .attr('class', 'line_chart')
        .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

      lineChart.append('g')
        .attr('class', 'x_axis')
        .attr('transform', `translate(0, ${chartHeight})`)

      lineChart.append('g')
        .attr('class', 'y_axis')

      lineChart.append("linearGradient")
        .attr("id", "gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        
      lineChart.append('path')
        .attr('class', 'line')
        .style('fill', 'none')

      lineChart.append('line')
        .attr('class', 'zero_line')
        .style('opacity', 0)
        .attr('x1', 0)

        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '5,5,5')
        .style('stroke-linecap', 'round')
    }

    //update title label
    d3.select('.title_label')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)
      .text(titleLabelText)

    //update left axis label text
    d3.select('.left_axis_label')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)
      .text(axisLabelText)

    //create gradient
    d3.select('#gradient')
      .attr("x1", 0).attr("y1", yScale(x1))
      .attr("x2", 0).attr("y2", yScale(x2))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "red"},
          {offset: "50%", color: "red"},
          {offset: "50%", color: "green"},
          {offset: "100%", color: "green"}
        ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);


    //update x axis
    d3.select('.x_axis')
      .transition()
      .duration(500)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.format('.4r'))
      );

    //update y axis
    d3.select('.y_axis')
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale)
        .tickFormat(d3.format(tickFormat))
      );

    //update line
    d3.select('.line')
      .datum(lineData)
      .transition()
      .duration(500)
      .attr('d', line)
      .style('stroke', strokeColor)
      .style('stroke-width', '1.5px')

    //circles selection
    const circles = d3.select('.line_chart')
      .selectAll('.dot')
      .data(lineData)
 
    //update selection
     circles
      .transition()
      .duration(500)
      .style('fill', strokeColor)
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d[accessor]))

    //enter selection
    circles
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .style('fill', strokeColor)
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d[accessor]))
      .attr('r', 3);

    //exit selection
    circles
      .exit()
      .remove();

    console.log(
      lineData.map(d => d.year)
    );

    d3.select('.zero_line')
      .datum(lineData)
      .transition()
      .duration(500)
      .attr('x2', xScale(d3.max(lineData.map(d => d.year))))
      .attr('y1', yScale(lineY))
      .attr('y2', yScale(lineY))
      .style('opacity', lineOpacity)

    //transition not working for this .join() alternative
    // d3.select('.line_chart')
    //     .selectAll('.dot')
    //     .data(lineData)
    //     .join(
    //       enter => enter.append('circle'),
    //       update => update.transition().duration(500),
    //       exit => exit.remove()
    //     )
    //     .attr('class', 'dot')
    //     .style('fill', strokeColor)
    //     .attr('cx', d => xScale(d.year))
    //     .attr('cy', d => yScale(d[accessor]))
    //     .attr('r', 3);
   
  }

  switch (data_step_attribute) {
    case 'composition':
      doesGExist(data_step_attribute);
      appendComposition();
    break;

    case 'zinc':
      doesGExist(data_step_attribute);
      drawLineChart(zincData, 'price', '$.2f', 'var(--buyingPowerSilver)', 0, 0, 'Price of Zinc', 'Price of zinc per lb', 0, 0);
    break;

    case 'penny_cost':
      drawLineChart(seigniorageData, 'cost', '$~r', 'url(#gradient)', .02, .00, 'Cost to Mint One Penny', 'Cost for each penny', 1, .01);
    break;

    case 'seigniorage':
      drawLineChart(seigniorageData, 'seigniorage', '$', 'url(#gradient)', 0, 1, 'Total Gain/Loss to the U.S. Treasury (Seigniorage)', 'Gain/loss (millions)', 1, 0);
    break;
  }
}

export default drawseigniorage;