module.exports = class ClobberBoxDataShim

  constructor : () ->
    @hostCount              = 0
    @appComponentCount      = 0
    @dbCount                = 0
    @clusterCount           = 0
    @genericGenerationCount = 0

  # Generate data describing a "host" in the format rails sends us such data
  getHost : (showBunchesOfComponents=true) ->
    @hostCount++
    data = {
      state              : "active"
      id                 : "host.#{@hostCount}"
      name               : "ec2.#{@hostCount}"
      serverSpecsId      : "b1"
      platformComponents : [
        {id: "lb", kind:"load-balancer"}
        {id: "lg", kind:"logger"}
        {id: "hm", kind:"health-monitor"}
        {id: "mr", kind:"router"}
        {id: "gs", kind:"glob-storage"}
      ]
    }
    if !showBunchesOfComponents
      data.appComponents = [
        @getAppComponent(),
        @getAppComponent('db', 'mongo-db', false)
      ]
    else
      data.appComponents = [
        @getAppComponent(),
        @getAppComponent('db', 'mongo-db', false)
        @getAppComponent('web', 'node', true)
        @getAppComponent('web', 'memcached', true)
        @getAppComponent('web', 'python', true)
        @getAppComponent('web', 'storage', true)
        @getAppComponent('web', 'java', true)
        @getAppComponent('web', 'php', true)
        @getAppComponent('db', 'couch-db', false)
        @getAppComponent('db', 'maria-db', false)
        @getAppComponent('db', 'postgres-db', false)
        @getAppComponent('db', 'redis', false)
        @getAppComponent('db', 'percona-db', false)
        @getAppComponent('web', 'default', true)
        @getAppComponent('db', 'default-db', false)
      ]
    return data

  # Generate data describing a "cluster" in the format rails sends us such data
  getCluster : (totalMembers=4) ->
    @clusterCount++

    data = {
      serverSpecsId : "b4"
      id            : "cluster.#{@clusterCount}"
      name          : "web #{++@appComponentCount}"
      appComponents : [ @getAppComponent() ]
      serviceType   : "ruby"
      instances     : []
    }
    for i in [1..totalMembers]
      data.instances.push {id:"web.#{@appComponentCount}.#{i}", hostId:"ec2.#{++@hostCount}", hostName:"ec2.#{@hostCount}"}
    data

  # Generate data describing an "App Component" in the format rails sends us such data
  getAppComponent : (kind='web', type="ruby", scalesHorizontally=true) ->
    {
      generations   : [ @getGeneration "#{kind}.#{@appComponentCount}" ]
      state         : 'active'
      serverSpecsId : "b3"
      id            : "#{kind}.#{@appComponentCount}"
      name          : "#{kind} #{@appComponentCount}"
      serviceType   : type
      scalesHoriz   : scalesHorizontally
    }

  # Generate data describing a "Platform Component" in the format rails sends us such data
  getPlatformComponent : (id, name, serviceType) ->
    {
      state               : "active"
      serverSpecsId       : "b2"
      isPlatformComponent : true
      id                  : id,
      name                : name,
      serviceType         : serviceType
    }

  getGeneration : (parentId, state='active') ->
    {
      state : state,
      id    : "#{parentId}.gen#{@genericGenerationCount++}"
    }
