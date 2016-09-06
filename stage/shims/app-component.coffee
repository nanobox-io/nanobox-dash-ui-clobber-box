module.exports = class AppComponent

  @appComponentCount : 0

  constructor : (kind='web', @type="ruby", scalesHorizontally=true, scalesRedund=false) ->
    @generationCount = 1
    @state           = 'active'
    @serverSpecsId   = "b3"
    @id              = "#{kind}.#{++AppComponent.appComponentCount}"
    @name            = "#{kind} #{AppComponent.appComponentCount}"
    @generations     = []
    @adminPath       = "/some/path/to/admin"
    @actionPath      = "/some/path/to/action"
    @category        = if scalesHorizontally? then 'data' else 'data'
    @clusterable     = scalesRedund
    @addGeneration()

  addGeneration : (state='active') ->
    @generations.push
      state : state,
      id    : "#{@id}.gen#{@generationCount++}"

  serialize : () ->
    generations   : @generations
    state         : @state
    serverSpecsId : @serverSpecsId
    id            : @id
    name          : @name
    serviceType   : @type
    adminPath     : @adminPath
    actionPath    : @actionPath
    category      : @category
    clusterable   : @clusterable
