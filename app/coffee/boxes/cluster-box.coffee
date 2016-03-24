Box         = require 'boxes/box'
BoxNav      = require 'box-nav'
clusterBox  = require 'jade/cluster-box'

module.exports = class ClusterBox extends Box

  constructor: ($el, data) ->
    $node = $ clusterBox( {name:data.name, serviceName:data.serviceName, componentKind:data.componentKind, totalMembers:data.totalMembers} )
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
