Box     = require 'boxes/box'
BoxNav  = require 'box-nav'
hostBox = require 'jade/host-box'

module.exports = class HostBox extends Box

  constructor: ($el, @data) ->
    $node = $ hostBox( @data )
    $el.append $node

    @buildNav $node
    super $node, @data
    @buildStats $(".stats", $node)

  buildNav : ($node) ->
    navItems = [
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Platform Components", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $node, navItems, @data.id
