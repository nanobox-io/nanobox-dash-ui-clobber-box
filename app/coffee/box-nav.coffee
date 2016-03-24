boxNav = require 'jade/box-nav'

module.exports = class BoxNav

  constructor: ($el, navItems) ->
    $node = $ boxNav( {nav:navItems} )
    $el.append $node
