Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: (@$el, serverSpecsId) ->
    @scaleMachine = new nanobox.ScaleMachine @$el, serverSpecsId, @onSelectionChange
    super()

  showSaver : (@$el) ->
    saver = new Saver(@$el, @onSave, @onCancel)

  onSelectionChange : ()=>
    if !@saveVisible
      @saveVisible = true
      @showSaver @$el

  onSave : () =>
    console.log "save it!"

  onCancel : () =>
    @saveVisible = false
    console.log "cancel it!"
