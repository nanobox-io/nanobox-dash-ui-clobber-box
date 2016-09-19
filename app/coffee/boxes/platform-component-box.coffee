Box          = require 'boxes/box'
BoxNav       = require 'box-nav'
componentBox = require 'jade/component-box'

module.exports = class PlatformComponentBox extends Box

  constructor: ($el, data) ->
    @data           = data.data
    @hostAddress    = data.hostAddress
    @kind           = "component"
    @componentData  = @data.componentData
    @generationData = @data.generationData
    $node = $ componentBox( @data )
    $node.addClass 'platform-component'
    $el.append $node

    @buildPlatformComponentNav $node
    PubSub.publish 'REGISTER.PLATFORM_COMPONENT', @

    super $node, @data
    @buildStats $(".stats-strip", $node)

  buildPlatformComponentNav  : ($node) ->
    navItems = [
      {txt:"Move",    icon:'split',   event:'SHOW.SPLIT'  }
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.uri

  setSplitability : (isSplitable) ->
    if isSplitable
      @$node.addClass 'splitable'
    else
      @$node.removeClass 'splitable'


  destroy : () ->
    PubSub.publish 'UNREGISTER.PLATFORM_COMPONENT', @
    super()

  getAddress : ()-> "#{@hostAddress}-#{@data.id}"
