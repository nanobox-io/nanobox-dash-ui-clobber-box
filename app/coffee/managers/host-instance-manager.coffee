Manager = require 'managers/manager'

module.exports = class HostInstanceManager extends Manager

  constructor: (@$el, @clusterData) ->
    @hosts = []
    @createInstances @clusterData
    super()

  createInstances : () ->
    for member in @clusterData.members
      @addMember  member

  addMember : (member) ->
    host = new nanobox.ClobberBox()
    host.build @$el, nanobox.ClobberBox.HOST_INSTANCE, {memberData: member, componentData:@clusterData, id:member.hostId}
    @hosts.push host

  removeMember : (memberId) ->
    for host in @hosts
      if host.id == memberId
        host.box.off()
        host.destroy()

  destroy : () ->
    for host in @hosts
      host.box.off()
      host.destroy()
