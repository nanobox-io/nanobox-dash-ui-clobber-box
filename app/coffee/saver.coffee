saver =  require 'jade/saver'

module.exports = class Saver

  constructor: ($el, @onSaveCb, @onCancelCb) ->
    $node = $ saver( {} )
    $el.append $node
