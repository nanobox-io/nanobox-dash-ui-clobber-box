AppComponent      = require './app-component'
PlatformComponent = require './platform-component'

module.exports = class Host

  @hostCount : 0

  constructor: (makeLotsOfComponents=false) ->
    @state          = "active"
    @id             = "host.#{++Host.hostCount}"
    @name           = "ec2.#{Host.hostCount}"
    @serverSpecsId  = "b1"
    @bunkhouseId    = "bunkhouse"
    @actionPath     = "/some/path/to/actions"
    @platformServices = [
      new PlatformComponent( "lb", "mesh")
      new PlatformComponent( "lg", "logger")
      new PlatformComponent( "hm", "monitor")
      new PlatformComponent( "mr", "pusher")
      new PlatformComponent( "gs", "warehouse")
    ]
    @appComponents  = []
    @createComponents makeLotsOfComponents

  createComponents : (makeLotsOfComponents) ->
    if !makeLotsOfComponents
      @addComponent('web', 'some-rubyengine', true, true)
      @addComponent('db', 'mongo12', false, true)
    else
      @addComponent()
      @addComponent('db',  'mongo-engine', false)
      @addComponent('web', 'node-engine', true)
      @addComponent('web', 'memcached-engine', true)
      @addComponent('web', 'python-engine', true)
      @addComponent('web', 'storage-engine', true)
      @addComponent('web', 'java-engine', true)
      @addComponent('web', 'php-engine', true)
      @addComponent('db',  'couch-engine', false)
      @addComponent('db',  'maria-engine', false)
      @addComponent('db',  'postgres-engine', false)
      @addComponent('db',  'redis-engine', false)
      @addComponent('db',  'percona-engine', false)
      @addComponent('web', 'somerandomdb', true)
      @addComponent('db',  'nothingwillmatch', false)

  addComponent : (kind, type, isHorizontallyScalable, isRedundScalable) ->
    @appComponents.push new AppComponent(kind, type, isHorizontallyScalable, isRedundScalable)

  serializeComponents : (components) ->
    ar = []
    for component in components
      ar.push component.serialize()
    ar

  serialize : () ->
    state              : @state
    id                 : @id
    name               : @name
    serverSpecsId      : @serverSpecsId
    bunkhouseId        : @bunkhouseId
    actionPath         : @actionPath
    platformServices   : @serializeComponents @platformServices
    appComponents      : @serializeComponents @appComponents
