module.exports = class ClobberBoxDataShim

  constructor : () ->
    @hostCount         = 0
    @appComponentCount = 0
    @dbCount           = 0
    @clusterCount      = 0

  getHost : () ->
    {
      id   : "ec2.#{++@hostCount}"
      name : "ec2.#{@hostCount}"
      appComponents : [ @getAppComponent(), @getAppComponent('db', 'mongo-db') ]
      platformComponents : [
        @getPlatformComponent "lb", "Load Balancer", "load-balancer"
        @getPlatformComponent "lg", "Logger", "logger"
        @getPlatformComponent "hm", "Health Monitor", "health-monitor"
        @getPlatformComponent "mr", "Message Router", "message-router"
        @getPlatformComponent "gs", "Blob Storage", "glob-storage"
      ]
    }

  getCluster : (totalMembers=4) ->
    data = {
      id:"cluster.#{++@clusterCount}"
      name:"web #{++@appComponentCount}"
      serviceType:"ruby"
      instances:[]
    }
    for i in [1..totalMembers]
      data.instances.push {id:"web.#{@appComponentCount}.#{i}", hostId:"ec2.#{++@hostCount}", hostName:"ec2.#{@hostCount}"}
    data

  getAppComponent : (kind='web', type="ruby") ->
    {
      id          : "#{kind}.#{@appComponentCount}"
      name        : "#{kind} #{@appComponentCount}"
      serviceType : type
    }

  getPlatformComponent : (id, name, serviceType) ->
    {
      isPlatformComponent : true
      id                  : id,
      name                : name,
      serviceType         : serviceType
    }
