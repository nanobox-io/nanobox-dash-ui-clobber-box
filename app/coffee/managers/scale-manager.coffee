Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: ($el) ->
    @scaleMachine = new nanobox.ScaleMachine $el, scaleMachineTestData.getHostOptions()
    super()

    @scaleMachine.on "save",   onSave()
    @scaleMachine.on "cancel", onCancel()

    @showSaver $el

  showSaver : ($el) ->
    saver = new Saver($el, @onSave, @onCancel)

  onSave : () =>
    console.log "save it!"

  onCancel : () =>
    console.log "cancel it!"
