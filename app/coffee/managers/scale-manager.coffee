Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: (@$el, currentServerSpecsIds, currentTotal, data, @hideCb) ->
    if data.serviceId?
      @hostId = data.serviceId
      @isCluster = true
    else
      @bunkhouseId = data.bunkhouseId
      @hostId = data.id


    @instances = currentTotal
    @scalesHoriz = data.scalesHoriz

    scaleConfigs =
      activeServerId          : currentServerSpecsIds
      onSpecsChange           : @onSelectionChange
      totalInstances          : currentTotal
      isHorizontallyScalable  : data.category != 'data'
      isCluster               : @isCluster

    @scaleMachine = new nanobox.ScaleMachine @$el, scaleConfigs
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
    newPlans = @scaleMachine.getUserSelectedPlan()
    data =
      hostId    : @hostId
      newPlan   : newPlans
      isCluster : @isCluster == true
      submitCb  : @hideCb

    if !@isCluster
      data.bunkhouseId = @bunkhouseId

    PubSub.publish 'SCALE.SAVE', data

  onCancel : () =>
    @saveVisible = false
    @hideCb()
