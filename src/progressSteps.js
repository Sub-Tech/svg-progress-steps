const removePoly = () => {
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }
  }
}
const nameSpace = 'http://www.w3.org/2000/svg'
const w3xlink = 'http://www.w3.org/1999/xlink'
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
    const dimensions = this.isStandardType()
      ? `${this.cR * 2 * this.steps.length * 2} ${((this.cR * 2) + this.strokeWidth)}`
      : `${this.cR * 2 * this.steps.length} ${((this.cR * 2) + this.strokeWidth)}`
    this.setAttrs(this.svgNode, [
      ['viewBox', `0 0 ${dimensions}`],
      ['version', w3xlink],
      ['xmlns:xlink', w3xlink],
      ['height', `${this.cR}`],
      ['width', '100%']
    ])
    this.target.appendChild(this.svgNode)
  },
  renderSvgCircles () {
    this.steps.map((d, i) => {
      const cx = this.isStandardType() ? (this.cD*2) * (i+0.5) : (this.cD*1) * (i+0.5)
      const circleNodeFgBg = document.createElementNS(nameSpace, 'circle')
      this.setAttrs(circleNodeFgBg, [
        ['cx', cx],
        ['cy', '50%'],
        ['r', `${this.cR}`],
        ['stroke-width', `${this.strokeWidth}`],
        ['fill', this.backgroundColor],
        ['class', 'step-foreground-fill']
      ])
      this.svgNode.appendChild(circleNodeFgBg)
    })
  },
  getMedian (values) {
    const half = Math.floor(values.length / 2);
    if (values.length % 2)
      return values[half]
    else
      return (values[half - 1] + values[half]) / 2.0
  },
  renderTextNodes () {
    const yBase = this.cR + (this.strokeWidth/2) + (this.fontSize/3)  // don't want to use dominant-baseline /3 looks right

    this.steps.map((d, i) => {
      const cx = this.isStandardType() ? (this.cD*2) * (i+0.5) : (this.cD*1) * (i+0.5)

      if (d) {
        const textNode = document.createElementNS(nameSpace,'text')
        this.setAttrs(textNode, [
          ['x',cx],
          ['y',yBase],
          ['text-anchor','middle'],
          ['class','step-text'],
          ['fill',this.textFill],
          ['font-size',`${this.fontSize}`]
        ])

        if (d.constructor === Array) {
          const numberedArr = d.map((t, i) => i+1)
          const median = this.getMedian(numberedArr)
          d.map((t, i) => {
            const offset = i+1 - median
            const offsetY = yBase + (offset*this.fontSize)
            const tspan = document.createElementNS(nameSpace, 'tspan')
            this.setAttrs(tspan, [
              ['x', `${cx}`],
              ['y', `${offsetY}`]
            ])
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
  isStandardType () {
    return this.styleType === 'standard'  // does not work if more styles added
  },
  pathAnimate () {
    const pathLines = this.target.querySelectorAll('.path-progress')
    for (let i=0; i < pathLines.length; i++) {
      const length = pathLines[i].getTotalLength()
      pathLines[i].style.transition = `stroke-dasharray ${this.animationSpeed}ms ease-in-out`
      const semiCircleLength = Math.PI * this.cR
      const lineCompletedLength = this.isStandardType()
        ? (semiCircleLength * this.currentStep) + (this.cD * this.currentStep) - (this.strokeWidth/2)
        : semiCircleLength * this.currentStep
      const fractionComplete = this.currentStepCompleted ? semiCircleLength * this.currentStepCompleted : 0
      const lineCompleted = lineCompletedLength+fractionComplete
      setTimeout(function () {
        // annoying, wait till next tick or animation does not happen on load.  todo: figure out proper fix
        pathLines[i].style.strokeDasharray = (lineCompleted < 0 ? 0 : lineCompleted) + ", " + length
      }, 0)
    }
  },
  setTransActive (node, speed, delay, fill) {
    node.style.transition = `fill ${speed}ms ease`
    node.style.transitionDelay = `${delay}ms`
    node.style.fill = fill
  },
  animate (callback) {
    this.pathAnimate()

    const stepSpeed =  this.animationSpeed / (this.currentStep + 1)
    this.steps.map((s, i) => {
      const completeStepNode = this.target.querySelectorAll('.step-foreground-fill')[i]
      if (this.completeFill) {
        completeStepNode.style.transitionDelay = `0ms`
        if (i < this.currentStep) {
          this.setTransActive(completeStepNode, stepSpeed, stepSpeed * i, this.completeFill)
        } else {
          completeStepNode.style.fill = this.backgroundColor
        }
      }

      if (this.activeFill) {
        if (i === this.currentStep) {
          this.setTransActive(completeStepNode, stepSpeed, stepSpeed * i, this.activeFill)
        } else if (i < this.currentStep && this.currentStep) {
          completeStepNode.style.fill = this.completeFill
        } else {
          completeStepNode.style.fill = this.backgroundColor
        }
      }

      const completeStepTextNode = this.target.querySelectorAll('.step-text')[i]
      completeStepTextNode.style.fill = this.textFill
      if (this.completeTextFill) {
        if (i < this.currentStep) {
          this.setTransActive(completeStepTextNode, stepSpeed, stepSpeed * i, this.completeTextFill)
        }
      }

      if (this.activeTextFill) {
        if (i === this.currentStep) {
          this.setTransActive(completeStepTextNode, stepSpeed, stepSpeed * i, this.activeTextFill)
        }
      }
    })

    if (callback && callback.constructor === 'function') {
      callback(this.target.querySelectorAll('.step-text')[this.currentStep])
    }
  },
  createPath () {
    return document.createElementNS(nameSpace, 'path')
  },
  renderPath () {
    const pathULSwitch = {
      standard: [1,0,1,0],
      snake: [1,1]
    }
    const foregroundIndex = this.isStandardType() ? 1 : 0
    const paths = pathULSwitch[this.styleType].map(d => this.createPath())
    paths.map((p, i) => {
      let pathMap = this.isStandardType()
        ? `M ${this.cR} ${this.cR + (this.strokeWidth/2)} `
        : `M ${0} ${this.cR + (this.strokeWidth/2)} `
      if (this.styleType === 'standard') {
        for (let x=1; x <= this.steps.length; x++) {
          pathMap += `a1 1 0 ${pathULSwitch[this.styleType][i]} ${pathULSwitch[this.styleType][i]} ${this.cD} 0 `
          if (x !== this.steps.length) {
            pathMap += `h${this.cD} `
          }
        }
      }
      if (this.styleType === 'snake') {
        for (let x=1; x <= this.steps.length; x++) {
          pathMap += `a1 1 0 ${x%2} ${x%2} ${this.cD} 0 `
        }
      }

      if (i > foregroundIndex) {  // foreground
        this.setAttrs(p, [
          ['stroke', this.colorFg],
          ['fill', 'none'],
          ['stroke-width', this.strokeWidth],
          ['class', 'path-progress'],
          ['stroke-dasharray', '0 10000'],
          ['stroke-dashoffset', '0'],
          ['d', pathMap]
        ])
      } else {  // background
        this.setAttrs(p, [
          ['stroke', this.colorBg],
          ['fill', 'none'],
          ['stroke-width', this.strokeWidth],
          ['d', pathMap]
        ])
      }
      this.svgNode.appendChild(p)
    })
  },
  setNumber (val, def) {
      return isNaN(val) ? def : val
  },
  setString (val, def) {
    return val || def
  },
  setEnumString (val, def, allowed) {
    return allowed.indexOf(val) != -1 ? val : def
  },
  setConfig (conf) {
    this.target = conf.target
    this.cR = this.setNumber(conf.circleRadius, 60)
    this.currentStep = this.setNumber(conf.currentStep, 0)
    this.currentStepCompleted = this.setNumber(conf.currentStepCompleted, 0)
    this.animationSpeed = this.setNumber(conf.animationSpeed, 500)
    this.steps = conf.steps || []
    this.backgroundColor = this.setString(conf.backgroundColor, '#ffffff')
    this.colorBg = this.setString(conf.colorBg, '#cccccc')
    this.colorFg = this.setString(conf.colorFg, 'limeGreen')
    this.strokeWidth = this.setNumber(conf.strokeWidth, 12)
    this.textFill = this.setString(conf.textFill, 'black')
    this.fontSize = this.setNumber(conf.fontSize, 40)
    this.completeFill = this.setString(conf.completeFill, '')
    this.activeFill = this.setString(conf.activeFill, '')
    this.completeTextFill = this.setString(conf.completeTextFill, '')
    this.activeTextFill = this.setString(conf.activeTextFill, '')
    this.styleType = this.setEnumString(conf.styleType, 'standard', ['snake'])
    this.cD =  this.cR * 2
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

    removePoly() // ie no remove on element

    this.setConfig(conf)
    this.renderSvg()
    this.renderSvgCircles()
    this.renderPath()
    this.renderTextNodes()
    this.animate()
  }
}

export default conf => {
  const progress = Object.create(stepsInit)
  progress.init(conf)
  return progress
}