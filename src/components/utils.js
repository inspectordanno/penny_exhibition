//global utilities
import {select} from 'd3-selection';

export const graphicDimensions = {
  width: document.querySelector('.graphic_container').clientWidth,
  height: document.querySelector('.graphic_container').clientHeight
}

export const generateSVG = (containerID, svgID) => {
  const root_svg = select(`${containerID} > .graphic_container`)
  .append('svg')
  .attr('width', graphicDimensions.width * .98) //svg 90% width of container
  .attr('height', graphicDimensions.width * .98 * .60) //svg 66% height of container
  .style('font-family', `'Source Sans Pro', sans-serif`)
  .attr('class', 'svg')
  .attr('id', svgID);

  return root_svg;
}
