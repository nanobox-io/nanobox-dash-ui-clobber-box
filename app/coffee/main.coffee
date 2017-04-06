HostBox                = require 'boxes/host-box'
HostInstanceBox        = require 'boxes/host-instance-box'
ClusterBox             = require 'boxes/cluster-box'
ComponentGenerationBox = require 'boxes/component-generation-box'
PlatformComponent      = require 'boxes/platform-component-box'
WindowScroller         = require 'misc/window-scroller'

class ClobberBox

  constructor: () ->
    new WindowScroller()
    # shadowIcons = new pxicons.ShadowIcons()

  build : ($el, kind, @data)->
    switch kind
      when ClobberBox.HOST                     then @box = new HostBox $el, @data
      when ClobberBox.CLUSTER                  then @box = new ClusterBox $el, @data
      when ClobberBox.APP_COMPONENT_GENERATION then @box = new ComponentGenerationBox $el, @data
      when ClobberBox.PLATFORM_COMPONENT       then @box = new PlatformComponent $el, @data
      when ClobberBox.HOST_INSTANCE            then @box = new HostInstanceBox $el, @data
    @stats = @box.stats

  setState : (state) -> @box.setState state
  dontAnimateTransition : ()-> @box.removeSubContentAnimations()
  destroy : () -> @box.destroy()

  # This is used to create one unified data object out of clusters & instances
  @joinClusterData : (cluster, generation)->
    serviceId         : cluster.id
    serviceState      : cluster.state
    name              : cluster.name
    serviceType       : cluster.serviceType
    scalesHoriz       : cluster.scalesHoriz
    scalesRedund      : cluster.scalesRedund
    category          : cluster.category
    clusterable       : cluster.clusterable
    adminPath         : cluster.adminPath
    actionPath        : cluster.adminPath
    uid               : cluster.uid
    clusterShapeIs    : cluster.clusterShapeIs
    clusterShapeCanBe : cluster.clusterShapeCanBe
    topology          : cluster.topology
    tunnelCredentials : cluster.tunnelCredentials
    id                : generation.id
    generationState   : generation.state
    generationStatus  : generation.status
    members           : generation.instances
    totalMembers      : generation.instances.length

  # ------------------------------------ Constants

  @CLUSTER                  : 'cluster'
  @HOST                     : 'host'
  @PLATFORM_COMPONENT       : 'platform-component'
  @APP_COMPONENT_GENERATION : 'app-component-generation'
  @HOST_INSTANCE            : 'host-instance'

window.nanobox ||= {}
nanobox.ClobberBox = ClobberBox
