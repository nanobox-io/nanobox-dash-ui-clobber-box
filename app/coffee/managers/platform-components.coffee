Manager = require 'managers/manager'

module.exports = class PlatformComponents extends Manager

  constructor: ($el, platformComponents, @fadeParentMethod, @resizeCb) ->
    super()

    @createComponents $el, platformComponents

  createComponents : ($el, platformComponents) ->
    @components = []
    for componentData in platformComponents
      component = new nanobox.PlatformComponent $el, componentData.kind, componentData.id
      component.setState "mini"
      # Events
      component.on "show-admin", @showComponentAdmin
      component.on "close-detail-view", @resetView
      @components.push component
      # component.box.on "resize", (m,e)=>
        # @resizeCb()

  showComponentAdmin : (e, id) =>
    return if !@components?
    @fadeParentMethod ()=>
      for component in @components
        if id == component.componentId
          component.setState "full"
          component.box.dontAnimateTransition()
          component.box.box.on "resize", (m,e)=>
            setTimeout ()=>
              console.log "resizing..., but not"
              @resizeCb()
            ,
              3000
        else
          component.setState "hidden"
      @resizeCb()
    ,false, false

  resetView : () =>
    return if !@components?
    @fadeParentMethod ()=>
      for component in @components
        component.setState "mini"
        @resizeCb()
    ,false, false

  destroy : () ->
    for component in @components
      component.destroy()
    super()
    @components = null
