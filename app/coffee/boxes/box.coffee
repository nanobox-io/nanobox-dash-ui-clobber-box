AdminManager        = require 'managers/admin-manager'
AppComponents       = require 'managers/app-components'
ConsoleManager      = require 'managers/console-manager'
HostInstanceManager = require 'managers/host-instance-manager'
LineAnimator        = require 'misc/line-animator'
PlatformComponents  = require 'managers/platform-components'
ScaleManager        = require 'managers/scale-manager'
SplitManager        = require 'managers/split-manager'
StatsManager        = require 'managers/stats-manager'

module.exports = class Box

  constructor: (@$node, @data) ->
    Eventify.extend @
    @id = @data.id

    castShadows @$node
    @$subContent = $(".sub-content", @$node)
    @$sub        = $(".sub", @$node)

    @fadeOutDuration = 300
    @animateDuration = 250
    @setState @data.state

  # ------------------------------------ These methods should all be overridden in an extending class

  addAppComponent     : () -> console.log "This is not a host, and cannot add app components"
  hasComponentWithId  : () -> false # only used by host boxes..
  hasGenerationWithId : () -> false # only used by host boxes..

  # ------------------------------------ Shared

  switchSubContent : (newSubState, @clickedNavBtn) ->

    if @subState == newSubState then @closeSubContent(); return
    @subState = newSubState
    window.sub = @$subContent[0]
    @hideCurrentSubContent ()=>
      switch @subState
        when 'stats'               then @subManager = new StatsManager @$subContent, @kind
        when 'console'             then @subManager = new ConsoleManager @$subContent, @kind
        when 'platform-components' then @subManager = new PlatformComponents @$subContent, @data.platformComponents, @hideCurrentSubContent, @resizeSubContent
        when 'scale-machine'       then @subManager = new ScaleManager @$subContent, @data.serverSpecsId, @totalMembers, @data
        when 'app-components'      then @subManager = new AppComponents @$subContent, @data.appComponents, @resizeSubContent
        when 'admin'               then @subManager = new AdminManager @$subContent, @data.appComponents, @resizeSubContent
        when 'split'               then @subManager = new SplitManager @$subContent, @componentData.scalesHoriz, @closeSubContent, @componentData.id
        when 'host-instances'      then @subManager = new HostInstanceManager @$subContent, @data

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
    for componentData in @data.appComponents
      for generation in componentData.generations
        # Save new state in data obj
        if id == generation.id
          generation.state = state

          # If sub components are open, update visual state as well
          if @subState == 'app-components'
            @subManager.updateGenerationState id, state

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
        @animatingState 'build', @getStateMessage(@state)
      when 'active'         then @activeState()
      when 'decomissioning' then @animatingState 'destroy', @getStateMessage(@state)
      when 'archived'       then @destroy()

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

  setHeightToContent : () -> @$sub.css height: @$subContent[0].offsetHeight

  positionArrow : (el, cssClass) ->
    $el = $(el)
    $arrowPointer = $("<div class='arrow-pointer'/>")
    @$subContent.append $arrowPointer
    $arrowPointer.css left : $el.offset().left + $(".text",el).width()/2 - 1
    if cssClass?
      $arrowPointer.addClass cssClass

  getStateMessage : (state) ->
    switch state
      when 'created'        then "#{@id} : Creating"
      when 'initialized'    then "#{@id} : Initializing"
      when 'ordered'        then "#{@id} : Ordering"
      when 'provisioning'   then "#{@id} : Provisioning"
      when 'defunct'        then "#{@id} : Defunct"
      when 'decomissioning' then "#{@id} : Decomissioning"

  # ------------------------------------ Stats

  buildStats : ($el) ->
    @stats = new nanobox.HourlyStats $el, {view: 'standard'}
    statTypes = [
      {id:"cpu_used",  nickname: "CPU",  name:"CPU Used"}
      {id:"ram_used",  nickname: "RAM",  name:"RAM Used"}
      {id:"swap_used", nickname: "SWAP", name:"Swap Used"}
      {id:"disk_used", nickname: "DISK", name:"Disk Used"}
    ]
    @stats.build()

  updateLiveStats     : (data) -> @stats.updateLiveStats data
  updateHistoricStats : (data) -> @stats.updateHistoricStats data

  destroy : () ->
    @$node.addClass 'faded'

    @$node.css height: @$node.height()
    me = @

    setTimeout ()->
      me.$node.addClass 'archived'
    , 300

    setTimeout ()=>
      @$node.remove()
    , 750
