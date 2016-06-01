Box          = require 'boxes/box'
BoxNav       = require 'box-nav'
componentBox = require 'jade/component-box'

module.exports = class ComponentGenerationBox extends Box

  constructor: ($el, data) ->
    @kind = "component"
    @componentData  = data.componentData
    @componentData.kind = @getServiceCommonName(data.componentData.serviceType)
    @generationData = data.generationData
    @data           = @componentData
    compiledData    = { id: @generationData.id, state: @generationData.state }

    $node = $ componentBox( @componentData )
    $el.append $node

    @buildAppComponentNav $node
    PubSub.publish 'REGISTER.APP_COMPONENT', @

    super $node, compiledData
    @buildStats $(".stats-strip", $node)

  buildAppComponentNav : ($node) ->
    navItems = [
      {txt:"Console", icon:'console', event:'SHOW.CONSOLE'}
      {txt:"Move",    icon:'split',   event:'SHOW.SPLIT'  }
      {txt:"Admin",   icon:'admin',   event:'SHOW.ADMIN'  }
      {txt:"Stats",   icon:'stats',   event:'SHOW.STATS'  }
    ]
    @nav = new BoxNav $('.nav-holder', $node), navItems, @generationData.id


  destroy : () ->
    PubSub.publish 'UNREGISTER.APP_COMPONENT', @
    super()

  getServiceCommonName : (serviceName) ->
    switch serviceName
      when 'ruby'        then 'Ruby'
      when 'mongo-db'    then 'Mongo'
      when 'node'        then 'Node JS'
      when 'memcached'   then 'MemcacheD'
      when 'python'      then 'Python'
      when 'storage'     then 'Storage'
      when 'java'        then 'Java'
      when 'php'         then 'PHP'
      when 'couch-db'    then 'Couch DB'
      when 'maria-db'    then 'Maria DB'
      when 'postgres-db' then 'Postgres DB'
      when 'redis'       then 'Redis'
      when 'percona-db'  then 'Percona DB'
      when 'default'     then ' '
      when 'default-db'  then ' '
      else                    ' '
