StatsManager       = require 'managers/stats-manager'


module.exports = class Box

  constructor: ($el, @data) ->
    Eventify.extend @
    @id = @data.id
    @kind = "host"
    shadowIconsInstance.svgReplaceWithString pxSvgIconString, $el
    @$subContent = $(".sub-content", $el)
    @$sub        = $(".sub", $el)

    @fadeOutDuration = 300
    @animateDuration = 250

  # Shared

  showStats : () ->
    return if @state == 'stats'
    @state = "stats"

    @hideCurrentSubContent ()=>
      window.sub = @$subContent[0]
      @subManager = new StatsManager @$subContent, @kind
      @resizeSubContent "stats"

  # ------------------------------------ Sub content

  setCurrentState : (@state) ->


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
      @state = ""
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

  # ------------------------------------ Helpers

  setHeightToContent : () -> @$sub.css height: @$subContent[0].offsetHeight

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
