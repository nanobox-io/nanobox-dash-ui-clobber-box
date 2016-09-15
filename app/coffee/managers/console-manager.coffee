Manager        = require 'managers/manager'
NameMachine    = require 'misc/name-machine'

module.exports = class ConsoleManager extends Manager

  constructor: ($el, kind, data, isTunnel) ->
    super()

    consoleParams = @getParams kind, data, isTunnel
    app           = new nanobox.Console $el, consoleParams

  getParams : (kind, data, isTunnel) ->
    console.log data

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
      blob.tunnelCredentials =
        DB_HOST : '127.0.0.1'
        DB_PORT : '4000'
        DB_USER : 'nanobox'
        DB_PASS : 'yYBavcCUWuz'
        DB_NAME : 'data.db'

    blob
