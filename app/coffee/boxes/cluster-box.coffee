Box         = require 'boxes/box'
BoxNav      = require 'box-nav'
clusterBox  = require 'jade/cluster-box'

module.exports = class ClusterBox extends Box

  constructor: ($el, data) ->
    data.clusterName  = @makeClusterName data.instances
    data.totalMembers = data.instances.length
    $node = $ clusterBox( data )
    $el.append $node

    @buildNav $node
    super $node, data
    @buildStats $(".stats", $node)

  buildNav : ($node) ->
    navItems = [
      {txt:"App Component", icon:'app-component'}
      {txt:"Instance Health", icon:'instance-health'}
      {txt:"Scale", icon:'scale'}
      {txt:"Stats", icon:'stats'}
    ]
    @nav = new BoxNav $node, navItems

  makeClusterName : (instances) -> "#{instances[0].hostName} - #{instances[instances.length-1].hostName}"
