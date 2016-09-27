Manager        = require 'managers/manager'
NameMachine    = require 'misc/name-machine'

module.exports = class ConsoleManager extends Manager

  constructor: ($el, kind, data, isTunnel) ->
    super()

    consoleParams = @getParams kind, data, isTunnel
    app           = new nanobox.Console $el, consoleParams

  getParams : (kind, data, isTunnel) ->
    blob =
      id                : data.name
      kind              : kind

    if kind == 'component'
      blob.id = data.uid

    else if kind == 'host-instance'
      blob.id       = data.id
      blob.dockerId = "#{data.componentData.uid}.#{data.memberData.uid}"

    else if kind == 'cluster'
      blob.id = data.uid

    if isTunnel
      blob.serviceIcon = NameMachine.findName(data.serviceType).id

    blob
