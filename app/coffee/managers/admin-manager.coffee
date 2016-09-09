Manager = require 'managers/manager'
admin   = require 'jade/admin'

module.exports = class AdminManager extends Manager

  constructor : ($el, @isHost, @actionUrl, @adminUrl, @data) ->
    @build $el
    super()

  build : ($el) ->
    if @isHost
      klass = "host"
      actions = [
        {name:"reboot",  short:"Hard Power-Off & Power-On of Server"}
      ]
      if @data.appComponents.length == 0 && @data.platformComponents.length == 0
        actions.push {name:"delete",  short:"Delete This Host"}
      else
        actions.push {name:"delete",  short:"To Delete, remove all components", klass:"disabled"}

    else
      klass = ""
      actions = [
        {name:"refresh", short:"Stop & Restart<br/>Processes"}
        {name:"reboot",  short:"Reboot<br/>all Hosts"}
        {name:"rebuild", short:"Rebuild & Replace<br/>all Hosts"}
        {name:"update",  short:"Update to Latest<br/>Stable Config"}
        {name:"manage",  short:"Connection Details,<br/>Deletion, etc."}
      ]

    $node = $ admin( {actions:actions, klass:klass} )
    $el.append $node
    castShadows $node

    $('.action', $node).on 'click', (e)=>
      @runAction $(e.currentTarget).attr 'data-action'

  runAction : (action) ->
    if action == "update"
      action = "update_service"

    # When delete, actually use the DELETE method and no action
    if action == 'delete'
      method = 'DELETE'
      action = ''
    else
      method = 'PATCH'

    # If this is the manager action:
    if action == "manage"
      window.location = @adminUrl
    # Else this is an action like reboot, refresh, etc:
    else
      $.ajax
        url     : "#{@actionUrl}/#{action}"
        type    : method
        success : (results)->
          console.log "#{action} results:"
          console.log "#{results}"
