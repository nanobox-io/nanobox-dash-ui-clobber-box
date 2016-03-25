HostBox      = require 'boxes/host-box'
ClusterBox   = require 'boxes/cluster-box'
ComponentBox = require 'boxes/component-box'

class ClobberBox

  constructor: () ->
    shadowIcons = new pxicons.ShadowIcons()

  build : ($el, kind, @data)->
    @id = @data.id
    switch kind
      when ClobberBox.HOST               then @box = new HostBox $el, @data
      when ClobberBox.CLUSTER            then @box = new ClusterBox $el, @data
      when ClobberBox.PLATFORM_COMPONENT then @box = new ComponentBox $el, @data
      when ClobberBox.APP_COMPONENT      then @box = new ComponentBox $el, @data


  updateLiveStats : (data)->
    @box.updateLiveStats data

  # ------------------------------------ Constants

  @CLUSTER            : 'cluster'
  @HOST               : 'host'
  @PLATFORM_COMPONENT : 'platform-component'
  @APP_COMPONENT      : 'service-component'

window.nanobox ||= {}
nanobox.ClobberBox = ClobberBox
