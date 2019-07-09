const getLineLength = lineElem => {
  let x1 = lineElem.x1.baseVal.value
  let x2 = lineElem.x2.baseVal.value
  let y1 = lineElem.y1.baseVal.value
  let y2 = lineElem.y2.baseVal.value
  return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
}
const getCircleLengthPoly = () => {
  if (! window.SVGCircleElement || ! window.SVGCircleElement.prototype.getTotalLength) {
    window.SVGCircleElement.prototype.getTotalLength = function() {
      let radius = this.parentNode.clientHeight  // client height should be the circle radius
      return 2 * Math.PI * radius;        // Get the circumference from 2πr
    }
  }
}
const nameSpace = `http://www.w3.org/2000/svg`
const libName = 'svg-progress-steps'

const stepsInit = {
  target: null,
  steps: [],
  currentStep: 0,
  svgNode: null,
  setAttrs (node, props) {
    for (let i = 0; i < props.length; i++) {
      node.setAttribute(props[i][0], props[i][1])
    }
  },
  renderSvg () {
    this.svgNode = document.createElementNS(nameSpace, "svg")
    this.setAttrs(this.svgNode, [
      ['viewBox', `0 0 ${this.circleRadius * 2 * this.steps.length * 2} ${((this.circleRadius * 2) + this.strokeWidth) * this.svgHeightRatio}`],
      ['version', 'http://www.w3.org/1999/xlink'],
      ['xmlns:xlink', 'http://www.w3.org/1999/xlink'],
      ['height', `${this.circleRadius}`],
      ['width', '100%']
    ])
    this.target.appendChild(this.svgNode)
  },
  renderBar () {
    // const start = this.
    const start = ((( 0.5 ) / this.steps.length) * 100).toString() + '%'
    const end = ((( (this.steps.length - 1) + 0.5 ) / this.steps.length) * 100).toString() + '%'

    const lineBg = document.createElementNS(nameSpace, 'line')
    const lineFg = document.createElementNS(nameSpace, 'line')
    const lineHeightGauge = document.createElementNS(nameSpace, 'line')
    this.setAttrs(lineBg, [
      ['x1', start],
      ['x2', end],
      ['y1', '50%'],
      ['y2', '50%'],
      ['class', 'line-bg'],
      ['stroke', this.colorBg],
      ['stroke-width', `${this.strokeWidth}`]
    ])
    this.setAttrs(lineFg, [
      ['x1', start],
      ['x2', end],
      ['y1', '50%'],
      ['y2', '50%'],
      ['class', 'line-complete'],
      ['stroke', this.colorFg],
      ['stroke-width', `${this.strokeWidth}`],
      ['stroke-dasharray', '0 10000'],
      ['stroke-dashoffset', '0']
    ])
    this.setAttrs(lineHeightGauge, [
      ['x1', '0%'],
      ['x2', '0%'],
      ['y1', '0%'],
      ['y2', '100%'],
      ['class', 'line-test'],
      ['stroke', this.colorFg],
      ['stroke-width', `${this.strokeWidth}`],
      ['stroke-dasharray', '0 10000'],
      ['stroke-dashoffset', '0']
    ])
    this.svgNode.appendChild(lineHeightGauge)
    this.svgNode.appendChild(lineBg)
    this.svgNode.appendChild(lineFg)
  },
  renderSvgCircles () {
    this.steps.map((d, i) => {
      const cx = ((( i + 0.5 ) / this.steps.length) * 100).toString() + '%'

      const circleNodeFgBg = document.createElementNS(nameSpace, 'circle')
      this.setAttrs(circleNodeFgBg, [
        ['cx', cx],
        ['cy', '50%'],
        ['r', this.circleRadius.toString()],
        ['stroke-width', `${this.strokeWidth}`],
        ['fill', this.backgroundColor],
        ['class', 'step-foreground-fill']
      ])
      this.svgNode.appendChild(circleNodeFgBg)

      const circleNode = document.createElementNS(nameSpace, 'circle')
      this.setAttrs(circleNode, [
        ['cx', cx],
        ['cy', '50%'],
        ['r', this.circleRadius.toString()],
        ['stroke', this.colorBg],
        ['stroke-width', `${this.strokeWidth}`],
        ['fill', 'none'],
        ['class', 'step-background']
      ])
      this.svgNode.appendChild(circleNode)

      const circleNodeFg = document.createElementNS(nameSpace, 'circle')
      this.setAttrs(circleNodeFg, [
        ['cx', cx],
        ['cy', '50%'],
        ['r', this.circleRadius.toString()],
        ['stroke', this.colorFg],
        ['stroke-width', `${this.strokeWidth}`],
        ['fill', 'none'],
        ['class', 'step-foreground'],
        ['stroke-dasharray', '0 10000'],
        ['stroke-dashoffset', '0']
      ])
      this.svgNode.appendChild(circleNodeFg)
    })
  },
  renderTextNodes () {
    // line test to get height of svg after viewbox
    const testLine = this.target.querySelector('.line-test')
    const testLength = getLineLength(testLine);

    this.steps.map((d, i) => {
      const cx = (((( i + 0.5 ) / this.steps.length) + this.textXoffset) * 100).toString() + '%'
      if (d) {
        const textNode = document.createElementNS(nameSpace,'text')
        this.setAttrs(textNode, [
          ['x',cx],
          ['y', (testLength / 2).toString()],
          ['alignment-baseline', 'central'],
          ['text-anchor','middle'],
          ['class','step-text'],
          ['fill', this.textFill],
          ['font-size',`${this.fontSize}`]
        ])

        if (d.constructor === Array) {
          const allTextSize = d.length * this.fontSize
          const gapTop = (testLength - allTextSize + this.fontSize) / 2

          d.map((t, i) => {
            const y = gapTop + (i * this.fontSize)
            const tspan = document.createElementNS(nameSpace, 'tspan')
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
    const lineLength = getLineLength(completedLine);
    const completeLineStroke = lineLength * ((this.currentStep + (this.currentStep/this.steps.length)) / this.steps.length)
    completedLine.style.strokeDasharray = completeLineStroke  + ", " + lineLength

    // first remove any future current steps
    for (let i = this.steps.length - 1; i > this.currentStep; i--) {
      const completeStepNode = this.target.querySelectorAll('.step-foreground')[i]
      if (! completeStepNode) {
        console.error(`${libName}: missing step foreground`)
        continue
      }
      completeStepNode.style.transition = ''
      completeStepNode.style.strokeDasharray = '0, 1000'
    }

    for (let i = 0; i <= this.currentStep; i++) {
      const completeStepNode = this.target.querySelectorAll('.step-foreground')[i]
      if (! completeStepNode) {
        console.error(`${libName}: missing step foreground`)
        continue
      }
      const length = completeStepNode.getTotalLength();
      completeStepNode.style.transition = `stroke-dasharray ${stepSpeed}ms ease-in-out`
      completeStepNode.style.transitionDelay = `${stepSpeed * i}ms`
      if (i === this.currentStep) {
        completeStepNode.style.visibility = 'hidden'
        const completeStroke = length * this.currentStepCompleted
        completeStepNode.style.strokeDasharray = completeStroke + ", " + length
        completeStepNode.style.visibility = 'visible';
      } else {
        completeStepNode.style.strokeDasharray = length + ", " + length
      }
    }

    this.steps.map((s, i) => {
      const completeStepNode = this.target.querySelectorAll('.step-foreground-fill')[i]
      if (this.completeFill) {
        completeStepNode.style.transitionDelay = `0ms`
        if (i < this.currentStep) {
          completeStepNode.style.transition = `fill ${stepSpeed}ms ease`
          completeStepNode.style.transitionDelay = `${stepSpeed * (i+1)}ms`
          completeStepNode.style.fill = this.completeFill
        } else {
          completeStepNode.style.fill = this.backgroundColor
        }
      }

      if (this.completeTextFill) {
        const completeStepTextNode = this.target.querySelectorAll('.step-text')[i]
        if (i < this.currentStep) {
          completeStepTextNode.style.transition = `fill ${stepSpeed}ms ease`
          completeStepTextNode.style.transitionDelay = `${stepSpeed * (i+1)}ms`
          completeStepTextNode.style.fill = this.completeTextFill
        } else {
          completeStepTextNode.style.fill = this.textFill
        }
      }

      if (this.activeTextFill) {
        const completeStepTextNode = this.target.querySelectorAll('.step-text')[i]
        if (i === this.currentStep) {
          completeStepTextNode.style.transition = `fill ${stepSpeed}ms ease`
          completeStepTextNode.style.transitionDelay = `${stepSpeed * (i+1)}ms`
          completeStepTextNode.style.fill = this.activeTextFill
        } else {
          completeStepTextNode.style.fill = this.textFill
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
      console.error(`${libName}: could not update steps text as unequal step length`)
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

    getCircleLengthPoly()  // check if polyfill required and set if so

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