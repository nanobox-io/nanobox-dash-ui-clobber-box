StatsManager       = require 'managers/stats-manager'


module.exports = class Box

  constructor: ($el, @data) ->
    window.huh ||= []
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
      console.log( window.sub == @$subContent[0])
      console.log @$subContent[0]
      window.sub = @$subContent[0]
      @subView = new StatsManager @$subContent, @kind
      @resizeSubContent "stats"

  # ------------------------------------ Sub content

  setCurrentState : (@state) ->


  # Fades out the `.sub-content` div and calls the callback you pass
  hideCurrentSubContent : (cb, doDestroyCurrentContent=true, doCallResizeBeforeCb=false)=>

    # If there isn't currently a sub view, don't
    # fade anything out, just call the callback
    if !@subView?
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
    @$sub.css height: @$subContent[0].offsetHeight
    @$sub.addClass "has-content"
    setTimeout ()=>
      @$subContent.css opacity:1
      if cb?
        cb()
    , @animateDuration

  # Close `.sub` regardless of what is in it
  closeSubContent : ->
    @$sub.css height: 0
    @$subContent.css opacity:0
    @$sub.removeClass "has-content"
    setTimeout ()=>
      @state = ""
      @destroySubItem()
    , @animateDuration


  # Destroy the sub item
  destroySubItem : () ->
    return if !@subView?
    @subView.destroy()
    @$subContent.empty()
    @$subContent.attr 'class', "sub-content"
    @subView = null

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
