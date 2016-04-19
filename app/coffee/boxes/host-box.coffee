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

  addAppComponent : (componentData) ->
    @data.appComponents.push componentData
    if @subState == 'app-components'
      @subManager.addComponent componentData

  updateAppComponentState : (id, state) ->
    for componentData in @data.appComponents
      if id == componentData.id
        componentData.state = state

        if @subState == 'app-components'
          @subManager.updateComponentState id, state



  destroy : () ->
    PubSub.publish 'UNREGISTER.HOST', @
    super()
