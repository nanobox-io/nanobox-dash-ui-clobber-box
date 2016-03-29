module.exports = class ClobberBoxDataShim

  constructor : () ->
    @hostCount         = 0
    @appComponentCount = 0
    @dbCount           = 0
    @clusterCount      = 0

  # For Brevity when testing, this method sends a given clobberbox instance a
  # dummy set of live stats, and a dummy historical stat of each metric type
  sendDummyStats : (clobberBox) ->
    clobberBox.stats.updateLiveStats statsDataSimultor.generateFakeLiveStats()
    clobberBox.stats.updateHistoricStat "disk", statsDataSimultor.generateFakeHistoricalStats()
    clobberBox.stats.updateHistoricStat "ram", statsDataSimultor.generateFakeHistoricalStats()
    clobberBox.stats.updateHistoricStat "cpu", statsDataSimultor.generateFakeHistoricalStats()
    clobberBox.stats.updateHistoricStat "swap", statsDataSimultor.generateFakeHistoricalStats()

  # Generate data describing a "host" in the format rails sends us such data
  getHost : () ->
    {
      id   : "host.#{++@hostCount}"
      name : "ec2.#{@hostCount}"
      appComponents : [ @getAppComponent(),@getAppComponent(),@getAppComponent(),@getAppComponent(), @getAppComponent('db', 'mongo-db') ]
      platformComponents : [
        @getPlatformComponent "lb", "Load Balancer", "load-balancer"
        @getPlatformComponent "lg", "Logger", "logger"
        @getPlatformComponent "hm", "Health Monitor", "health-monitor"
        @getPlatformComponent "mr", "Message Router", "message-router"
        @getPlatformComponent "gs", "Blob Storage", "glob-storage"
      ]
    }

  # Generate data describing a "cluster" in the format rails sends us such data
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

  # Generate data describing an "App Component" in the format rails sends us such data
  getAppComponent : (kind='web', type="ruby") ->
    {
      id          : "#{kind}.#{@appComponentCount}"
      name        : "#{kind} #{@appComponentCount}"
      serviceType : type
    }

  # Generate data describing a "Platform Component" in the format rails sends us such data
  getPlatformComponent : (id, name, serviceType) ->
    {
      isPlatformComponent : true
      id                  : id,
      name                : name,
      serviceType         : serviceType
    }
