module.exports = class AppComponent

  @appComponentCount : 0

  constructor : (kind='web', @type="ruby", scalesHorizontally=true, scalesRedund=false, hostId) ->
    @generationCount = 1
    @state           = 'active'
    @serverSpecsId   = "b3"
    @id              = "#{kind}.#{++AppComponent.appComponentCount}"
    @name            = "#{kind} #{AppComponent.appComponentCount}"
    @generations     = []
    @adminPath       = "/some/path/to/admin"
    @actionPath      = "/some/path/to/action"
    @category        = if scalesHorizontally then 'web' else 'data'
    @clusterable     = scalesRedund
    @uri             = "#{hostId}/#{@id}"
    @addGeneration()

  addGeneration : (state='provisioning') ->
    obj =
      state : state,
      id    : "#{@id}.gen#{@generationCount++}"
    if Math.random() > 0.5 then obj.state = 'active'
    @generations.push obj

  serialize : () ->
    generations   : @generations
    state         : @state
    serverSpecsId : @serverSpecsId
    id            : @id
    name          : @name
    uid           : @id
    serviceType   : @type
    adminPath     : @adminPath
    actionPath    : @actionPath
    category      : @category
    clusterable   : @clusterable
    uri           : @uri
