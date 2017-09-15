module.exports = class AppComponent

  @appComponentCount : 0

  constructor : (kind='web', @type="ruby", scalesHorizontally=true, scalesRedund=false, hostId) ->
    @generationCount   = 1
    @state             = 'active'
    @status            = 'online'
    @serverSpecsId     = "b3"
    @id                = "#{kind}.#{++AppComponent.appComponentCount}"
    @name              = "#{kind} #{AppComponent.appComponentCount}"
    @generations       = []
    @adminPath         = "/some/path/to/admin"
    @actionPath        = "/some/path/to/action"
    @category          = if scalesHorizontally then 'web' else 'data'
    @clusterable       = scalesRedund
    # new
    @clusterShapeIs    = ''
    @clusterShapeCanBe = clobbershim.getClusterPotential(scalesHorizontally)
    @topology          = 'bunkhouse'
    # ---
    @uri               = "#{hostId}/#{@id}"
    @addGeneration()

  addGeneration : (state='provisioning') ->
    obj =
      state : state
      status: 'online'
      id    : "#{@id}.gen#{@generationCount++}"
    if Math.random() > 0.5 then obj.state = 'active'
    @generations.push obj

  serialize : () ->
    data =
      generations       : @generations
      state             : @state
      status            : @status
      serverSpecsId     : @serverSpecsId
      id                : @id
      name              : @name
      uid               : @id
      serviceType       : @type
      adminPath         : @adminPath
      actionPath        : @actionPath
      category          : @category
      clusterable       : @clusterable
      uri               : @uri
      clusterShapeIs    : @clusterShapeIs
      clusterShapeCanBe : @clusterShapeCanBe
      topology          : @topology
    if @category == 'data'
      data.tunnelCredentials =
        DB_HOST : '127.0.0.1'
        DB_PORT : '4000'
        DB_USER : 'nanobox'
        DB_PASS : 'yYBavcCUWuz'
        DB_NAME : 'data.db'
    data
