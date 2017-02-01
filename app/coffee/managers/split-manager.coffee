Manager = require 'managers/manager'
split = require 'jade/split'

module.exports = class SplitManager extends Manager

  constructor: ($el, @data, @isCluster, @hideCb, @componentId) ->
    PubSub.publish 'GET_BUNKHOUSES',
      id : @componentId
      cb : (bunkHouses)=>
        config =
          isCluster         : @isCluster
          componentId       : @componentId
          category          : @data.category
          clusterable       : @clusterable
          bunkHouses        : bunkHouses
          submitCb          : @onSubmit
          cancelCb          : @onCancel
          clusterShapeIs    : @data.clusterShapeIs
          clusterShapeCanBe : @data.clusterShapeCanBe
          topology          : @data.topology
        app = new nanobox.Splitter $el, config

    super()

  onSubmit : (@data) =>
    # If it's a code component..
    if @data.category != 'data'
      @sendTheData()
      return

    # else, it's data, warn them..
    options =
      modal    : "action-confirmation-modal"
      onOpen   : ->
      onSubmit : @sendTheData
      onClose  : ->
      header   : "Move Confirmation"
      content  : "Note, we are about to move your component to a new server. During the data syncing phase your component will be briefly unavailable."

    # load and show a modal
    nanobox.Modals.load options

  sendTheData : () =>
    @data.submitCb = @hideCb
    PubSub.publish 'SPLIT.SAVE', @data

  onCancel : () =>
    @hideCb()
