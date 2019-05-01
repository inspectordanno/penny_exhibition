import 'intersection-observer';
import { selectAll } from 'd3-selection';
import scrollama from 'scrollama';
import drawseigniorage from './seigniorage';
import drawBuyingPower from './buying_power';
import drawRounding from './rounding';

export const initializeScroll = (data) => {

  //set inital opacity of all steps to .5 
  selectAll('.paragraph')
    .style('opacity', .5);

  //initiate scrollama
  const scrollerBuyingPower = scrollama();
  const scrollerRounding = scrollama();
  const scrollerseigniorage = scrollama();

  const handleStepEnter = (d) => {
    //set opacity of step to 1 on enter
    d.element.setAttribute('style', 'opacity: 1')

    const chapterSelector = (d, attribute, functionName) => {
      if (d.element.hasAttribute(attribute)) {
        functionName(d.element.getAttribute(attribute), data);
      }
    }
    chapterSelector(d, 'data-step-buying-power', drawBuyingPower);
    chapterSelector(d, 'data-step-rounding', drawRounding);
    chapterSelector(d, 'data-step-seigniorage', drawseigniorage);
  }

  const handleStepExit = (d) => {
     //set opacity of step to .5 on exit
    d.element.setAttribute('style', 'opacity: .5')
  }

  //this makes a new scrollama instance for each new container
  const makeScrollamaInstance = (instance, container) => {
    instance
      .setup({
        step: `${container} .paragraph`,
        offset: .65
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit)
  }

  makeScrollamaInstance(scrollerBuyingPower, '#container_buying_power', '#graphic_buying_power');
  makeScrollamaInstance(scrollerRounding, '#container_rounding', '#graphic_rounding');
  makeScrollamaInstance(scrollerseigniorage, '#container_seigniorage', '#graphic_seigniorage');
  
}

