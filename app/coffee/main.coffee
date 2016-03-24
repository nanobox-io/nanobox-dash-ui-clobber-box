HostBox    = require 'boxes/host-box'
ClusterBox = require 'boxes/cluster-box'

class ClobberBox

  constructor: () ->
    shadowIcons = new pxicons.ShadowIcons()

  build : ($el, kind, data)->
    switch kind
      when ClobberBox.HOST_BOX    then @box = new HostBox $el, data
      when ClobberBox.CLUSTER_BOX then @box = new ClusterBox $el, data

  updateLiveStats : (data)->
    @box.updateLiveStats data

  # ------------------------------------ Constants

  @CLUSTER_BOX   : 'cluster-box'
  @HOST_BOX      : 'host-box'
  @PLATFORM_BOX  : 'platform-box'
  @SERVICE_BOX   : 'service-box'

window.nanobox ||= {}
nanobox.ClobberBox = ClobberBox
