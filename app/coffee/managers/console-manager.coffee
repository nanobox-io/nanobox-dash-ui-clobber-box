Manager = require 'managers/manager'

module.exports = class ConsoleManager extends Manager

  constructor: ($el, kind, data, isTunnel) ->
    super()

    console.log "#{kind} : "
    console.log data
    consoleParams = @getParams kind, data, isTunnel

    # Host Params
    hostParams =
      id                : 'do.1'
      kind              : 'host'

    # Component Params
    componentParams =
      id                : 'web.1'
      kind              : 'component'

    # Data Params
    dataParams =
      id                : 'data.1'
      kind              : 'component'
      serviceIcon       : 'mongo'
      tunnelCredentials :
        DB_HOST : '127.0.0.1'
        DB_PORT : '4000'
        DB_USER : 'nanobox'
        DB_PASS : 'yYBavcCUWuz'
        DB_NAME : 'data.db'

    # Host Instance Params
    hostInstance =
      id                : 'do.1'
      dockerId          : 'web.1'
      kind              : 'host-instance'



    app = new nanobox.Console $el, consoleParams

  getParams : (kind, data, isTunnel) ->
    blob =
      id                : data.name
      kind              : kind

    if kind == 'component'
      blob.id = data.uid

    if kind == 'host-instance'
      blob.id       = data.id
      blob.dockerId = "#{data.componentData.uid}.#{data.memberData.id}"

    if isTunnel
      serviceIcon       : 'mongo'
      tunnelCredentials :
        DB_HOST : '127.0.0.1'
        DB_PORT : '4000'
        DB_USER : 'nanobox'
        DB_PASS : 'yYBavcCUWuz'
        DB_NAME : 'data.db'

    blob
