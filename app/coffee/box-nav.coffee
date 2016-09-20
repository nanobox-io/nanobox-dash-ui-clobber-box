boxNav = require 'jade/box-nav'

module.exports = class BoxNav

  constructor: ($el, navItems, @uri) ->
    @$node = $ boxNav( {nav:navItems} )
    $el.append @$node
    castShadows @$node

    $(".nav-item",@$node).on "click", (e)=>
      @onClick e.currentTarget.getAttribute("data-event"), e.currentTarget


  trigger : (id) ->
    $(".nav-#{id}", @$node).trigger "click"


  # ------------------------------------  Events

  onClick : (event, el) ->
    PubSub.publish event, {uri: @uri, el:el}
