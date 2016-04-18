StatsManager       = require 'managers/stats-manager'
ConsoleManager     = require 'managers/console-manager'
PlatformComponents = require 'managers/platform-components'
AppComponents      = require 'managers/app-components'
ScaleManager       = require 'managers/scale-manager'
AdminManager       = require 'managers/admin-manager'
SplitManager       = require 'managers/split-manager'
LineAnimator      = require 'misc/line-animator'

module.exports = class Box

  constructor: (@$node, @data) ->
    Eventify.extend @
    @id = @data.id

    console.log @id

    castShadows pxSvgIconString, @$node
    @$subContent = $(".sub-content", @$node)
    @$sub        = $(".sub", @$node)

    @fadeOutDuration = 300
    @animateDuration = 250
    @setState @data.state

  # ------------------------------------ Shared

  switchSubContent : (newSubState, @clickedNavBtn) ->

    if @subState == newSubState then @closeSubContent(); return
    @subState = newSubState
    window.sub = @$subContent[0]

    @hideCurrentSubContent ()=>

      switch @subState
        when 'stats'               then @subManager = new StatsManager   @$subContent, @kind
        when 'console'             then @subManager = new ConsoleManager @$subContent, @kind
        when 'platform-components' then @subManager = new PlatformComponents @$subContent, @data.platformComponents, @hideCurrentSubContent, @resizeSubContent
        when 'scale-machine'       then @subManager = new ScaleManager @$subContent, @data.serverSpecsId
        when 'app-components'      then @subManager = new AppComponents @$subContent, @data.appComponents, @resizeSubContent
        when 'admin'               then @subManager = new AdminManager @$subContent, @data.appComponents, @resizeSubContent
        when 'split'               then @subManager = new SplitManager @$subContent

      @positionArrow @clickedNavBtn, @subState
      @resizeSubContent @subState

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
  closeSubContent : ->
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

  setState : (state) ->
    return if state == @state
    @state = state
    switch @state
      when 'provisioning'    then @animatingState('build')
      when 'decommissioning' then @animatingState('destroy')
      when 'active'          then @activeState()
      when 'errored'         then @erroredState()

      # - unable to download image,
      # - unable to stat container
      # - unable to plan

  animatingState : (animationKind) ->
    @closeSubContent()
    @fadeOutMainContent ()=>
      @$node.css height: @$node.height() + 20
      @destroyAnyAnimation()
      @lineAnimation = new LineAnimator $('.animation', @$node),  @kind, animationKind
      @setStateClassAndFadeIn 'animating'

  activeState   : () ->
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

  # ------------------------------------ Stats

  buildStats : ($el) ->
    @stats = new nanobox.HourlyStats $el, nanobox.HourlyStats.strip
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
