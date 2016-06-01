Box         = require 'boxes/box'
BoxNav      = require 'box-nav'
clusterBox  = require 'jade/cluster-box'

module.exports = class ClusterBox extends Box

  constructor: ($el, @data) ->
    # console.log @data
    @kind = "cluster"
    @data.clusterName = @makeClusterName @data.members
    @totalMembers = @data.totalMembers
    $node = $ clusterBox( @data )
    $el.append $node

    @buildNav $node
    super $node, @data
    PubSub.publish 'REGISTER.CLUSTER', @

    @buildStats $(".stats-strip", $node)

  buildNav : ($node) ->
    navItems = [
      # {txt:"App Component", icon:'app-component', event:'SHOW.APP_COMPONENTS'}
      # {txt:"Instance Health", icon:'instance-health', event:'SHOW.INSTANCES'}
      {txt:"Admin", icon:'admin', event:'SHOW.ADMIN'  }
      {txt:"Scale", icon:'scale', event:'SHOW.SCALE'}
      {txt:"Hosts", icon:'scale', event:'SHOW.HOST-INTANCES'}
      # {txt:"Stats", icon:'stats', event:'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @data.id

  makeClusterName : (instances) -> "#{instances[0].hostName} - #{instances[instances.length-1].hostName}"

  destroy : () ->
    PubSub.publish 'UNREGISTER.CLUSTER', @
    super()
