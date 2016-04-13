Box                = require 'boxes/box'
BoxNav             = require 'box-nav'
hostBox            = require 'jade/host-box'

module.exports = class HostBox extends Box

  constructor: ($el, @data) ->
    @kind = "host"

    @$node = $ hostBox( @data )
    $el.append @$node

    @buildNav @$node
    super @$node, @data
    PubSub.publish 'REGISTER.HOST', @
    @buildStats $(".stats", @$node)

  buildNav : ($node) ->
    navItems = [
      {txt:"Platform Components", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id

  destroy : () ->
    PubSub.publish 'UNREGISTER.HOST', @
    super()
