Manager = require 'managers/manager'

module.exports = class HostInstanceManager extends Manager

  constructor: (@$el, data) ->
    @hosts = []
    @createInstances data
    super()

  createInstances : (data) ->
    for member in data.members
      host = new nanobox.ClobberBox()
      host.build @$el, nanobox.ClobberBox.HOST_INSTANCE, {memberData: member, componentData:data, id:member.hostId}
      @hosts.push host

  destroy : () ->
    for host in @hosts
      host.box.off()
      host.destroy()
