Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: (@$el, serverSpecsId, currentTotal, data) ->

    if data.serviceId?
      @hostId = data.serviceId
      @isCluster = true
    else
      @bunkhouseId = data.bunkhouseId
      @hostId = data.id

    if data.scalesHoriz
      @instances = currentTotal
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

  onInstanceTotalChange : (@instances)=>
    @showSaver @$el

  onSave : () =>
    data =
      hostId    : @hostId
      newPlan   : @scaleMachine.getUserSelectedPlan()
      isCluster : @isCluster == true

    if @instances?
      data.totalInstances = @instances
    else
      data.totalInstances = "na"
      data.bunkhouseId = @bunkhouseId

    PubSub.publish 'SCALE.SAVE', data

  onCancel : () =>
    @saveVisible = false
    console.log "cancel it!"
