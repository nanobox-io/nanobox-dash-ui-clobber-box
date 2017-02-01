Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: (@$el, currentServerSpecsIds, currentTotal, @data, @hideCb) ->
    if @data.serviceId?
      @hostId = @data.serviceId
      if @data.topology == 'cluster' && @data.clusterShapeIs != 'data-single'
        @isCluster = true
    else
      @isBunkhouse = true
      @bunkhouseId = @data.bunkhouseId
      @hostId      = @data.id

    @instances   = currentTotal

    scaleConfigs =
      activeServerId          : currentServerSpecsIds
      onSpecsChange           : @onSelectionChange
      onInscanceTotalChangeCb : @onInstanceTotalChange
      totalInstances          : currentTotal
      isHorizontallyScalable  : @data.category != 'data' && @isCluster
      isCluster               : @isCluster

    @category     = @data.category
    @scaleMachine = new nanobox.ScaleMachine @$el, scaleConfigs
    super()

  showSaver : (@$el) ->
    return if @saveVisible
    @saveVisible = true
    @saver = new Saver(@$el, @onSaveClick, @onCancel)

  onSelectionChange : (selection)=>
    @showSaver @$el

  onInstanceTotalChange : (@instances)=>
    @showSaver @$el

  onSaveClick : () =>
    # It's a Horizontal cluster
    if @data.topology == 'cluster' && @data.clusterShapeIs == 'horizontal'
      @saveIt()
      return

    options =
      modal    : "action-confirmation-modal"
      onOpen   : ->
      onSubmit : @saveIt
      onClose  : ->

    # Is a bunkhouse:
    if !@data.topology?
      options.header  = "Scale Confirmation"
      options.content = "Note, we are about to provision a new server and transfer your components. During the syncing phase individual components will be briefly unavailable. "
    # It's a data cluster
    else
      options.header  = "Scale Confirmation"
      options.content = "Note, we are about to provision a new server and transfer your data to the new server. During the transfer, your database will be briefly unavailable."
    # load and show a modal
    nanobox.Modals.load options

  saveIt : () =>
    @saver.changeState 'saving'
    newPlans = @scaleMachine.getUserSelectedPlan()
    data =
      entityId   : @hostId
      newPlan    : newPlans
      topology   : if @isCluster then 'cluster' else 'bunkhouse'
      submitCb   : @hideCb
      category   : @category

    if !@isCluster
      data.entityId = @bunkhouseId

    PubSub.publish 'SCALE.SAVE', data

  onCancel : () =>
    @saveVisible = false
    @hideCb()
