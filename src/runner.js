import { parse } from './parse'
import { isArr, capitalize, isObj, isStr, noOp } from '@keg-hub/jsutils'
import {
  throwMissingSteps,
  throwMissingFeatureText,
  testMethodFill,
} from './errors'

/*
 * Resolves a test method from the global scope
 * @function
 * @private
 * @param {string} type - Name of test method to get from the global scope
 *
 * @returns {function} - Test method
 */
const getTestMethod = type => global[type] || testMethodFill(type)

/*
 * Calls the `it` global passing in a registered step function based on the step text
 * @function
 * @private
 * @param {Object} stepsInstance - Instance of the Steps class
 * @param {string} type - Type of step being run
 * @param {string} text - Text of the step from the parsed feature text
 *
 * @returns {Void}
 */
const runStep = (stepsInstance, step) => {
  const test = getTestMethod('test')
  return test(
    `${capitalize(step.type)} ${step.step}`,
    stepsInstance.resolve(step.step)
  )
}

/*
 * Loops through the passed in scenarios steps and calls runStep for each
 * @function
 * @private
 * @param {Object} stepsInstance - Instance of the Steps class
 * @param {Object} scenario - Parsed feature scenario object containing the steps to run
 *
 * @returns {Void}
 */
const runScenario = (stepsInstance, scenario) => {
  const describe = getTestMethod('describe')

  return describe(`Scenario: ${scenario.scenario}`, () => {
    scenario.steps.map(step => runStep(stepsInstance, step))
  })
}

/*
 * Parses and runs the steps of a feature text string
 * Uses the registered steps of the passed in Steps class instance to evaluate the feature steps
 * @class
 * @public
 * @param {Object} stepsInstance - Instance of the Steps class
 *
 * @returns {Object} Instance of the Runner class
 */
export class Runner {
  constructor(steps) {
    !steps && throwMissingSteps()

    this.steps = steps
  }

  /*
   * Parses and runs the steps of a feature text string
   * Matches each step to a registered steps of the Steps class instance
   * @memberof Runner
   * @function
   * @public
   * @param {string|Array<Object>|Object} data - Feature data as a string or parsed Feature model
   *
   * @returns {void}
   */
  run = (data, hooks)  => {
    const features = isStr(data)
      ? parse.feature(data)
      : isObj(data)
        ? [data]
        : isArr(data)
          ? data
          : throwMissingFeatureText()

    const describe = getTestMethod('describe')

    features.map(feature => {
      describe(`Feature: ${feature.feature}`, () => {

        // setup hooks
        beforeAll(hooks.getRegistered('beforeAll'))
        afterAll(hooks.getRegistered('afterAll'))
        beforeEach(hooks.getRegistered('beforeEach'))
        afterEach(hooks.getRegistered('afterEach'))

        feature.scenarios.map(scenario => runScenario(this.steps, scenario))
      })
    })
  }
}
