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
    @buildStats $(".stats-strip", @$node)

  buildNav : ($node) ->
    navItems = [
      {txt:"Platform Components", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id

  addComponent : (componentData) ->
    @data.appComponents.push componentData
    if @subState == 'app-components'
      @subManager.addComponent componentData

  # Add a component generation at runtime
  addGeneration : (componentId, generationData) ->
    for componentData in @data.appComponents
      if componentData.id == componentId
        componentData.generations.push generationData
        if @subState == 'app-components'
          @subManager.addGeneration componentData, generationData

  # Set a generation's state
  setGenerationState : (id, state) ->
    for componentData in @data.appComponents
      for generation in componentData.generations
        # Save new state in data obj
        if id == generation.id
          generation.state = state

          # If sub components are open, update visual state as well
          if @subState == 'app-components'
            @subManager.updateGenerationState id, state

  # True if one of my components owns the generation with this id
  hasGenerationWithId : (id) ->
    for componentData in @data.appComponents
      for generation in componentData.generations
        if generation.id == id
          return true
    return false

  hasComponentWithId : (id) ->
    for componentData in @data.appComponents
      if componentData.id == id
        return true
    return false

  destroy : () ->
    PubSub.publish 'UNREGISTER.HOST', @
    super()
