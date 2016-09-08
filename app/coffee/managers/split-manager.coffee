Manager = require 'managers/manager'
split = require 'jade/split'

module.exports = class SplitManager extends Manager

  constructor: ($el, @category, @clusterable, @hideCb, @componentId) ->
    PubSub.publish 'GET_BUNKHOUSES', (bunkHouses)=>
      config =
        componentId  : @componentId
        category     : @category
        clusterable  : @clusterable
        bunkHouses   : bunkHouses
        submitCb     : @onSubmit
        cancelCb     : @onCancel

      app = new nanobox.Splitter $el, config

    super()

  onSubmit : (data) =>
    data.submitCb = @hideCb
    PubSub.publish 'SPLIT.SAVE', data

  onCancel : () =>
    @hideCb()
