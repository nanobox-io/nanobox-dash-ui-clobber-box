Manager = require 'managers/manager'
statsWrapper = require 'jade/stats-wrapper'

module.exports = class StatsManager extends Manager

  constructor: ($el, @kind) ->
    $statsWrapper = $ statsWrapper( {kind: @kind} )
    $el.append $statsWrapper

    $hourlyAverage = $ ".hourly-avgs-wrap", $statsWrapper
    $hourlyStats   = $ ".hourly-stats-wrap", $statsWrapper
    $breakdown     = $ ".breakdown-wrap", $statsWrapper

    hourly = new nanobox.HourlyAverage $hourlyAverage
    hourly.build()

    params = {view:"expanded", metrics: ['cpu', 'ram'] }
    if @kind != 'component'
      params.metrics.push 'swap'
      params.metrics.push 'disk'

    expanded = new nanobox.HourlyStats $hourlyStats, params
    expanded.build()


    if @kind == "host"
      usage = new nanobox.UsageBreakdown $breakdown
      usage.build()
