AdminManager        = require 'managers/admin-manager'
AppComponents       = require 'managers/app-components'
ConsoleManager      = require 'managers/console-manager'
HostInstanceManager = require 'managers/host-instance-manager'
LineAnimator        = require 'misc/line-animator'
PlatformComponents  = require 'managers/platform-components'
ScaleManager        = require 'managers/scale-manager'
SplitManager        = require 'managers/split-manager'
StatsManager        = require 'managers/stats-manager'
zzz                 = require 'jade/zzz'

module.exports = class Box

  constructor: (@$node, @data) ->
    Eventify.extend @
    @id       = @data.id
    @_address = @getAddress()
    @uri      = @getURI()
    castShadows @$node
    @$subContent = $(".sub-content", @$node)
    @$sub        = $(".sub", @$node)

    @fadeOutDuration = 300
    @animateDuration = 250

    @setState @getState()

  # ------------------------------------ These methods should all be overridden in an extending class

  addAppComponent     : () -> console.log "This is not a host, and cannot add app components"
  hasComponentWithId  : () -> false # only used by host boxes..
  hasComponentWithUri : () -> false # only used by host boxes..
  hasGenerationWithId : () -> false # only used by host boxes..

  # ------------------------------------ Shared

  switchSubContent : (newSubState, @clickedNavBtn) ->
    if @subState == newSubState
      if @subManager.secondClick()
        return;
      else
        @closeSubContent(); return
    @subState = newSubState
    window.sub = @$subContent[0]
    @hideCurrentSubContent ()=>
      # Sometimes we should use @data, other times @component data
      id   = @data.id
      data = @data
      switch @kind
        when 'cluster'   then id = @data.serviceId
        when 'component' then id = @componentData.id; data = @componentData
        when 'host'      then id = @data.name

      switch @subState
        when 'admin'               then @subManager = new AdminManager @$subContent, @kind=='host', @data, id
        when 'app-components'      then @subManager = new AppComponents @$subContent, @data.appComponents, @resizeSubContent, @_address
        when 'console'             then @subManager = new ConsoleManager @$subContent, @kind, data
        when 'tunnel'              then @subManager = new ConsoleManager @$subContent, @kind, data, true
        when 'host-instances'      then @subManager = new HostInstanceManager @$subContent, @data
        when 'platform-components' then @subManager = new PlatformComponents @$subContent, @data.platformServices, @hideCurrentSubContent, @resizeSubContent, @_address
        when 'scale-machine'       then @subManager = new ScaleManager @$subContent, @getServerSpecIds(), @totalMembers, @data, @closeSubContent
        when 'split'               then @subManager = new SplitManager @$subContent, data, @kind=='cluster', @closeSubContent, id
        when 'stats'               then @subManager = new StatsManager @$subContent, @kind, id, @getDataForUsageBreakdown()

      @positionArrow @clickedNavBtn, @subState
      @resizeSubContent @subState


  # ------------------------------------ Generation - used by hosts and clusters

  # True if one of my components owns the generation with this id
  hasGenerationWithId : (id) ->
    for componentData in @data.appComponents
      for generation in componentData.generations
        if generation.id == id
          return true
    return false

  # Set a generation's state
  setGenerationState : (id, state) ->
    generation = @getGenerationById(id)
    return if !generation?
    generation.state = state

    # If sub components are open, update visual state as well
    if @subState == 'app-components'
      @subManager.updateGenerationState id, state

  # Set a generation's status
  setGenerationStatus : (id, status) ->
    generation = @getGenerationById(id)
    return if !generation?
    generation.status = status

    # If sub components are open, update visual state as well
    if @subState == 'app-components'
      @subManager.updateGenerationStatus id, status

  # ------------------------------------ Sub content

  # Fades out the `.sub-content` div and calls the callback you pass
  hideCurrentSubContent : (cb, doDestroyCurrentContent=true, doCallResizeBeforeCb=false)=>
    @setHeightToContent()
    # If there isn't currently a sub view, don't
    # fade anything out, just call the callback
    if !@subManager?
      cb()
      return

    me = @
    # Transition happens in the css, just set the value
    @$subContent.css opacity:0
    # Wait for the content to fade out, check _box.scss for duration
    setTimeout ()->
      if doDestroyCurrentContent
        me.destroySubItem()
      if doCallResizeBeforeCb
        me.resizeSubContent null, cb
      else
        cb()
    , @fadeOutDuration

  # Change the `.sub` div's height to match the height of `.sub-content`
  resizeSubContent : (cssClass, cb)=>
    PubSub.publish 'SCROLL_TO', @$node

    if cssClass?
      @$subContent.addClass cssClass
    @setHeightToContent()
    @$sub.addClass "has-content"
    setTimeout ()=>
      @$sub.css height: 'initial'
      @$subContent.css opacity:1
      if cb?
        cb()
    , @animateDuration
    @fire "resize", @


  # Close `.sub` regardless of what is in it
  closeSubContent : =>
    @setHeightToContent()
    @$subContent.css opacity:0
    @$sub.removeClass "has-content"
    setTimeout ()=>
      @subState = ""
      @destroySubItem()
    , @animateDuration
    setTimeout ()=>
      @$sub.css height: 0
    ,20


  # Destroy the sub item
  destroySubItem : () ->
    return if !@subManager?
    @subManager.destroy()
    @$subContent.empty()
    @$subContent.attr 'class', "sub-content"
    @subManager = null

  removeSubContentAnimations : ->
    @$sub.addClass "no-transition"

  # ------------------------------------ Main Content / State

  setState : (state, status, messageCode) ->
    return if state == @state
    @state = state
    switch @state
      when 'created', 'initialized', 'ordered', 'provisioning', 'defunct'
        @animatingState('build', @getStateMessage(@state))
      when 'active'         then @activeState()
      when 'decomissioning' then @animatingState 'destroy', @getStateMessage(@state)
      when 'archived'       then @destroy()
    @setStatus()

  setStatus : (status) ->
    @$node.removeClass 'offline'
    @status = @getStatus(status)
    if @status == 'offline' && @getLatestState() == 'active'
      @addZZZ()
    else
      @removeZZZ()

  addZZZ : () ->
    @$node.addClass 'offline'
    @$zzz = $ zzz( {} )
    castShadows(@$zzz)
    @$node.append @$zzz

  removeZZZ : () ->
    @$node.removeClass 'offline'
    if @$zzz?
      @$zzz.remove()
      @$zzz = null

  animatingState : (animationKind, message) ->
    if @animationKind == animationKind
      $('.animation .title', @$node).text message
      return
    else
      @animationKind = animationKind
      @closeSubContent()
      @fadeOutMainContent ()=>
        # Add some extra padding to the bottom because otherwise it overlaps
        xtra = if @$node.is(':last-child') then 15 else 0
        @$node.css height: @$node.height() + xtra
        @destroyAnyAnimation()
        $('.animation .title', @$node).text message
        @lineAnimation = new LineAnimator $('.animation .svg-holder', @$node),  @kind, @animationKind
        @setStateClassAndFadeIn 'animating'

  activeState : () ->
    @animationKind = null
    @fadeOutMainContent ()=>
      @$node.css height: "initial"
      @destroyAnyAnimation()
      @setStateClassAndFadeIn 'active'

  erroredState  : () ->
    @switchMainViewState 'errored'

  setStateClassAndFadeIn : (cssClass) ->
    @hasContent = true
    @$node.removeClass 'building active errored animating'
    @$node.addClass cssClass
    $(".main-content", @$node).css opacity:1

  destroyAnyAnimation : () ->
    if @lineAnimation?
      @lineAnimation.destroy()
      @lineAnimation = null

  fadeOutMainContent : (cb) ->
    if !@hasContent then cb(); return;
    $(".main-content", @$node).css opacity:0
    setTimeout ()->
      cb()
    , 250



  # ------------------------------------ Helpers

  getLatestState : () ->
    return @state if @state?
    return @data.state

  getStatus : (status) ->
    return status if status?
    return @status if @status
    return @data.status


  setHeightToContent : () -> @$sub.css height: @$subContent[0].offsetHeight

  getName : () ->
    if @data.name?
      return @data.name
    else if @componentData?
      return @componentData.name
    else
      @data.id

  positionArrow : (el, cssClass) ->
    $el = $(el)
    $arrowPointer = $("<div class='arrow-pointer'/>")
    @$subContent.append $arrowPointer
    $arrowPointer.css left : $el.position().left + ($(el).width()/2) + 15
    if cssClass?
      $arrowPointer.addClass cssClass

  getStateMessage : (state) ->
    switch state
      when 'created'        then "#{@getName()} : Creating"
      when 'initialized'    then "#{@getName()} : Initializing"
      when 'ordered'        then "#{@getName()} : Ordering"
      when 'provisioning'   then "#{@getName()} : Provisioning"
      when 'defunct'        then "#{@getName()} : Defunct"
      when 'decomissioning' then "#{@getName()} : Decomissioning"

  getGenerationById : (id) ->
    for componentData in @data.appComponents
      for generation in componentData.generations
        # Save new state in data obj
        if id == generation.id
          return generation
    return null

  # ------------------------------------ Stats

  buildStats : ($el) ->
    params =
      view     : 'standard',
      metrics  : ['cpu', 'ram']
      entity   : @kind
      entityId : @data.id
      start    : '24h'
      stop     : '0h'

    if @kind != 'component'
      params.metrics.push 'swap'
      params.metrics.push 'disk'
    else
      params.entityId = @componentData.id

    if @kind == 'cluster'
      params.entity   = 'component'
      params.entityId = @data.serviceId

    if @kind == 'host-instance'
      params.compressView = true

    if @kind == 'host'
      params.entityId = @data.name

    @stats = new nanobox.HourlyStats $el, params

    @stats.build()

  updateLiveStats     : (data) -> @stats.updateLiveStats data
  updateHistoricStats : (data) -> @stats.updateHistoricStats data

  destroy : () ->
    @stats.destroy()
    @$node.addClass 'faded'

    @$node.css height: @$node.height()
    me = @

    setTimeout ()->
      me.$node.addClass 'archived'
    , 300

    setTimeout ()=>
      @$node.remove()
    , 750

  getDataForUsageBreakdown : () -> #only used by hosts
  getState : () -> @data.state
  getAddress : ()-> @data.id
  getURI : ()->
    if @data.uri? then return @data.uri
    else               return @data.id
