Manager = require 'managers/manager'

module.exports = class ScaleManager extends Manager

  constructor: ($el) ->
    app = new nanobox.ScaleMachine $el, scaleMachineTestData.getHostOptions()
    super()
