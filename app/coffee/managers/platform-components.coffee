Manager = require 'managers/manager'

module.exports = class PlatformComponents extends Manager

  constructor: ($el, @fadeParentMethod) ->
    super()

    @createComponents $el

  createComponents : ($el) ->
    ar = [
      nanobox.PlatformComponent.loadBalancer
      nanobox.PlatformComponent.logger
      nanobox.PlatformComponent.healthMonitor
      nanobox.PlatformComponent.router
      nanobox.PlatformComponent.storage
    ]
    @components = []
    for id in ar
      component = new nanobox.PlatformComponent( $el, id )
      component.setState "mini"
      # Events
      component.on "show-admin", @showComponentAdmin
      component.on "close-detail-view", @resetView
      @components.push component

  showComponentAdmin : (e, id) =>
    return if !@components?
    @fadeParentMethod ()=>
      for component in @components
        if id == component.id
          component.setState "full"
        else
          component.setState "hidden"
    ,false, true

  resetView : () =>
    return if !@components?
    @fadeParentMethod ()=>
      for component in @components
        component.setState "mini"
    ,false, true

  destroy : () ->
    for component in @components
      component.destroy()
    super()
    @components = null
