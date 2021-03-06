import { isFloat, isInt, isStr } from '@keg-hub/jsutils'

export const definition = `const { Given } = require("cucumber")
const { getBrowserContext } = require('../../support/setup')
const { getPage } = getBrowserContext()

Given(/I am on (\S+)$/, async url => {
  const page = await getPage()
  await page.goto(url)
})

Then("The word of the day is {word}", async word => {
  expect(word).toBe("test")
})`

export const parsedDefinition = [
  {
    type: 'given',
    match: 'I am on (S+)$',
    variant: 'regex',
    content:
      'Given(/I am on (S+)$/, async url => {\n' +
      '  const page = await getPage()\n' +
      '  await page.goto(url)\n' +
      '})',
  },
  {
    type: 'then',
    match: 'The word of the day is {word}',
    variant: 'expression',
    content:
      'Then("The word of the day is {word}", async word => {\n' +
      '  expect(word).toBe("test")\n' +
      '})',
  },
]

export const expressionDefs = [
  {
    step: {
      type: 'then',
      match: 'I have {int} item(s) ready to go',
      variant: 'expression',
      content: 'Then("I have {int} item(s) ready to go", ()=>{})',
    },
    tests: {
      pass: [ `I have 1 item ready to go`, `I have 2 items ready to go` ],
      fail: [ `I have 1 item`, `I have 1 items ready`, `I have 1 ready to go` ],
    },
  },
  {
    step: {
      type: 'then',
      match:
        'The number {int} is optional/required for {word} as {word} by law',
      variant: 'expression',
      content:
        'Then("The number {int} is optional/required for {word} as {word} by law", ()=>{})',
    },
    tests: {
      pass: [
        `The number 5 is optional for entry as optional by law`,
        `The number 6 is required for entry as required by law`,
      ],
      fail: [
        `The number 5 is needed for entry as optional`,
        `The number 6 is required as optional`,
        `The number 6 is for entry as optional`,
      ],
    },
  },
  {
    step: {
      type: 'then',
      match: 'Convert {int} and {float} and {word} and {string} properly',
      variant: 'expression',
      content: 'Convert {int} and {float} and {word} and {string} properly',
    },
    tests: {
      validate: [
        isInt,
        isFloat,
        arg => isStr(arg) && !arg.includes(' '),
        arg => isStr(arg) && arg.includes(' '),
      ],
      pass: [`Convert 5 and 4.5 and something and "A string" properly`],
    },
  },
]
