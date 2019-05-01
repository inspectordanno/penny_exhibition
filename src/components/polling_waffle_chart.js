  import * as d3 from 'd3';
  
  const drawWaffleChart = () => {
    //help from https://pudding.cool/process/flexbox-layout/
    // Select your div
    const waffle = d3.select('.waffle_chart');

    // Create an array with numbers 0 - 99
    const numbers = d3.range(100);

    // For each item in the array, add a div element
    // if the number is < 5, color it red, otherwise gray
    waffle
      .selectAll('.penny')
      .data(numbers)
      .enter()
      .append('img')
      .attr('class', 'penny')
      .attr('src', './images/penny_medium.png')
      .attr('data-ground', (d,i) => {
        switch (true) {
          case (i + 1 <= 71):
            return 'pickup';
          case (i + 1 >= 72 && i + 1 <= 92):
            return 'leave_on_ground';
          case (i + 1 >= 93 && i + 1 <= 100):
            return 'not_sure';
        }
      });

    d3.selectAll(`[data-ground = 'leave_on_ground']`)
      .style('filter', 'grayscale(100%)')
      // .style('opacity', .);  

    d3.selectAll(`[data-ground = 'not_sure']`)
      .style('filter', 'blur(3px)');

   
    
  }

  export default drawWaffleChart;
  
 