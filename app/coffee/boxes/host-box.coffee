Box                = require 'boxes/box'
BoxNav             = require 'box-nav'
hostBox            = require 'jade/host-box'
PlatformComponents = require 'managers/platform-components'
AppComponents      = require 'managers/app-components'

module.exports = class HostBox extends Box

  constructor: ($el, @data) ->
    @$node = $ hostBox( @data )
    $el.append @$node

    @buildNav @$node
    super @$node, @data
    @buildStats $(".stats", @$node)

  showPlatformComponents : () ->
    @hideCurrentSubContent ()=>
      @subView = new PlatformComponents $(".sub-content", @$node)
      @resizeSubContent "platform-components"

  showAppComponents : () ->
    @hideCurrentSubContent ()=>
      @subView = new AppComponents $(".sub-content", @$node), @data.appComponents
      @resizeSubContent "platform-components"

  buildNav : ($node) ->
    navItems = [
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Platform Components", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id
