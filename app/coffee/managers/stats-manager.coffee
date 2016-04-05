Manager = require 'managers/manager'

module.exports = class StatsManager extends Manager

  constructor: ($el) ->
    hourly = new nanobox.HourlyAverage $el
    hourly.build()
