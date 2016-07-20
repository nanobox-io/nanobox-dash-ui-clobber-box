AppComponent      = require './app-component'
Host              = require './host'

module.exports = class HorizCluster

  @clusterCount : 0

  constructor: (totalMembers=4, totalGenerations=1) ->
    @id            = "cluster.#{HorizCluster.clusterCount}"
    @name          = "Main App"
    @state         = "active"
    @serviceType   = "python"
    @scalesHoriz   = true
    @scalesRedund  = false
    @generations   = []
    @adminPath     = "/some/path/to/admin"

    for i in [1..totalGenerations]
      generation =
        id        : "web.main.gen#{i}"
        state     : "active" # Not used ?
        status    : "online" # Not used ?
        instances : []
      for i in [1..totalMembers]
        generation.instances.push
          id            : i
          hostId        : "do.#{i}"
          hostName      : "do.#{i}"
          state         : "active"
          status        : "online"
          role          : "default" # default, primary, secondary, arbiter
          serverSpecsId : "b2"
      @generations.push generation

    #
    # @appComponent  = new AppComponent() # delete
    # @instances     = []                 # delete
    # for i in [1..totalMembers]
      # @instances.push {id:"web.#{AppComponent.appComponentCount}.#{i}", hostId:"ec2.#{++Host.hostCount}", hostName:"ec2.#{Host.hostCount}"}

  serialize : () ->
    id            : @id
    state         : @state
    name          : @name
    scalesHoriz   : @scalesHoriz
    scalesRedund  : @scalesRedund
    generations   : @generations
    serviceType   : @serviceType
    adminPath     : @adminPath
    # appComponents : [@appComponent.serialize()]
    # instances     : @instances


x =  {
      "id": "web.main",
      "name": "jade-jug",
      "state": "active",
      "serviceType": "default",
      "scalesHoriz": true,
      "scalesRedund": false,
      "generations": [
        {
          "id": "web.main.gen2",
          "state": "active",
          "status": "online",
          "instances": [
            {
              "id": 1,
              "hostId": "do.2",
              "hostName": "do.2",
              "state": "active",
              "status": "online",
              "role": "default",
              "serverSpecsId": "512mb"
            }
          ]
        }
      ]
    }
