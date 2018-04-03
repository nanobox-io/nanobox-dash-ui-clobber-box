deployInstructions = require 'jade/deploy-instructions'

module.exports = class DeployInstructions

  constructor: ($el, appType) ->
    appName = if nanobox.fqName? then nanobox.fqName else nanobox.appName
    @$node = $ deployInstructions( {appName:appName, appType:appType} )
    $el.append @$node
    castShadows @$node

    $(".main", @$node).on 'click', ()=> @showInstructions()
    $(".close-btn", @$node).on 'click', ()=> @hideInstructions()

  showInstructions : ()->
    @$node.addClass "instructions"

  hideInstructions : ()->
    @$node.removeClass "instructions"

  hide : () ->
    @$node.addClass 'hidden'
    setTimeout ()=>
      @$node.remove()
    ,
      1000
