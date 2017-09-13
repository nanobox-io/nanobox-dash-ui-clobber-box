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

  setState              : (state) -> @box.setState state
  dontAnimateTransition : ()      -> @box.removeSubContentAnimations()
  destroy               : ()      -> @box.destroy()

  # This is used to create one unified data object out of a cluster's data & each cluster instance data
  @joinClusterData : (cluster, generation)->
    serviceId         : cluster.id
    serviceState      : cluster.state
    name              : cluster.name
    category          : cluster.category
    clusterable       : cluster.clusterable
    isSplitable       : cluster.isSplitable
    serviceType       : cluster.serviceType
    adminPath         : cluster.adminPath
    actionPath        : cluster.actionPath
    uid               : cluster.uid
    clusterShapeCanBe : cluster.clusterShapeCanBe
    topology          : cluster.topology
    tunnelCredentials : cluster.tunnelCredentials
    running           : cluster.running
    state             : cluster.state
    status            : cluster.status
    id                : generation.id
    generationState   : generation.state
    generationStatus  : generation.status
    members           : generation.instances
    totalMembers      : generation.instances.length
    clusterShapeIs    : generation.clusterShapeIs


  # ------------------------------------ Constants

  @CLUSTER                  : 'cluster'
  @HOST                     : 'host'
  @PLATFORM_COMPONENT       : 'platform-component'
  @APP_COMPONENT_GENERATION : 'app-component-generation'
  @HOST_INSTANCE            : 'host-instance'

window.nanobox ||= {}
nanobox.ClobberBox = ClobberBox
