const stepsInit = {
  target: null,
  steps: [],
  currentStep: 0,
  svgNode: null,
  renderSvg () {
    this.svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    // viewBox="0 0 766 166" version="1.1" xmlns="http://www.w3.org/2000/svg"
    this.svgNode.setAttribute('viewBox', '0 0 766 166')
    this.svgNode.setAttribute('version', '1.1')
    // this.svgNode.setAttributeNS("http://www.w3.org/2000/svg", 'xmlns', 'http://www.w3.org/2000/svg')
    this.svgNode.setAttribute('height', (this.circleRadius * 2.1 * this.svgHeightRatio).toString())
    this.svgNode.setAttribute('width', '100%')
    this.target.appendChild(this.svgNode)
  },
  renderBar () {
    // const start = this.
    const start = ((( 0.5 ) / this.steps.length) * 100).toString() + '%'
    const end = ((( (this.steps.length - 1) + 0.5 ) / this.steps.length) * 100).toString() + '%'

    const lineBg = document.createElementNS("http://www.w3.org/2000/svg", 'line')
    const lineFg = document.createElementNS("http://www.w3.org/2000/svg", 'line')
    lineBg.setAttribute('x1', start)
    lineBg.setAttribute('x2', end)
    lineBg.setAttribute('y1', '50%')
    lineBg.setAttribute('y2', '50%')
    lineBg.setAttribute('class', 'line-bg')
    lineBg.setAttribute('stroke', this.colorBg)
    lineBg.setAttribute('stroke-width', `${this.strokeWidth}px`)

    lineFg.setAttribute('x1', start)
    lineFg.setAttribute('x2', end)
    lineFg.setAttribute('y1', '50%')
    lineFg.setAttribute('y2', '50%')
    lineFg.setAttribute('class', 'line-complete')
    lineFg.setAttribute('stroke', this.colorFg)
    lineFg.setAttribute('stroke-width', `${this.strokeWidth}px`)
    lineFg.setAttribute('stroke-dasharray', '0 10000')
    lineFg.setAttribute('stroke-dashoffset', '0')

    this.svgNode.appendChild(lineBg)
    this.svgNode.appendChild(lineFg)
  },
  renderSvgCircles () {
    this.steps.map((d, i) => {
      const cx = ((( i + 0.5 ) / this.steps.length) * 100).toString() + '%'

      const circleNode = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
      circleNode.setAttribute('cx', cx)
      circleNode.setAttribute('cy', '50%')
      circleNode.setAttribute('r', this.circleRadius.toString())
      circleNode.setAttribute('stroke', this.colorBg)
      circleNode.setAttribute('stroke-width', `${this.strokeWidth}px`)
      circleNode.setAttribute('fill', this.backgroundColor)
      circleNode.setAttribute('class', 'step-background')
      this.svgNode.appendChild(circleNode)

      const circleNodeFg = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
      circleNodeFg.setAttribute('cx', cx)
      circleNodeFg.setAttribute('cy', '50%')
      circleNodeFg.setAttribute('r', this.circleRadius.toString())
      circleNodeFg.setAttribute('stroke', this.colorFg)
      circleNodeFg.setAttribute('stroke-width', `${this.strokeWidth}px`)
      circleNodeFg.setAttribute('fill', 'none')
      circleNodeFg.setAttribute('class', 'step-foreground')
      circleNodeFg.setAttribute('stroke-dasharray', '0 10000')
      circleNodeFg.setAttribute('stroke-dashoffset', '0')
      this.svgNode.appendChild(circleNodeFg)
      // text nodes
    })
  },
  renderTextNodes () {
    this.steps.map((d, i) => {
      const cx = (((( i + 0.5 ) / this.steps.length) + this.textXoffset) * 100).toString() + '%'
      if (d.name) {
        if (d.name.constructor === Array) {
          // map over the tspans for multilines
          /*
           <text x="83" y="55%" class="instruction-text" text-anchor="middle">
           <!--tspan x="83" dy="1.2em">Product</tspan>
           <tspan x="83" dy="1.2em">Chosen</tspan-->
           Product
           </text>
           */
        } else {
          const textNode = document.createElementNS("http://www.w3.org/2000/svg",'text')
          textNode.setAttribute('x',cx)
          textNode.setAttribute('y',`${this.textYPosition}%`)
          textNode.setAttribute('r',this.circleRadius.toString())
          textNode.setAttribute('text-anchor','middle')
          textNode.setAttribute('class','step-text')
          textNode.setAttribute('fill', this.textFill)
          textNode.setAttribute('font-size',`${this.circleRadius * this.textSizeRatio}`)
          const text = document.createTextNode(d.name)
          textNode.appendChild(text)
          this.svgNode.appendChild(textNode)
        }
      }
    })
  },
  animate () {
    const stepSpeed =  this.animationSpeed / this.steps.length
    const lineSpeed = this.animationSpeed - stepSpeed

    // line animation
    const completedLine = this.target.querySelector('.line-complete')
    completedLine.style.transition = `stroke-dasharray ${lineSpeed}ms ease-in-out`
    const lineLength = completedLine.getTotalLength();
    const completeLineStroke = lineLength * ((this.currentStep + (this.currentStep/this.steps.length)) / this.steps.length)
    completedLine.style.strokeDasharray = completeLineStroke  + ", " + lineLength

    // first remove any future current steps
    for (let i = this.steps.length - 1; i > this.currentStep; i--) {
      const completeStepNode = this.target.querySelectorAll('.step-foreground')[i]
      if (! completeStepNode) {
        console.error('svg-progress-steps: missing step foreground')
        continue
      }
      completeStepNode.style.transition = ''
      completeStepNode.style.strokeDasharray = '0, 1000'
    }

    for (let i = 0; i <= this.currentStep; i++) {
      const completeStepNode = this.target.querySelectorAll('.step-foreground')[i]
      if (! completeStepNode) {
        console.error('svg-progress-steps: missing step foreground')
        continue
      }
      const length = completeStepNode.getTotalLength();
      if (i === this.currentStep) {
        completeStepNode.style.transition = `stroke-dasharray ${stepSpeed}ms ease-in-out`
        completeStepNode.style.visibility = 'hidden'
        const completeStroke = length * this.currentStepCompleted
        completeStepNode.style.strokeDasharray = completeStroke + ", " + length
        completeStepNode.style.transitionDelay = `${lineSpeed}ms`
        completeStepNode.style.visibility = 'visible';
      } else {
        completeStepNode.style.transition = `stroke-dasharray ${stepSpeed * (i+1)}ms ease-in-out`
        completeStepNode.style.transitionDelay = `${stepSpeed * i * 0.5}ms`
        completeStepNode.style.strokeDasharray = length + ", " + length
      }
    }
  },
  setNumber (val, def) {
      return isNaN(val) ? def : val
  },
  setString (val, def) {
    return val || def
  },
  setConfig (conf) {
    this.target = conf.target
    this.circleRadius = this.setNumber(conf.circleRadius, 60)
    this.currentStep = this.setNumber(conf.currentStep, 0)
    this.currentStepCompleted = this.setNumber(conf.currentStepCompleted, 0)
    this.animationSpeed = this.setNumber(conf.animationSpeed, 500)
    this.textSizeRatio = this.setNumber(conf.textSizeRatio, 1)
    this.steps = conf.steps || []
    this.backgroundColor = this.setString(conf.backgroundColor, '#ffffff')
    this.colorBg = this.setString(conf.colorBg, '#cccccc')
    this.colorFg = this.setString(conf.colorFg, 'limeGreen')
    this.strokeWidth = this.setNumber(conf.strokeWidth, 12)
    this.textYPosition = this.setNumber(conf.textYPosition, 57)
    this.textXoffset = this.setNumber(conf.textXoffset, 0)
    this.svgHeightRatio = this.setNumber(conf.svgHeightRatio, 1)
    this.textFill = this.setString(conf.textFill, 'black')
  },
  updateProgress (conf) {
    this.currentStep = this.setNumber(conf.currentStep, this.currentStep)
    this.currentStepCompleted = this.setNumber(conf.currentStepCompleted, this.currentStepCompleted)
    this.animationSpeed = this.setNumber(conf.animationSpeed, this.animationSpeed)
    this.animate()
  },
  init (conf) {
    if (! conf.target) return
    if (! conf.steps || ! conf.steps.length) return

    this.setConfig(conf)
    this.renderSvg()
    this.renderBar()
    this.renderSvgCircles()
    this.renderTextNodes()
    this.animate()
  }
}


export default conf => {
  console.log('this is the conf initialized dog shit face', conf)
  const boob = Object.create(stepsInit)
  /*
   [
   {
   name: 'foo',
   },
   {
   name: 'bar'
   },
   {
   name: 'baz'
   },
   {
   name: 'boo'
   }
   ]
  boob.circleRadius = 60

  boob.target = conf.target

  console.log('here is the boob', boob)
  console.dir(boob)
  */

  boob.init(conf)
  return boob
}