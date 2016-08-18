Manager = require 'managers/manager'
admin   = require 'jade/admin'

module.exports = class AdminManager extends Manager

  constructor : ($el, @isHost, @actionUrl, @adminUrl) ->
    @build $el
    super()

  build : ($el) ->
    if @isHost
      actions = [
        {name:"reboot",  short:"Hard Poweroff and Poweron of Server"}
      ]
    else
      actions = [
        {name:"refresh", short:"Start & Stop<br/>Processes"}
        {name:"reboot",  short:"Start & Stop<br/>all Containers"}
        {name:"rebuild", short:"Kill & Replace<br/>all Containers"}
        {name:"update",  short:"Update to latest<br/>stable config"}
        {name:"manage",  short:"Connection Details,<br/>Deletion, etc."}
      ]

    $node = $ admin( {actions:actions} )
    $el.append $node
    castShadows $node

    $('.action', $node).on 'click', (e)=>
      @runAction $(e.currentTarget).attr 'data-action'

  runAction : (action) ->
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
