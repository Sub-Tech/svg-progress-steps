# svg-progress-steps

Micro library for dynamically updating progress using svgs and js

#### Why
Could not find a library that allowed partial step completeness

#### example
```
const foo = stepsProgress({
    target: document.getElementById('target'),
    currentStep: 1,
    currentStepCompleted: 0.2,
    steps: [
      { name: 'foo'},
      { name: 'bar'},
      { name: 'baz'},
      { name: ['boo', 'arse']}
    ]
})
  
// on some event
foo.updateProgress({
  currentStep: 2,
  currentStepCompleted: 0.7
})
```

##### options
```html
    target: domNode
    circleRadius: int def 60
    currentStep: int def 0
    currentStepCompleted: number def 0
    animationSpeed: int def 500
    steps: array def []
    backgroundColor: string hex|colorname|rgb|rgba def '#ffffff'
    colorBg: string hex|colorname|rgb|rgba def '#cccccc'
    colorFg: string hex|colorname|rgb|rgba def 'limeGreen'
    strokeWidth: int def 12
    svgHeightRatio: int def 1
    textFill: string hex|colorname|rgb|rgba def 'black'
    fontSize: int def 40
    completeFill: string hex|colorname|rgb|rgba def ''
    completeTextFill: string hex|colorname|rgb|rgba def ''
    activeTextFill: string hex|colorname|rgb|rgba def ''
```

![Gif example](examples/captured.gif)

Or check out the example html




