Manager        = require 'managers/manager'
NameMachine    = require 'misc/name-machine'

# TODO : Add the app name or id to the tunnel command ex:
# `nanobox tunnel my-app-name-or-id data.db`

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

    else if kind == 'cluster'
      blob.id = data.uid

    else if kind == 'host-instance'
      blob.id = data.id
      if !isTunnel
        blob.dockerId = "#{data.componentData.uid}.#{data.memberData.uid}"

    if isTunnel
      if kind != 'host-instance'
        @addTunnelInfo blob, data.serviceType, data.tunnelCredentials
      else
        blob.kind = 'component'
        @addTunnelInfo blob, data.componentData.serviceType, data.componentData.tunnelCredentials

    blob

  addTunnelInfo : (blob, serviceType, creds) ->
    blob.serviceIcon = NameMachine.findName(serviceType).id

    if creds?
      blob.tunnelCredentials = creds
