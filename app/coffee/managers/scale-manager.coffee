Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: (@$el, serverSpecsId, currentTotal) ->
    if currentTotal?
      @scaleMachine = new nanobox.ScaleMachine @$el, serverSpecsId, @onSelectionChange, @onInstanceTotalChange, currentTotal
    else
      @scaleMachine = new nanobox.ScaleMachine @$el, serverSpecsId, @onSelectionChange
    super()

  showSaver : (@$el) ->
    return if @saveVisible
    @saveVisible = true
    saver = new Saver(@$el, @onSave, @onCancel)

  onSelectionChange : (selection)=>
    @showSaver @$el

  onInstanceTotalChange : (instances)=>
    @showSaver @$el

  onSave : () =>
    console.log "save it!"

  onCancel : () =>
    @saveVisible = false
    console.log "cancel it!"
