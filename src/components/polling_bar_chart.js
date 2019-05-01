import * as d3 from 'd3';
  
const drawBarChart = () => {
//help from https://pudding.cool/process/flexbox-layout/
  class OpinionPenny {
    constructor(opinion, percent) {
      this.name = opinion;
      this.value = percent;
    };
  };
  
  const opinionPennyData = [
    new OpinionPenny('Favor strongly', 16),
    new OpinionPenny('Favor somewhat', 18),
    new OpinionPenny('Oppose somewhat', 20),
    new OpinionPenny('Oppose strongly', 31),
    new OpinionPenny('Not <br> sure', 14)
  ];
  
  const chartHeight = d3.select('.polling_bar_chart')
    .node()
    .getBoundingClientRect()
    .height;

    console.log(chartHeight);
  
  const scaleY = d3.scaleLinear()
    .domain([0, 100])
    .range([0, chartHeight]);

  const chart = d3.select('.polling_bar_chart')

  const opinionGroup = d3.select('.polling_bar_chart')
    .selectAll('.opinion_group')
    .data(opinionPennyData)
    .enter()
    .append('div')
    .attr('class', 'opinion_group')
    .classed('oppose_strongly', d => d.name === 'Oppose strongly')
   
  const opinionBar = opinionGroup
    .append('div')
    .attr('class', 'opinion_bar')
    .style('height', d => `${scaleY(d.value)}px`)
    .style('background-color', 'var(--buyingPowerSilver)');
      
  const opinionLabel = opinionGroup
    .append('span')
    .html(d => d.name)
    .attr('class', 'opinion_label')
  
  const opinionValue = opinionGroup
    .append('span')
    .html(d => d.value + '%')
    .attr('class', 'opinion_value')
}

export default drawBarChart;