Box          = require 'boxes/box'
BoxNav       = require 'box-nav'
componentBox = require 'jade/component-box'

module.exports = class ComponentBox extends Box

  constructor: ($el, @data) ->
    @kind = "component"
    $node = $ componentBox( @data )
    $el.append $node

    if @data.isPlatformComponent
      @buildPlatformComponentNav $node
      PubSub.publish 'REGISTER.PLATFORM_COMPONENT', @
    else
      @buildAppComponentNav $node
      PubSub.publish 'REGISTER.APP_COMPONENT', @

    super $node, @data
    @buildStats $(".stats", $node)

  buildAppComponentNav : ($node) ->
    navItems = [
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Split",   icon:'split',   event:'SHOW.SPLIT'  }
      {txt:"Admin",   icon:'admin',   event:'SHOW.ADMIN'  }
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'  }
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id


  buildPlatformComponentNav  : ($node) ->
    navItems = [
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id
  destroy : () ->
    if @data.isPlatformComponent
      PubSub.publish 'UNREGISTER.PLATFORM_COMPONENT', @
    else
      PubSub.publish 'UNREGISTER.APP_COMPONENT', @

    super()
