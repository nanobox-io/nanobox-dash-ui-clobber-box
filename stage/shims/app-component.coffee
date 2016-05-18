module.exports = class AppComponent

  @appComponentCount : 0

  constructor : (kind='web', @type="ruby", @scalesHorizontally=true) ->
    @generationCount = 1
    @state           = 'active'
    @serverSpecsId   = "b3"
    @id              = "#{kind}.#{++AppComponent.appComponentCount}"
    @name            = "#{kind} #{AppComponent.appComponentCount}"
    @generations     = [ @getGeneration() ]

  getGeneration : (state='active') ->
    state : state,
    id    : "#{@id}.gen#{@generationCount++}"

  serialize : () ->
    generations   : @generations
    state         : @state
    serverSpecsId : @serverSpecsId
    id            : @id
    name          : @name
    serviceType   : @type
    scalesHoriz   : @scalesHorizontally
