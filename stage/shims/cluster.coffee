AppComponent      = require './app-component'
Host              = require './host'

module.exports = class Cluster

  @clusterCount : 0

  constructor: (totalMembers=4) ->
    @serverSpecsId = "b4"
    @id            = "cluster.#{Cluster.clusterCount}"
    @name          = "web #{++AppComponent.appComponentCount}"
    @appComponent  = new AppComponent()
    @instances     = []
    for i in [1..totalMembers]
      @instances.push {id:"web.#{AppComponent.appComponentCount}.#{i}", hostId:"ec2.#{++Host.hostCount}", hostName:"ec2.#{Host.hostCount}"}

  serialize : () ->
    serverSpecsId : @serverSpecsId
    id            : @id
    name          : @name
    appComponents : [@appComponent.serialize()]
    serviceType   : @appComponent.type
    instances     : @instances
