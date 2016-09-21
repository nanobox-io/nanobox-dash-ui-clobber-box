Box                = require 'boxes/box'
BoxNav             = require 'box-nav'
DeployInstructions = require 'misc/deploy-instructions'
hostBox            = require 'jade/host-box'
hostBoxNoDeploys   = require 'jade/host-box-no-deploys'
miniIcons          = require 'jade/host-mini-icons'
NameMachine        = require 'misc/name-machine'

module.exports = class HostBox extends Box

  constructor: (@$el, @data) ->
    @kind = "host"

    @$node = $ hostBox( @data )
    @$el.append @$node

    @$serviceIcons = $(".service-icons", @$node)
    @$serviceIcons.on 'click', (e)=> @nav.trigger 'app-component'
    @updateMiniIcons()

    super @$node, @data
    @buildNav @$node
    PubSub.publish 'REGISTER.HOST', @
    @buildStats $(".stats-strip", @$node)

  buildNav : ($node) ->
    navItems = [
      {txt:"Admin", icon:'admin', event:'SHOW.ADMIN'  }
      {txt:"App Components", icon:'app-component', event: 'SHOW.APP_COMPONENTS'}
      {txt:"Platform", icon:'platform-component', event: 'SHOW.PLATFORM_COMPONENTS'}
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Scale",  icon:'scale', event: 'SHOW.SCALE'}
      {txt:"Stats", icon:'stats', event: 'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @uri

  getServerSpecIds : () ->
    {primary: @data.serverSpecsId}

  addComponent : (componentData) ->
    if @subState == 'app-components' || @subState == 'platform-components'
      @subManager.addComponent componentData
    @updateMiniIcons()

  removeComponent : (componentId) ->
    if @subState == 'app-components' || @subState == 'platform-components'
      @subManager.removeComponent componentId
    @updateMiniIcons()

  # Add a component generation at runtime
  addGeneration : (componentId, generationData) ->
    for componentData in @data.appComponents
      if componentData.id == componentId
        # componentData.generations.push generationData
        if @subState == 'app-components' || @subState == 'platform-components'
          @subManager.addGeneration componentData, generationData

  removeGeneration : (generationId) ->
    if @subState == 'app-components' || @subState == 'platform-components'
      @subManager.removeGeneration generationId

  # I DON'T THINK THIS METHOD IS USED !?!?!?
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

    @deployInstructions = new DeployInstructions @$el
    PubSub.subscribe 'HIDE_NO_DEPLOYS_MESSSAGE', @hideNoDeploysInstructions

  hideNoDeploysInstructions : () =>
    if @deployInstructions? then @deployInstructions.hide()

  # True if one of my components owns the generation with this id
  hasGenerationWithId : (id) ->
    return @getComponentIdContainingGenerationId(id)?

  getComponentIdContainingGenerationId : (generationId) ->
    for componentData in @getAllComponents()
      for generation in componentData.generations
        if generation.id == generationId
          return componentData.id
    return false

  hasComponentWithUri : (uri) ->
    for componentData in @getAllComponents()
      if "#{@uri}/#{componentData.id}" == uri
        return true
    return false

  updateMiniIcons : () ->
    for component in @data.appComponents
      if !component._serviceType?
        component._serviceType = NameMachine.findName component.serviceType

      component._inFlux = false
      if component.generations.length == 0
        component._inFlux = true

      for generation in component.generations
        if generation.state != 'active'
          component._inFlux = true
          break

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

  getDataForUsageBreakdown : ()->
    data =
      services  : []
      hostStats : @stats.getLiveStats()
    # App Components
    for component in @data.appComponents
      data.services.push
        entityId : component.id
        kind     : NameMachine.findName(component.serviceType).id
        name     : component.name
        type     : 'service'
    # Platform Components
    for service in @data.platformServices
      for component in service.components
        data.services.push
          entityId : component.id
          kind     : NameMachine.findName(component.serviceType).id
          name     : component.name
          type     : 'internal'

    return data
