const stepsInit = {
  target: null,
  steps: [],
  currentStep: 0,
  svgNode: null,
  renderSvg () {
    this.svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    // viewBox="0 0 766 166" version="1.1" xmlns="http://www.w3.org/2000/svg"
    this.svgNode.setAttribute('viewBox', `0 0 ${this.circleRadius * 2 * this.steps.length * 2} ${((this.circleRadius * 2) + this.strokeWidth) * this.svgHeightRatio}`)
    this.svgNode.setAttribute('version', '1.1')
    // this.svgNode.setAttributeNS("http://www.w3.org/2000/svg", 'xmlns', 'http://www.w3.org/2000/svg')
    this.svgNode.setAttribute('height', `${this.circleRadius}`)  // viewBox will handle it
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

    const lineTest = document.createElementNS("http://www.w3.org/2000/svg", 'line')
    lineTest.setAttribute('x1', '0%')
    lineTest.setAttribute('x2', '0%')
    lineTest.setAttribute('y1', '0%')
    lineTest.setAttribute('y2', '100%')
    lineTest.setAttribute('class', 'line-test')
    lineTest.setAttribute('stroke', this.colorFg)
    lineTest.setAttribute('stroke-width', `${this.strokeWidth}px`)
    lineTest.setAttribute('stroke-dasharray', '0 10000')
    lineTest.setAttribute('stroke-dashoffset', '0')

    this.svgNode.appendChild(lineTest)
    this.svgNode.appendChild(lineBg)
    this.svgNode.appendChild(lineFg)
  },
  renderSvgCircles () {
    this.steps.map((d, i) => {
      const cx = ((( i + 0.5 ) / this.steps.length) * 100).toString() + '%'

      const circleNodeFgBg = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
      circleNodeFgBg.setAttribute('cx', cx)
      circleNodeFgBg.setAttribute('cy', '50%')
      circleNodeFgBg.setAttribute('r', this.circleRadius.toString())
      circleNodeFgBg.setAttribute('stroke-width', `${this.strokeWidth}`)
      circleNodeFgBg.setAttribute('fill', this.backgroundColor)
      circleNodeFgBg.setAttribute('class', 'step-foreground-fill')
      this.svgNode.appendChild(circleNodeFgBg)

      const circleNode = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
      circleNode.setAttribute('cx', cx)
      circleNode.setAttribute('cy', '50%')
      circleNode.setAttribute('r', this.circleRadius.toString())
      circleNode.setAttribute('stroke', this.colorBg)
      circleNode.setAttribute('stroke-width', `${this.strokeWidth}`)
      circleNode.setAttribute('fill', 'none')
      circleNode.setAttribute('class', 'step-background')
      this.svgNode.appendChild(circleNode)

      const circleNodeFg = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
      circleNodeFg.setAttribute('cx', cx)
      circleNodeFg.setAttribute('cy', '50%')
      circleNodeFg.setAttribute('r', this.circleRadius.toString())
      circleNodeFg.setAttribute('stroke', this.colorFg)
      circleNodeFg.setAttribute('stroke-width', `${this.strokeWidth}`)
      circleNodeFg.setAttribute('fill', 'none')
      circleNodeFg.setAttribute('class', 'step-foreground')
      circleNodeFg.setAttribute('stroke-dasharray', '0 10000')
      circleNodeFg.setAttribute('stroke-dashoffset', '0')
      this.svgNode.appendChild(circleNodeFg)
      // text nodes
    })
  },
  renderTextNodes () {
    // line test to get height of svg after viewbox
    const testLine = this.target.querySelector('.line-test')
    const testLength = testLine.getTotalLength();

    this.steps.map((d, i) => {
      const cx = (((( i + 0.5 ) / this.steps.length) + this.textXoffset) * 100).toString() + '%'
      if (d) {
        const textNode = document.createElementNS("http://www.w3.org/2000/svg",'text')
        textNode.setAttribute('x',cx)
        textNode.setAttribute('y', (testLength / 2).toString())
        textNode.setAttribute("alignment-baseline", "central")
        textNode.setAttribute('text-anchor','middle')
        textNode.setAttribute('class','step-text')
        textNode.setAttribute('fill', this.textFill)
        textNode.setAttribute('font-size',`${this.fontSize}`)

        if (d.constructor === Array) {
          const allTextSize = d.length * this.fontSize
          const gapTop = (testLength - allTextSize + this.fontSize) / 2

          d.map((t, i) => {
            const y = gapTop + (i * this.fontSize)
            const tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan')
            tspan.setAttribute('x',cx)
            tspan.setAttribute("alignment-baseline", "central")
            tspan.setAttribute('y', y)
            const spanContent = document.createTextNode(t)
            tspan.appendChild(spanContent)
            textNode.appendChild(tspan)
          })
        } else {
          const text = document.createTextNode(d)
          textNode.appendChild(text)
        }
        this.svgNode.appendChild(textNode)
      }
    })
  },
  animate (callback) {
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

    this.steps.map((s, i) => {
      const completeStepNode = this.target.querySelectorAll('.step-foreground-fill')[i]
      if (this.completeFill) {
        if (i < this.currentStep) {
          completeStepNode.style.transition = `fill ${stepSpeed * (i+1)}ms ease`
          completeStepNode.style.transitionDelay = `${stepSpeed * i + stepSpeed}ms`
          completeStepNode.style.fill = this.completeFill
        } else {
          completeStepNode.style.fill = this.backgroundColor
        }
      }

      if (this.completeTextFill) {
        const completeStepTextNode = this.target.querySelectorAll('.step-text')[i]
        if (i < this.currentStep) {
          completeStepTextNode.style.transition = `fill ${stepSpeed * (i+1) + 50}ms ease`
          completeStepTextNode.style.transitionDelay = `${stepSpeed * i * 0.5}ms`
          completeStepTextNode.style.fill = this.completeTextFill
        } else {
          completeStepTextNode.style.fill = this.textFill
        }
      }

      if (this.activeTextFill) {
        const completeStepTextNode = this.target.querySelectorAll('.step-text')[i]
        if (i === this.currentStep) {
          completeStepTextNode.style.transition = `fill ${stepSpeed * (i+1) + 50}ms ease`
          completeStepTextNode.style.transitionDelay = `${stepSpeed * i * 0.5}ms`
          completeStepTextNode.style.fill = this.activeTextFill
        }
      }
    })

    if (callback && callback.constructor === 'function') {
      callback(this.target.querySelectorAll('.step-text')[this.currentStep])
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
    this.textYPosition = this.setNumber(conf.textYPosition, 50)
    this.textXoffset = this.setNumber(conf.textXoffset, 0)
    this.svgHeightRatio = this.setNumber(conf.svgHeightRatio, 1)
    this.textFill = this.setString(conf.textFill, 'black')
    this.fontSize = this.setNumber(conf.fontSize, 40)
    this.completeFill = this.setString(conf.completeFill, '')
    this.completeTextFill = this.setString(conf.completeTextFill, '')
    this.activeTextFill = this.setString(conf.activeTextFill, '')
  },
  updateProgress (conf, fn) {
    this.currentStep = this.setNumber(conf.currentStep, this.currentStep)
    this.currentStepCompleted = this.setNumber(conf.currentStepCompleted, this.currentStepCompleted)
    this.animationSpeed = this.setNumber(conf.animationSpeed, this.animationSpeed)
    this.animate(fn)
  },
  updateStepsText (steps) {
    // grab all text nodes and remove
    if (steps.length !== this.steps.length) {
      console.error('svg-progress-steps: could not update steps text as unequal step length')
      return this
    }
    this.steps = steps || this.steps
    const allTextNodes = this.svgNode.querySelectorAll('.step-text')
    for (let i = 0; i < allTextNodes.length; i++) {
      allTextNodes[i].remove()
    }
    this.renderTextNodes()
    return this
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
  const progress = Object.create(stepsInit)
  progress.init(conf)
  return progress
}