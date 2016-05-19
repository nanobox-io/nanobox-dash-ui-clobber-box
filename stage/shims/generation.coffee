module.exports = class Generation

  @genericGenerationCount : 0

  constructor: (parentId, state='active') ->
    @state = state
    @id    = "#{parentId}.gen#{Generation.genericGenerationCount++}"

  serialize:
    state : @state
    id    : @id
