Manager = require 'managers/manager'
admin   = require 'jade/admin'

module.exports = class AdminManager extends Manager

  constructor : ($el, @isHost, @data, @id) ->
    @build $el
    super()

  build : ($el) ->
    if @isHost
      klass = "host"
      actions = @getHostActions()
    else
      klass = ""
      actions = @getComponentActions()

    $node = $ admin( {actions:actions, klass:klass} )
    $el.append $node
    castShadows $node

    $('.action', $node).on 'click', (e)=> @runAction $(e.currentTarget)

  # ------------------------------------ Events

  runAction : ($btn) ->
    $btn.addClass 'running'
    data =
      action     : $btn.attr('data-action')
      onComplete : ()-> $btn.removeClass 'running'

    if @isHost
      data.hostId = @data.id
      PubSub.publish 'HOST.RUN-ACTION', data
    else
      data.componentId = @id
      PubSub.publish 'COMPONENT.RUN-ACTION', data

  # ------------------------------------ Helpers

  getHostActions : () ->
    actions = [
      {name:"reboot",  short:"Hard Power-Off / Power-On of Server"}
    ]
    if @data.state == 'active' && @data.running?
      if @data.running
        actions.push {name:"stop",  short:"Stop this<br/>server"}
      else
        actions.push {name:"start",  short:"Start this<br/>server"}

    if @data.appComponents.length == 0 && @data.platformServices.length == 0
      actions.push {name:"delete",  short:"Delete This Host"}
    else
      actions.push {name:"delete",  short:"To Delete, remove all components", klass:"disabled"}

    @markDisallowedActions actions, nanobox.clobberConfig.hostActions

  getComponentActions : () ->
    actions = [
      {name:"refresh", short:"Stop & Restart<br/>Processes"}
      {name:"reboot",  short:"Reboot<br/>all Containers"}
      {name:"update", short:"Rebuild Containers<br/>w/ Latest Stable Images", }
      {name:"manage",  short:"Connection Details,<br/>Deletion, etc."}
    ]

    # Allow starting and stopping if state is active
    if @data.state == "active" && @data.running?
      if @data.running
        actions.push {name:"stop",  short:"Stop this<br/>container"}
      else
        actions.push {name:"start",  short:"Start this<br/>container"}

    return @markDisallowedActions actions, nanobox.clobberConfig.componentActions

  # Loop through all the actions and see if the user has permission
  # to do this action. If not, add the disabled class to that obj
  markDisallowedActions : (actions, permissions) ->
    for action in actions
      # find the permission object with a name that matches this action. ex obj.action == 'reboot'
      actionMatch = permissions.filter (obj) -> obj.action == action.name
      # If permission is false, add disabled class
      if !actionMatch[0]?.permission
        action.klass = 'disabled'

    return actions
