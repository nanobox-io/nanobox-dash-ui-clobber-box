UI                 = require './test-ui/ui'
ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

boxes = []
$holder = $ ".holder"

window.init = ()=>
  statsDataSimultor.createFakeStatDataProvider()
  ui = new UI $('body')

  #  ------------------------------------ Adding Items

  window.addGeneration = (componentId, state='provisioning')->
    genData = clobberBoxDataShim.getGeneration(componentId, state).serialize()
    getParentOfComponent(componentId).addGeneration componentId, genData

  window.addComponent = (hostId)->
    getBox(hostId).addComponent clobberBoxDataShim.getAppComponent().serialize()

  window.removeComponent = (componentId)->
    getParentOfComponent(componentId).removeComponent componentId
    # getBox(hostId).addComponent

  window.removeGeneration = (generationId)->
    getParentOfGeneration(generationId).removeGeneration generationId

  window.addHost = ()->
    hostBox = new nanobox.ClobberBox()
    hostBox.build $holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost(false).serialize()
    ui.noteComponents(hostBox)

  window.addCluster = (clusterData)->
    for generation in clusterData.generations
      data =
        serviceId        : clusterData.id
        serviceState     : clusterData.state
        name             : clusterData.name
        serviceType      : clusterData.serviceType
        scalesHoriz      : clusterData.scalesHoriz
        scalesRedund     : clusterData.scalesRedund
        instances        : clusterData.instances # Delete
        id               : generation.id
        generationState  : generation.state
        generationStatus : generation.status
        members          : generation.instances
        totalMembers     : generation.instances.length

      clusterBox = new nanobox.ClobberBox()
      clusterBox.build $holder, nanobox.ClobberBox.CLUSTER, data

  # ------------------------------------ State

  # Used to set the state of any box, but should only be used for hosts and clusters
  window.setState = (id, state)->
    getBox(id).setState state

  # Used to set the state of any generations
  window.setGenerationState = (id, state)->
    getParentOfGeneration(id).setGenerationState id, state


  # ------------------------------------ Subscriptions

  subscribeToRegistrations = ->
    # Shim, this should be handled by valkrie..
    PubSub.subscribe 'SCALE.GET_OPTIONS', (m, cb)-> cb scaleMachineTestData.getHostOptions()
    PubSub.subscribe 'REGISTER'         , (m, box)=> boxes.push box
    PubSub.subscribe 'UNREGISTER'       , (m, box)=> removeBox box
    PubSub.subscribe 'SCALE.SAVE'       , (m, data)-> console.log("New Scale:"); console.log data
    PubSub.subscribe 'SPLIT.SAVE'       , (m, data)-> console.log("Split:"); console.log data


  addEventListeners = () ->
    PubSub.subscribe 'SHOW.APP_COMPONENTS'     , (m, data)=> getBox(data.id).switchSubContent 'app-components', data.el
    PubSub.subscribe 'SHOW.PLATFORM_COMPONENTS', (m, data)=> getBox(data.id).switchSubContent 'platform-components', data.el
    PubSub.subscribe 'SHOW.HOST-INTANCES'      , (m, data)=> getBox(data.id).switchSubContent 'host-instances', data.el
    PubSub.subscribe 'SHOW.SCALE'              , (m, data)=> getBox(data.id).switchSubContent 'scale-machine', data.el
    PubSub.subscribe 'SHOW.STATS'              , (m, data)=> getBox(data.id).switchSubContent 'stats', data.el
    PubSub.subscribe 'SHOW.CONSOLE'            , (m, data)=> getBox(data.id).switchSubContent 'console', data.el
    PubSub.subscribe 'SHOW.SPLIT'              , (m, data)=> getBox(data.id).switchSubContent 'split', data.el
    PubSub.subscribe 'SHOW.ADMIN'              , (m, data)=> getBox(data.id).switchSubContent 'admin', data.el

  # ------------------------------------ Helpers
  getBox = (id) ->
    for box in boxes
      if id == box.id
        return box

  getParentOfComponent = (id) ->
    for box in boxes
      if box.hasComponentWithId id
        return box

  getParentOfGeneration = (id) ->
    for box in boxes
      if box.hasGenerationWithId id
        return box

  removeBox = (doomedBox)->
    for box, i in boxes
      if box.id == doomedBox.id
        boxes.splice i, 1
        return

  # Listen for Events
  subscribeToRegistrations()
  addEventListeners()

  # ------------------------------------ Start the app
  addHost()
  addCluster( clobberBoxDataShim.getCluster().serialize() )
