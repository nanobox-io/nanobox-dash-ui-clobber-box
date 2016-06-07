module.exports = class PlatformComponent

  constructor: (@id, @kind) ->
    @isSplitable     = Math.random() > 0.5
    @state           = "active"
    @generations     = []
    @name            = @id
    @addGeneration()

  addGeneration : (state='active') ->
    @generations.push
      state : state,
      id    : "#{@id}.gen#{@generationCount++}"

  serialize : () ->
    id            : @id
    kind          : @kind
    name          : @name
    state         : @state
    isSplitable   : @isSplitable
    generations   : @generations
    serviceType   : @type
    scalesHoriz   : @scalesHorizontally
    serverSpecsId : @serverSpecsId
