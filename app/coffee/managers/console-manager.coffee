Manager = require 'managers/manager'

module.exports = class ConsoleManager extends Manager

  constructor: ($el) ->
    super()
    app = new nanobox.Console $el
