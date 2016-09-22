Box         = require 'boxes/box'
BoxNav      = require 'box-nav'
clusterBox  = require 'jade/cluster-box'
NameMachine = require 'misc/name-machine'

module.exports = class ClusterBox extends Box

  constructor: ($el, @data) ->
    @kind = "cluster"

    # There's a chance this was already added by the host, but if not, add it
    if !@data._serviceType?
      @data._serviceType = NameMachine.findName @data.serviceType

    @update @data

    $node = $ clusterBox( @data )
    $el.append $node
    super $node, @data

    @buildNav $node
    PubSub.publish 'REGISTER.CLUSTER', @

    @buildStats $(".stats-strip", $node)

  buildNav : ($node) ->
    navItems = [
      # {txt:"App Component", icon:'app-component', event:'SHOW.APP_COMPONENTS'}
      # {txt:"Instance Health", icon:'instance-health', event:'SHOW.INSTANCES'}
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'  }
      {txt:"Admin", icon:'admin', event:'SHOW.ADMIN'  }
      {txt:"Scale", icon:'scale', event:'SHOW.SCALE'}
      {txt:"Hosts", icon:'instance-health', event:'SHOW.HOST-INTANCES'}
      {txt:"Move",    icon:'split',   event:'SHOW.SPLIT'  }
      # {txt:"Stats", icon:'stats', event:'SHOW.STATS'}
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @uri

  getServerSpecIds : () ->
    ids = {}
    # If horizontal cluster, all members will be at the same scale, grab
    # the id from the first member in the arry
    if @data.category != "data"
      ids.primary = @data.members[0].serverSpecsId
    # If it's a data cluster, grab the scale from each member
    else
      for member in @data.members
        ids[member.role] = member.serverSpecsId

    return ids

  getState : () -> @data.generationState

  addMember    : (memberData) ->
    if @subState == 'host-instances'
      @subManager.addMember memberData

  removeMember : (memberId) ->
    if @subState == 'host-instances'
      @subManager.removeMember memberId

  update : (@data) -> @totalMembers = @data.members.length

  destroy : () ->
    PubSub.publish 'UNREGISTER.CLUSTER', @
    super()
