Manager = require 'managers/manager'

module.exports = class AppComponents extends Manager

  constructor: ($el, components, @resizeCb) ->
    super()
    @components = []
    @createComponents $el, components

  createComponents : ($el, components) ->
    for componentData in components
      component = new nanobox.ClobberBox()
      component.build $el, nanobox.ClobberBox.APP_COMPONENT, componentData
      component.dontAnimateTransition()
      @components.push component

      component.box.on "resize", (m,e)=>
        @resizeCb()

  destroy : () ->
    for component in @components
      component.box.off()
      component.destroy()
    super()
