Host              = require './host'

module.exports = class DataCluster

  @clusterCount : 0

  constructor: () ->
    totalGenerations = 1

    @id                = "cluster.#{DataCluster.clusterCount}"
    @name              = "Customers DB"
    @state             = "active"
    @serviceType       = "mysql-db"
    @category          = "data"
    @clusterable       = true
    @adminPath         = "/some/path/to/admin"
    @uri               = @id
    @generations       = []
    @clusterShapeIs    = 'data-single'
    @clusterShapeCanBe = clobbershim.getClusterPotential(false)
    @topology          = 'cluster'

    for i in [1..totalGenerations]
      generation =
        id        : "db.main.gen#{i}"
        state     : "active" # Not used ?
        status    : "online" # Not used ?
        instances : []

      roles = ['primary', 'secondary', 'arbiter']

      for role, i in roles
        generation.instances.push
          id            : i
          hostId        : "do.#{i}"
          hostName      : "do.#{i}"
          state         : "active"
          status        : "online"
          role          : role
          serverSpecsId : "d16"
      @generations.push generation

    #
    # @appComponent  = new AppComponent() # delete
    # @instances     = []                 # delete
    # for i in [1..totalMembers]
      # @instances.push {id:"web.#{AppComponent.appComponentCount}.#{i}", hostId:"ec2.#{++Host.hostCount}", hostName:"ec2.#{Host.hostCount}"}

  serialize : () ->
    id                : @id
    uid               : @id
    state             : @state
    name              : @name
    category          : @category
    clusterable       : @clusterable
    generations       : @generations
    serviceType       : @serviceType
    adminPath         : @adminPath
    uri               : @uri
    clusterShapeIs    : @clusterShapeIs
    clusterShapeCanBe : @clusterShapeCanBe
    topology          : @topology
    # instances     : @instances
