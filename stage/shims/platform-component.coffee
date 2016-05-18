module.exports = class PlatformComponent

  constructor: (@id, @kind) ->
    @isSplitable = Math.random() > 0.5
    @state       = "active"

  serialize : () ->
    id          : @id
    kind        : @kind
    isSplitable : @isSplitable
    state       : @state
