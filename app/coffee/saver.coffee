saver = require 'jade/saver'

module.exports = class Saver

  constructor: ($el, onSaveCb, onCancelCb) ->
    $node = $ saver( {} )
    $el.append $node
    $(".save-btn", $node).on 'click', onSaveCb
    $(".cancel", $node).on   'click', onCancelCb
    setTimeout ()->
      $node.addClass 'open'
    ,
      200

    castShadows $node
