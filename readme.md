# svg-progress-steps

A zero dependency micro library for dynamically updating progress using svgs and js

#### Why
Could not find a library that allowed partial step completeness.  Pure css versions have issues when background colour on parent is set, sending the :after line to be hidden

#### example
```
const foo = stepsProgress({
    target: document.getElementById('target'),
    currentStep: 1,
    currentStepCompleted: 0.2,
    steps: ['foo', 'bar', 'baz', ['boo', 'arse']]
})
  
// on some event
foo.updateProgress({
  currentStep: 2,
  currentStepCompleted: 0.7
})
```

// you can also update any of the text
```html
foo.updateStepsText(['✔️', '✔️', '✔️', ['boo', '50%']]).updateProgress({
  currentStep: 4,
  currentStepCompleted: 0.5
})
```

##### options
```html
    target: domNode
    circleRadius: int def 60
    currentStep: int def 0
    currentStepCompleted: number def 0
    animationSpeed: int def 500
    steps: array def [] // array in array for multiple text lines
    backgroundColor: string hex|colorname|rgb|rgba def '#ffffff'
    colorBg: string hex|colorname|rgb|rgba def '#cccccc'
    colorFg: string hex|colorname|rgb|rgba def 'limeGreen'
    strokeWidth: int def 12
    textFill: string hex|colorname|rgb|rgba def 'black'
    fontSize: int def 40
    completeFill: string hex|colorname|rgb|rgba def ''
    completeTextFill: string hex|colorname|rgb|rgba def ''
    activeTextFill: string hex|colorname|rgb|rgba def ''
    styleType: string enum [standard|snake] def 'standard'
```

![Gif example](https://media.giphy.com/media/WtUlEdWDjMnDPaGsHp/giphy.gif)

Or check out the example html

##### Browser support
Works on browsers with basic svg support eg IE9+
Transitions only work with browsers supporting css transitions :)




