boxNav = require 'jade/box-nav'

module.exports = class BoxNav

  constructor: ($el, navItems, @id) ->
    $node = $ boxNav( {nav:navItems} )
    $el.append $node
    $(".nav-item",$node).on "click", (e)=>
      @onClick e.currentTarget.getAttribute("data-event")

  # ------------------------------------  Events

  onClick : (event) ->
    PubSub.publish event, @id
