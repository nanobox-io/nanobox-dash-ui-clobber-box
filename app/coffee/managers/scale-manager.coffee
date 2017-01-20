Manager = require 'managers/manager'
Saver   = require 'saver'

module.exports = class ScaleManager extends Manager

  constructor: (@$el, currentServerSpecsIds, currentTotal, data, @hideCb) ->
    console.log "scaleDATA : "
    console.log data

    if data.serviceId?
      @hostId = data.serviceId
      # @isCluster = true
    else
      @bunkhouseId = data.bunkhouseId
      @hostId = data.id


    # TEMP TODO : remove this when we allow data components to scale as a cluster
    # if

    @instances = currentTotal
    @scalesHoriz = data.scalesHoriz

    scaleConfigs =
      activeServerId          : currentServerSpecsIds
      onSpecsChange           : @onSelectionChange
      onInscanceTotalChangeCb : @onInstanceTotalChange
      totalInstances          : currentTotal
      isHorizontallyScalable  : data.category != 'data' && @isCluster
      isCluster               : data.category != 'data'

    @category     = data.category
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
    options =
      modal    : "action-confirmation-modal"
      header   : "Scale Confirmation"
      content  : "Lorem Ipsum : Scaling this component will take if offline for some amount of time.."
      onOpen   : ->
      onSubmit : @saveIt
      onClose  : ->

    # load and show a modal
    nanobox.Modals.load options

  saveIt : () =>
    @saver.changeState 'saving'
    newPlans = @scaleMachine.getUserSelectedPlan()
    data =
      entityId   : @hostId
      newPlan    : newPlans
      entityType : if @isCluster then 'cluster' else 'bunkhouse'
      submitCb   : @hideCb
      category   : @category

    if !@isCluster
      data.entityId = @bunkhouseId

    PubSub.publish 'SCALE.SAVE', data

  onCancel : () =>
    @saveVisible = false
    @hideCb()
