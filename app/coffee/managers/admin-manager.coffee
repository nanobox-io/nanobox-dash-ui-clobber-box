Manager = require 'managers/manager'
admin   = require 'jade/admin'

module.exports = class AdminManager extends Manager

  constructor : ($el) ->
    $node = $ admin( {} )
    $el.append $node
    castShadows @$node
    super()
