Manager = require 'managers/manager'

module.exports = class AppComponents extends Manager

  constructor: (@$el, components, @resizeCb) ->
    super()
    @generations = []
    for componentData in components
      @addComponent componentData

  addComponent : (componentData) ->
    for generationData in componentData.generations
      if generationData.state != "archived"
        @addGeneration componentData, generationData

  removeComponent : (componentId) ->
    for generationBox in @generations
      if generationBox.data.componentData.id == componentId
        generationBox.destroy()
        break

  addGeneration : (componentData, generationData) ->
    generation = new nanobox.ClobberBox()
    generation.build @$el, nanobox.ClobberBox.APP_COMPONENT_GENERATION, {componentData:componentData, generationData:generationData}
    @generations.push generation

  removeGeneration : (generationId) ->
    for generationBox in @generations
      if generationBox.data.generationData.id == generationId
        generationBox.destroy()
        break

  updateGenerationState : (id, state) ->
    for generation in @generations
      if id == generation.box.id
        generation.box.setState state

  destroy : () ->
    for generation in @generations
      generation.box.off()
      generation.destroy()
    super()
