Manager = require 'managers/manager'

module.exports = class PlatformComponents extends Manager

  constructor: ($el) ->
    super()
    @createComponents $el

  createComponents : ($el) ->
    ar = [
      nanobox.PlatformComponent.loadBalancer
      nanobox.PlatformComponent.logger
      nanobox.PlatformComponent.healthMonitor
      nanobox.PlatformComponent.router
      nanobox.PlatformComponent.storage
    ]
    for id in ar
      component = new nanobox.PlatformComponent( $el, id )
      component.setState "mini"
      component.updateLiveStats statsDataSimultor.generateFakeLiveStats()  # Load fake data (only included for testing : hourly-stats/rel/data-shim.js)
      # Events
      # component.on "show-admin", showAdmin
      # component.on "close-detail-view", resetView
      # components.push component
