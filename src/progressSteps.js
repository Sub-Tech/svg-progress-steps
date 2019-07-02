import * as d3 from 'd3'
import _ from 'lodash'

const stepsInit = {
  target: '',
  steps: [],
  currentStep: 0,
  setupProgressBar (data_) {
    var output = [];
    for(var i = 0; i < data_.length; i++){ output.push(data_[i].id.toString()); }
    return output;
  },
  updateProgressBar (step_) {
    this.progress.transition()
      .duration(1000)
      .attr('fill',this.colors.green)
      .attr('width',() => {
        var index = _.findIndex(this.steps, o => o.step == step_)
        return (index) * this.stepWidth;
      });
    for (var i = 0; i < this.steps.length; i++) {
      if (i <= _.findIndex(this.steps, o => o.step == step_)) {
        d3.select('#step_' + i).attr('fill',this.colors.green).attr('stroke',this.colors.green);
        d3.select('#label_' + i).attr('fill','#FFFFFF');
      } else {
        d3.select('#step_' + i).attr('fill','#FFFFFF').attr('stroke',this.colors.lightGreen);
        d3.select('#label_' + i).attr('fill','#000000');
      }
    }
  },
  init () {
    console.log('this', this)
    this.colors = { green: '#4DC87F', lightGreen: '#D9F0E3' };  // color setter
    this.size = {
      radius: 30,
      lineWidth: 5,
      fontSize: 8
    }
    let width = 960, height = 480, offset = 48;
    width += offset * 2;
    height += offset * 2;
    const dimensions = '' + 0 + ' ' + 0 + ' ' + width + ' ' + height;
    const svg = d3.select(this.target).append('svg')
      .attr('id', 'scene', true)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', dimensions)
      .classed('svg-content', true);
    this.steps = [
      {
        step: '0',
        children: []
      },
      {
        step: '1',
        children: []
      },
      {
        step: '2',
        children: [
          {
            step: 2.1
          },
          {
            step: 2.2
          },
          {
            step: 2.3
          }
        ]
      },
      {
        step: '3',
        children: []
      },
      {
        step: '4',
        children: []
      }
    ];  // steps setter
    this.stepWidth = (width - offset * 2) / (this.steps.length - 1)
    this.currentStep = '0';  // current step setter
    this.progressBar = svg.append('g')
      .attr('transform', 'translate(' + offset + ',' + offset + ')')
      .style('pointer-events', 'none');
    const progressBackground = this.progressBar.append('rect')
      .attr('fill', this.colors.lightGreen)
      .attr('height', this.size.lineWidth)
      .attr('width', width - offset * 2)
      .attr('rx', 4)
      .attr('ry', 4);
    this.progress = this.progressBar.append('rect')
      .attr('fill', this.colors.green)
      .attr('height', this.size.lineWidth)
      .attr('width', 0)
      .attr('rx', 4)
      .attr('ry', 4);
    this.progress.transition()
      .duration(1000)
      .attr('width', () => {
        const index = _.findIndex(this.steps, o => o.step == this.currentStep)
        return (index + 1) * this.stepWidth;
      });
    this.progressBar.selectAll('circle')
      .data(this.steps)
      .enter()
      .append('circle')
      .attr('className', (d, i) => d.children.length ? 'step_' + d.step + ' has-children' : 'step_' + d.step)
      .attr('cx', (d, i) => { return i * this.stepWidth; })
      .attr('cy', 4)
      .attr('r', (d) => d.children.length ? this.size.radius : this.size.radius - 1)
      .attr('fill', d => {
        var color = d.children.length ?  '#515151' : '#FFFFFF'
        return color
      })
      .attr('stroke', this.colors.lightGreen)
      .attr('stroke-width', this.size.lineWidth)

    this.progressBar.selectAll('.has-children')
      .data(this.steps)
      .enter()
      .append('circle')
      .each(function (d) {
        console.log('outer d', d, this)
        d.children.map((p) => {
          console.log('children', p)
          d3.select(this)
            .append('rect', function(f) {
              console.log('this is the inner d', f)
            })
            .attr('className', (q, i) => { console.log('this is the inner d', q, i)})
            .attr('fill', 'green')
            .attr('height', 10)
            .attr('width', 10)
            .attr('rx', 5)
            .attr('ry', 5);
        })

      })
      .attr('cx', (d, i) => { return i * this.stepWidth; })
      .attr('cy', 4)
      .attr('r', (d) => d.children.length ? this.size.radius - 1 : 0)
      .attr('className', (d, i) => { console.log(d, i)})
      .attr('fill', d => 'red')

    this.progressBar.selectAll('text')
      .data(this.steps)
      .enter()
      .append('text')
      .attr('className', (d, i) => { return 'label_' + d.step; })
      .attr('dx', (d, i) => { return i * this.stepWidth; })
      .attr('dy', 10)
      .attr('text-anchor', 'middle')
      .text(function(d, i) { return i + 1; })


    this.updateProgressBar("3");

    //self-running demo
    // setInterval(() =>  { this.updateProgressBar(Math.floor(Math.random() * (this.steps.length - 1)).toString()); } , 2500)
  }
}


export default conf => {
  console.log('this is the conf initialized dog shit face', conf)
  const boob = Object.create(stepsInit)


  boob.target = conf.target

  console.log('here is the boob', boob)
  console.dir(boob)

  boob.init()
  return boob
}