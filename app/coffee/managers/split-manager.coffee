Manager = require 'managers/manager'
split = require 'jade/split'

module.exports = class SplitManager extends Manager

  constructor: ($el) ->
    # $node = $ split( {} )
    # $el.append $node
    app = new nanobox.Splitter $el 

    super()
