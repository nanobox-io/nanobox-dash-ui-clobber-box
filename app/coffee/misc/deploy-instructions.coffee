deployInstructions = require 'jade/deploy-instructions'

module.exports = class DeployInstructions

  constructor: ($el, appName) ->
    $node = $ deployInstructions( {} )
    $el.append $node
    castShadows $node
