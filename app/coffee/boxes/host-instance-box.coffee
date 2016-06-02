Box             = require 'boxes/box'
BoxNav          = require 'box-nav'
hostInstanceBox = require 'jade/host-instance-box'

module.exports = class HostInstance extends Box

  constructor: ($el, @data) ->
    console.log @data
    
    $node = $ hostInstanceBox( @data )
    $el.append $node

    @buildNav $node

    super $node, @data
    $('.square-service-icon', $node).css background: $('.bg', $node).css( 'fill')
    $('.bg', $node).css fill: 'none', stroke: 'none'

    PubSub.publish 'REGISTER.HOST-INSTANCE', @
    @buildStats $(".stats-strip", @$node)

  buildNav : ($node) ->
    navItems = [
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'  }
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id

  destroy : () ->
    PubSub.publish 'UNREGISTER.HOST-INSTANCE', @
    super()
