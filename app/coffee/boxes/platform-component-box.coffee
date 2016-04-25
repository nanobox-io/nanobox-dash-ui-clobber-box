Box          = require 'boxes/box'
BoxNav       = require 'box-nav'
componentBox = require 'jade/component-box'

module.exports = class PlatformComponentBox extends Box

  constructor: ($el, @data) ->
    @kind = "component"
    $node = $ componentBox( @data )
    $el.append $node

    @buildPlatformComponentNav $node
    PubSub.publish 'REGISTER.PLATFORM_COMPONENT', @

    super $node, @data
    @buildStats $(".stats", $node)

  buildPlatformComponentNav  : ($node) ->
    navItems = [
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id

  destroy : () ->
    PubSub.publish 'UNREGISTER.PLATFORM_COMPONENT', @
    super()
