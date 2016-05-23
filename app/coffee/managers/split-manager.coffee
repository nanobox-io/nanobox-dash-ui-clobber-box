Manager = require 'managers/manager'
split = require 'jade/split'

module.exports = class SplitManager extends Manager

  constructor: ($el, isHorizontal, @hideCb, componentId) ->
    bunkHouses = [
      {id:"a", name:"EC2 1", current:true, }
      {id:"b", name:"EC2 2"}
      {id:"c", name:"EC2 3"}
    ]

    config =
      componentId  : componentId
      isHorizontal : isHorizontal
      bunkHouses   : bunkHouses
      submitCb     : @onSubmit
      cancelCb     : @onCancel

    app = new nanobox.Splitter $el, config
    super()

  onSubmit : (data) ->
  onCancel : () => @hideCb()
