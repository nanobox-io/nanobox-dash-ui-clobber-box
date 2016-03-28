module.exports = class Box

  constructor: ($el, data) ->
    shadowIconsInstance.svgReplaceWithString pxSvgIconString, $el

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
