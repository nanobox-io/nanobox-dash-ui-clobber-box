Manager = require 'managers/manager'
admin   = require 'jade/admin'

module.exports = class AdminManager extends Manager

  constructor : ($el, adminUrl) ->
    $node = $ admin( {adminUrl:adminUrl} )
    $el.append $node
    castShadows @$node
    super()
