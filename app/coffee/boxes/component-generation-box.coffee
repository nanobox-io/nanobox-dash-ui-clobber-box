Box          = require 'boxes/box'
BoxNav       = require 'box-nav'
componentBox = require 'jade/component-box'
NameMachine  = require 'misc/name-machine'

module.exports = class ComponentGenerationBox extends Box

  constructor: ($el, data) ->
    @hostAddress = data.hostAddress
    @kind = "component"
    @componentData  = data.componentData

    # There's a chance this was already added by the host, but if not, add it
    if !@componentData._serviceType?
      @componentData._serviceType = NameMachine.findName @componentData.serviceType

    @generationData = data.generationData
    @data           = @componentData
    compiledData    = { id: @generationData.id, state: @generationData.state, adminPath:@data.adminPath, actionPath:@data.actionPath }

    $node = $ componentBox( @componentData )
    $el.append $node

    super $node, compiledData
    @buildAppComponentNav $node
    PubSub.publish 'REGISTER.APP_COMPONENT', @
    @buildStats $(".stats-strip", $node)

  buildAppComponentNav : ($node) ->
    navItems = [
      {txt:"Console",  icon:'console', event:'SHOW.CONSOLE' }
      {txt:"Move",     icon:'split',   event:'SHOW.SPLIT'   }
      {txt:"Stats",    icon:'stats',   event:'SHOW.STATS'   }
    ]

    if @componentData.category == 'data'
      navItems.unshift {txt:"Connect", icon:'tunnel', event:'SHOW.TUNNEL' }

    navItems.unshift {txt:"Admin",    icon:'admin',   event:'SHOW.ADMIN' }

    @nav = new BoxNav $('.nav-holder', $node), navItems, @uri

  destroy : () ->
    PubSub.publish 'UNREGISTER.APP_COMPONENT', @
    super()

  getServiceCommonName : (serviceName) ->
    switch serviceName
      when 'ruby'        then 'Ruby'
      when 'mongo'       then 'Mongo'
      when 'node'        then 'Node JS'
      when 'memcached'   then 'MemcacheD'
      when 'python'      then 'Python'
      when 'storage'     then 'Storage'
      when 'java'        then 'Java'
      when 'php'         then 'PHP'
      when 'couch'       then 'Couch DB'
      when 'maria'       then 'Maria DB'
      when 'postgres'    then 'Postgres DB'
      when 'redis'       then 'Redis'
      when 'percona'     then 'Percona DB'
      when 'default'     then ' '
      when 'default'     then ' '
      else                    ' '

  getAddress  : ()-> "#{@hostAddress}-#{@data.id}"
  getURI      : ()-> "#{@componentData.uri}/#{@generationData.id}"
