saver = require 'jade/saver'

module.exports = class Saver

  constructor: ($el, onSaveCb, onCancelCb) ->
    $node = $ saver( {} )
    $el.append $node
    @$saveBtn = $("button.save", $node)
    @$saveBtn.on 'click', ()=>
      onSaveCb()
    $(".cancel", $node).on   'click', onCancelCb
    setTimeout ()->
      $node.addClass 'open'
    ,
      200

    castShadows $node

  changeState : (state="saving") ->
    if state == 'saving'
      @$saveBtn.addClass "ing"
    else
      @$saveBtn.removeClass "ing"
