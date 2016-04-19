Manager = require 'managers/manager'

module.exports = class AppComponents extends Manager

  constructor: (@$el, components, @resizeCb) ->
    super()
    @components = []
    for componentData in components
      @addComponent componentData

  addComponent : (componentData) ->
    component = new nanobox.ClobberBox()
    component.build @$el, nanobox.ClobberBox.APP_COMPONENT, componentData
    @components.push component

  updateComponentState : (id, state) ->
    for component in @components
      console.log id, component
      if id == component.box.id
        component.box.setState state

  destroy : () ->
    for component in @components
      component.box.off()
      component.destroy()
    super()
