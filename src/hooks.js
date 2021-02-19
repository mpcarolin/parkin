import { isFunc, noOp } from '@keg-hub/jsutils'
import { constants } from './constants'

const { HOOK_TYPES } = constants

export class Hooks {
  /**
   * Allowed hook types
   * @memberof Steps
   * @type {Array}
   * @private
   */
  types = HOOK_TYPES

  constructor () {
    this._registeredHooks = {}
    /**
     * Creates helpers for registering step definitions by type
     * @memberof Steps
     * @function
     * @public
     * @param {string} match - Text used to matched with a features step
     * @param {function} method - Function called when a features step text matches the text param
     * @example
     * const steps = new Steps({})
     * steps.Given(`text`, ()=> {})
     *
     * @returns {void}
     */
    this.types.map(type => {
      this[type] = (clientHookFn) => {
        if (!isFunc(clientHookFn)) return
        this._registeredHooks[type] = clientHookFn
      }
    })
  }

  /**
   * @param {string} type 
   * @return {Function} the function registered to the hook type
   */
  getRegistered = type => {
    if (!this.types.includes(type))
      throw new Error(
        `Expected client hook type to be one of ', ${HOOK_TYPES.join(', ')}.
         Found: ${type}`
      )

    return this._registeredHooks[type] || noOp
  }
}