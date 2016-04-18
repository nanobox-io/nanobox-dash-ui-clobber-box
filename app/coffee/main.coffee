HostBox        = require 'boxes/host-box'
ClusterBox     = require 'boxes/cluster-box'
ComponentBox   = require 'boxes/component-box'
WindowScroller = require 'misc/window-scroller'

class ClobberBox

  constructor: () ->
    new WindowScroller()
    # shadowIcons = new pxicons.ShadowIcons()

  build : ($el, kind, @data)->
    switch kind
      when ClobberBox.HOST               then @box = new HostBox $el, @data
      when ClobberBox.CLUSTER            then @box = new ClusterBox $el, @data
      when ClobberBox.PLATFORM_COMPONENT then @box = new ComponentBox $el, @data
      when ClobberBox.APP_COMPONENT      then @box = new ComponentBox $el, @data
    @stats = @box.stats

  setState : (state) -> @box.setState state
  dontAnimateTransition : ()-> @box.removeSubContentAnimations()
  destroy : () -> @box.destroy()

  # updateLiveStats     : (data)-> @box.updateLiveStats data
  # updateHistoricStat  : (data)-> @box.updateHistoricStat data
  # initStats           : (data)-> @box.initStats data

  # ------------------------------------ Constants

  @CLUSTER            : 'cluster'
  @HOST               : 'host'
  @PLATFORM_COMPONENT : 'platform-component'
  @APP_COMPONENT      : 'service-component'

window.nanobox ||= {}
nanobox.ClobberBox = ClobberBox
