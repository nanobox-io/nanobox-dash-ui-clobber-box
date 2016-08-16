Box                = require 'boxes/box'
BoxNav             = require 'box-nav'
DeployInstructions = require 'misc/deploy-instructions'
hostBox            = require 'jade/host-box'
hostBoxNoDeploys   = require 'jade/host-box-no-deploys'
miniIcons          = require 'jade/host-mini-icons'

module.exports = class HostBox extends Box

  constructor: (@$el, @data) ->
    @kind = "host"

    @$node = $ hostBox( @data )
    @$el.append @$node

    @$serviceIcons = $(".service-icons", @$node)
    @updateMiniIcons()

    @buildNav @$node
    super @$node, @data
    PubSub.publish 'REGISTER.HOST', @
    @buildStats $(".stats-strip", @$node)

  buildNav : ($node) ->
    navItems = [
      {txt:"Admin", icon:'admin', event:'SHOW.ADMIN'  }
      {txt:"Platform Components", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id

  getServerSpecIds : () ->
    {primary: @data.serverSpecsId}

  addComponent : (componentData) ->
    @data.appComponents.push componentData
    @updateMiniIcons()
    if @subState == 'app-components' || @subState == 'platform-components'
      @subManager.addComponent componentData

  removeComponent : (componentId) ->
    for componentData, i in @data.appComponents
      if componentData.id == componentId
        @data.appComponents.splice i, 1
        break
    @updateMiniIcons()
    if @subState == 'app-components' || @subState == 'platform-components'
      @subManager.removeComponent componentId

  # Add a component generation at runtime
  addGeneration : (componentId, generationData) ->
    for componentData in @data.appComponents
      if componentData.id == componentId
        # componentData.generations.push generationData
        if @subState == 'app-components' || @subState == 'platform-components'
          @subManager.addGeneration componentData, generationData

  removeGeneration : (generationId) ->
    # componentId = getComponentIdContainingGenerationId()
    # return if !componentId
    if @subState == 'app-components' || @subState == 'platform-components'
      @subManager.removeGeneration generationId

  # Set a generation's state
  setGenerationState : (id, state) ->
    for componentData in @getAllComponents()
      for generation in componentData.generations
        # Save new state in data obj
        if id == generation.id
          generation.state = state

          # If sub components are open, update visual state as well
          if @subState == 'app-components' || @subState == 'platform-components'
            @subManager.updateGenerationState id, state

          else if @subState == 'platform-components'
            @subManager.updateGenerationState id, state


  # When there are no deploys, this gets called
  showAsReadyForDeploys : () ->
    return if @readyForDeploysIsShown
    @readyForDeploysIsShown = true
    @$serviceIcons.empty()
    $readyForAppDeploy = $ hostBoxNoDeploys( {} )
    @$serviceIcons.append $readyForAppDeploy
    castShadows @$serviceIcons

    deployInstructions = new DeployInstructions @$el, 'asdf'


  # True if one of my components owns the generation with this id
  hasGenerationWithId : (id) ->
    return @getComponentIdContainingGenerationId(id)?

  getComponentIdContainingGenerationId : (generationId) ->
    for componentData in @getAllComponents()
      for generation in componentData.generations
        if generation.id == generationId
          return componentData.id
    return false

  hasComponentWithId : (id) ->
    for componentData in @getAllComponents()
      if componentData.id == id
        return true
    return false

  updateMiniIcons : () ->
    @$serviceIcons.empty()
    $icons = $ miniIcons( @data )
    @$serviceIcons.append $icons
    castShadows @$serviceIcons

  destroy : () ->
    PubSub.publish 'UNREGISTER.HOST', @
    super()

  # ------------------------------------ Helpers

  getAllComponents : () ->
    ar = @data.appComponents.concat []
    for service in @data.platformServices
      ar = ar.concat service.components
    ar
