Manager         = require 'managers/manager'
noAppComponents = require 'jade/no-app-components'

module.exports = class AppComponents extends Manager

  constructor: (@$el, components, @resizeCb, hostAddress) ->
    super()
    @generations = []
    if components.length == 0
      if nanobox.noDeploys
        @addNoComponentsPlaceholder()
      else
        @checkForGenerations()
      @resizeCb
    else
      for componentData in components
        @addComponent componentData, hostAddress

  addNoComponentsPlaceholder : () ->
    languages = [
      {icon : 'hex-ruby',        title:"Ruby",      guide:"https://guides.nanobox.io/ruby/"}
      {icon : 'hex-python',      title:"Python",    guide:"https://guides.nanobox.io/python/"}
      {icon : 'hex-node',        title:"NodeJs",    guide:"https://guides.nanobox.io/nodejs/"}
      {icon : 'hex-php',         title:"PHP",       guide:"https://guides.nanobox.io/php/"}
      {icon : 'hex-java',        title:"Java",      guide:"https://guides.nanobox.io/java/"}
      {icon : 'hex-scala',       title:"Scala",     guide:"https://guides.nanobox.io/scala/"}
      {icon : 'hex-golang',      title:"Go",        guide:"https://guides.nanobox.io/golang/"}
      {icon : 'hex-erlang',      title:"Erlang",    guide:"https://guides.nanobox.io/erlang/"}
      {icon : 'hex-clojure',     title:"Clojure",   guide:"https://guides.nanobox.io/clojure/"}
      {icon : 'hex-postgres',    title:"Postgres",  guide:"https://guides.nanobox.io/postgresql/"}
      {icon : 'hex-mysql',       title:"MySQL",     guide:"https://guides.nanobox.io/mysql/"}
      {icon : 'hex-mongo',       title:"MongoDB",   guide:"https://guides.nanobox.io/mongodb/"}
      {icon : 'hex-redis',       title:"Redis",     guide:"https://guides.nanobox.io/redis/"}
      {icon : 'hex-memcached',   title:"Memcached", guide:"https://guides.nanobox.io/memcached/"}
      # {icon : 'hex-percona',     title:"Percona",   guide:"https://guides.nanobox.io/percona/"}
      # {icon : 'hex-maria',       title:"MariaDB",   guide:"https://guides.nanobox.io/mariadb/"}
      # {icon : 'hex-couch',       title:"CouchDB",   guide:"https://guides.nanobox.io/couchdb/"}
      # {icon:'hex-storage', title:"Storage", guide:"https://guides.nanobox.io/php/"}
    ]
    @$noComponents = $ noAppComponents( {languages:languages} )
    @$el.append @$noComponents
    castShadows @$noComponents

  clearNoComponentsHelper : () ->
    if @$noComponents?
      @checkForGenerations()
      @$noComponents.remove()
      @$noComponents = null


  addComponent : (componentData, hostAddress) ->
    for generationData in componentData.generations
      if generationData.state != "archived"
        @clearNoComponentsHelper()
        @addGeneration componentData, generationData, hostAddress

  removeComponent : (componentId) ->
    for generationBox, i in @generations
      if generationBox.data.componentData.id == componentId
        generationBox.destroy()
        @generations.splice i, 1
        break
    @checkForGenerations()

  addGeneration : (componentData, generationData, hostAddress) ->
    generation = new nanobox.ClobberBox()
    generation.build @$el, nanobox.ClobberBox.APP_COMPONENT_GENERATION, {componentData:componentData, generationData:generationData, hostAddress:hostAddress}
    @generations.push generation
    @checkForGenerations()

  removeGeneration : (generationId) ->
    for generationBox, i in @generations
      if generationBox.data.generationData.id == generationId
        generationBox.destroy()
        @generations.splice i, 1
        break

  updateGenerationState : (id, state) ->
    @getGenerationById(id).box.setState state

  updateGenerationStatus : (id, status) ->
    @getGenerationById(id).box.setStatus status

  checkForGenerations : () ->
    if @generations.length == 0
      @$el.addClass 'no-components'
    else
      @$el.removeClass 'no-components'

  destroy : () ->
    for generation in @generations
      generation.box.off()
      generation.destroy()
    super()

  # ------------------------------------ Helpers

  getGenerationById : (id) ->
    for generation in @generations
      if id == generation.box.id
        return generation
