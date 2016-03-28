Box          = require 'boxes/box'
BoxNav       = require 'box-nav'
componentBox = require 'jade/component-box'

module.exports = class ComponentBox extends Box

  constructor: ($el, data) ->
    $node = $ componentBox( data )
    $el.append $node

    if data.isPlatformComponent
      @buildPlatformComponentNav $node
    else
      @buildAppComponentNav $node

    super $node, data
    @buildStats $(".stats", $node)

  buildAppComponentNav : ($node) ->
    navItems = [
      {txt:"Console", icon:'console'}
      {txt:"Split", icon:'split'}
      {txt:"Admin", icon:'admin'}
      {txt:"Stats", icon:'stats'}
    ]
    @nav = new BoxNav $node, navItems


  buildPlatformComponentNav  : ($node) ->
    navItems = [
      {txt:"Console", icon:'console'}
      {txt:"Stats", icon:'stats'}
    ]
    @nav = new BoxNav $node, navItems
