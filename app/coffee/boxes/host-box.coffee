Box                = require 'boxes/box'
BoxNav             = require 'box-nav'
hostBox            = require 'jade/host-box'
PlatformComponents = require 'managers/platform-components'
AppComponents      = require 'managers/app-components'
ScaleManager       = require 'managers/scale-manager'
StatsManager       = require 'managers/stats-manager'

module.exports = class HostBox extends Box

  constructor: ($el, @data) ->
    @$node = $ hostBox( @data )
    $el.append @$node

    @buildNav @$node
    super @$node, @data
    @buildStats $(".stats", @$node)

  showPlatformComponents : () ->
    # TODO : there may be a better way to handle state.. Also, I'm using this to
    #  close content, we'll proabably want a dedicated close button
    if @state == 'platform-components' then @closeSubContent(); return
    @state = "platform-components"

    @hideCurrentSubContent ()=>
      @subView = new PlatformComponents $(".sub-content", @$node), @data.platformComponents, @hideCurrentSubContent, @resizeSubContent
      @resizeSubContent "platform-components"

  showScaleMachine : () ->
    return if @state == 'scale-machine'
    @state = "scale-machine"

    @hideCurrentSubContent ()=>
      @subView = new ScaleManager $(".sub-content", @$node)
      @resizeSubContent "scale-machine"

  showAppComponents : () ->
    return if @state == 'app-components`'
    @state = "app-components"

    @hideCurrentSubContent ()=>
      @subView = new AppComponents $(".sub-content", @$node), @data.appComponents
      @resizeSubContent "app-components"

  showStats : () ->
    return if @state == 'stats'
    @state = "stats"

    @hideCurrentSubContent ()=>
      @subView = new StatsManager $(".sub-content", @$node)
      @resizeSubContent "stats"

  buildNav : ($node) ->
    navItems = [
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Platform Components", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id
