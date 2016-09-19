Box             = require 'boxes/box'
BoxNav          = require 'box-nav'
hostInstanceBox = require 'jade/host-instance-box'
NameMachine = require 'misc/name-machine'

module.exports = class HostInstance extends Box

  constructor: ($el, @data) ->
    @kind = "host-instance"

    if !@data._serviceType?
      @data._serviceType = NameMachine.findName @data.componentData.serviceType

    $node = $ hostInstanceBox( @data )
    $el.append $node

    super $node, @data
    @buildNav $node

    PubSub.publish 'REGISTER.HOST-INSTANCE', @
    @buildStats $(".stats-strip", @$node)

  buildNav : ($node) ->
    navItems = [
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'  }
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @uri

  destroy : () ->
    PubSub.publish 'UNREGISTER.HOST-INSTANCE', @
    super()
