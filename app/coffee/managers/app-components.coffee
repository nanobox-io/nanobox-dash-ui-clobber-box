Manager = require 'managers/manager'

module.exports = class AppComponents extends Manager

  constructor: ($el, components) ->
    super()
    @createComponents $el, components
    @components = []

  createComponents : ($el, components) ->
    for componentData in components
      component = new nanobox.ClobberBox()
      component.build $el, nanobox.ClobberBox.APP_COMPONENT, componentData
