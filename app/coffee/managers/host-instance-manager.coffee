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
    console.log "REMOVING MEMBER: #{memberId}"
    console.log
    for host in @hosts
      console.log host
      console.log host.id
      if host.id == memberId
        console.log 'hmm, should be removing..'
        host.box.off()
        host.destroy()

  destroy : () ->
    for host in @hosts
      host.box.off()
      host.destroy()
