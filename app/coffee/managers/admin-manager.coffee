Manager = require 'managers/manager'
admin   = require 'jade/admin'

module.exports = class AdminManager extends Manager

  constructor : ($el, @isHost, @actionUrl, @adminUrl) ->
    @build $el
    super()

  build : ($el) ->
    if @isHost
      actions = [
        {name:"reboot",  short:"Hard Power-Off & Power-On of Server"}
      ]
    else
      actions = [
        {name:"refresh", short:"Stop & Restart<br/>Processes"}
        {name:"reboot",  short:"Reboot<br/>all Hosts"}
        {name:"rebuild", short:"Rebuild & Replace<br/>all Hosts"}
        {name:"update",  short:"Update to Latest<br/>Stable Config"}
        {name:"manage",  short:"Connection Details,<br/>Deletion, etc."}
      ]

    $node = $ admin( {actions:actions} )
    $el.append $node
    castShadows $node

    $('.action', $node).on 'click', (e)=>
      @runAction $(e.currentTarget).attr 'data-action'

  runAction : (action) ->
    if action == "update"
      action = "update_service"

    # If this is the manager action:
    if action == "manage"
      window.location = @adminUrl

    # Else this is an action like reboot, refresh, etc:
    else
      $.ajax
        url     : "#{@actionUrl}/#{action}"
        type    : "PATCH"
        success : (results)->
          console.log "#{action} results:"
          console.log "#{results}"
