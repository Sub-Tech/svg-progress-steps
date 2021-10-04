import progressSteps from '../../../src/index.js'

test('new ps is truthy', () => {
  const ps = progressSteps({})
  expect(ps).toBeTruthy();
})

test('ps object init correctly', () => {
  // https://github.com/framer/motion/issues/204
  if (!SVGElement.prototype.getTotalLength) {
    SVGElement.prototype.getTotalLength = () => 1;
  }
  document.body.innerHTML = '<div id="ps_1"></div>'
  const ps1 = progressSteps({
    target: document.getElementById('ps_1'),
    steps: ['1', '2', '3']
  })

  expect(ps1.currentStep).toEqual(0)
  expect(ps1.steps.length).toEqual(3)
})