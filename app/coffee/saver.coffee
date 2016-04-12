saver = require 'jade/saver'

module.exports = class Saver

  constructor: ($el, onSaveCb, @onCancelCb) ->
    $node = $ saver( {} )
    $el.append $node
    $(".save-btn", $node).on 'click', onSaveCb
    setTimeout ()->
      $node.addClass 'open'
    ,
      200
