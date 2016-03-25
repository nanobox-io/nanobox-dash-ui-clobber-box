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
      {txt:"App Components", icon:'app-component'}
      {txt:"Platform Components", icon:'platform-component'}
      {txt:"Scale", icon:'scale'}
      {txt:"Stats", icon:'stats'}
    ]
    @nav = new BoxNav $node, navItems
