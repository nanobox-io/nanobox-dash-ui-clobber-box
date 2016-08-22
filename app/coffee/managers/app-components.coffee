Manager         = require 'managers/manager'
noAppComponents = require 'jade/no-app-components'

module.exports = class AppComponents extends Manager

  constructor: (@$el, components, @resizeCb) ->
    super()
    @generations = []
    if components.length == 0
      @addNoComponentsPlaceholder()
      @resizeCb
    else
      for componentData in components
        @addComponent componentData

  addNoComponentsPlaceholder : () ->
    languages = [
      {icon : 'hex-ruby',        title:"Ruby",      guide:"http://nanobox-guides.gopagoda.io/ruby/"}
      {icon : 'hex-python',      title:"Python",    guide:"http://nanobox-guides.gopagoda.io/python/"}
      {icon : 'hex-node',        title:"NodeJs",    guide:"http://nanobox-guides.gopagoda.io/nodejs/"}
      {icon : 'hex-java',        title:"Java",      guide:"http://nanobox-guides.gopagoda.io/java/"}
      {icon : 'hex-php',         title:"PHP",       guide:"http://nanobox-guides.gopagoda.io/php/"}
      {icon : 'hex-mysql',       title:"MySQL",     guide:"http://nanobox-guides.gopagoda.io/mysql/"}
      {icon : 'hex-mongo',       title:"MongoDB",   guide:"http://nanobox-guides.gopagoda.io/mongodb/"}
      {icon : 'hex-percona',     title:"Percona",   guide:"http://nanobox-guides.gopagoda.io/percona/"}
      {icon : 'hex-redis',       title:"Redis",     guide:"http://nanobox-guides.gopagoda.io/redis/"}
      {icon : 'hex-memcached',   title:"Memcached", guide:"http://nanobox-guides.gopagoda.io/memcached/"}
      {icon : 'hex-postgres',    title:"Postgres",  guide:"http://nanobox-guides.gopagoda.io/postgres/"}
      {icon : 'hex-maria',       title:"MariaDB",   guide:"http://nanobox-guides.gopagoda.io/mariadb/"}
      {icon : 'hex-couch',       title:"CouchDB",   guide:"http://nanobox-guides.gopagoda.io/couchdb/"}
      # {icon:'hex-storage', title:"Storage", guide:"http://nanobox-guides.gopagoda.io/php/"}
    ]
    @$noComponents = $ noAppComponents( {languages:languages} )
    @$el.append @$noComponents
    castShadows @$noComponents

  clearNoComponentsHelper : () ->
    if @$noComponents?
      @$noComponents.remove()
      @$noComponents = null


  addComponent : (componentData) ->
    for generationData in componentData.generations
      if generationData.state != "archived"
        @clearNoComponentsHelper()
        @addGeneration componentData, generationData

  removeComponent : (componentId) ->
    for generationBox in @generations
      if generationBox.data.componentData.id == componentId
        generationBox.destroy()
        break

  addGeneration : (componentData, generationData) ->
    generation = new nanobox.ClobberBox()
    generation.build @$el, nanobox.ClobberBox.APP_COMPONENT_GENERATION, {componentData:componentData, generationData:generationData}
    @generations.push generation

  removeGeneration : (generationId) ->
    for generationBox in @generations
      if generationBox.data.generationData.id == generationId
        generationBox.destroy()
        break

  updateGenerationState : (id, state) ->
    for generation in @generations
      if id == generation.box.id
        generation.box.setState state

  destroy : () ->
    for generation in @generations
      generation.box.off()
      generation.destroy()
    super()
