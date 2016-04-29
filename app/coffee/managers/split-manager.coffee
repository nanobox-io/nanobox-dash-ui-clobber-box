Manager = require 'managers/manager'
split = require 'jade/split'

module.exports = class SplitManager extends Manager

  constructor: ($el, isHorizontal, @hideCb) ->
    bunkHouses = [
      {id:"a", name:"EC2 1", current:true, }
      {id:"b", name:"EC2 2"}
      {id:"c", name:"EC2 3"}
    ]

    app = new nanobox.Splitter $el, isHorizontal, bunkHouses, @onSubmit, @onCancel
    super()

  onSubmit : () ->

  onCancel : () => @hideCb()
