Manager = require 'managers/manager'
statsWrapper = require 'jade/stats-wrapper'

module.exports = class StatsManager extends Manager

  constructor: ($el, @kind, entityId, breakdownData) ->

    $statsWrapper = $ statsWrapper( {kind: @kind} )
    $el.append $statsWrapper

    $hourlyAverage = $ ".hourly-avgs-wrap", $statsWrapper
    $hourlyStats   = $ ".hourly-stats-wrap", $statsWrapper
    $breakdown     = $ ".breakdown-wrap", $statsWrapper

    hourlyParams =
      entity   : @kind
      entityId : entityId
      metrics  : ['cpu', 'ram']

    statsParams =
      entity   : @kind
      entityId : entityId
      metrics  : ['cpu', 'ram']
      view     : "expanded"
      start    : '24h'
      stop     : '0h'

    usageBreakdownParams =
      liveHostStats : breakdownData.hostStats
      services      : breakdownData.services
      metrics       : ['ram', 'cpu']

    if @kind != 'component'
      hourlyParams.metrics.push 'swap'
      hourlyParams.metrics.push 'disk'
      statsParams.metrics.push  'swap'
      statsParams.metrics.push  'disk'

    if @kind == 'host-instance'
      hourlyParams.entity = 'member'
      statsParams.entity  = 'member'

    hourly = new nanobox.HourlyAverage $hourlyAverage, hourlyParams
    hourly.build()

    expanded = new nanobox.HourlyStats $hourlyStats, statsParams
    expanded.build()

    if @kind == "host"
      usage = new nanobox.UsageBreakdown $breakdown, usageBreakdownParams
      usage.build()
