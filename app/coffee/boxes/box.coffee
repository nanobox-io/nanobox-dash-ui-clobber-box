module.exports = class Box

  constructor: ($el, @data) ->
    shadowIconsInstance.svgReplaceWithString pxSvgIconString, $el
    @$subContent = $(".sub-content", @$node)
    @$sub        = $(".sub", @$node)
    @fadeOutDuration = 300
    @animatDuration  = 250

  # ------------------------------------ Sub content

  # Fades out the `.sub-content` div and calls the callback you pass
  hideCurrentSubContent : (cb, doDestroyCurrentContent=true)->
    if !@subView?
      cb()
      return

    @$subContent.css opacity:0
    setTimeout ()=>
      if doDestroyCurrentContent
        @destroySubItem()
      cb()
    , @fadeOutDuration

  # Change the `.sub` div's height to match the height of `.sub-content`
  resizeSubContent : (cssClass)->
    @$subContent.addClass cssClass
    @$sub.css height: @$subContent[0].offsetHeight
    setTimeout ()=>
      @$subContent.css opacity:1
    , @animatDuration

  # Close `.sub` regardless of what is in it
  closeSubContent : ->
    $(".sub", @$node).css height: 0

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
