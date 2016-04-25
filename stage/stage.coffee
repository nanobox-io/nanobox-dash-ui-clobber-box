
ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

boxes = []
$holder = $ ".holder"

window.init = ()=>
  statsDataSimultor.createFakeStatDataProvider()

  #  ------------------------------------ Adding Items

  window.addGeneration = (componentId, state='provisioning')->
    genData = clobberBoxDataShim.getGeneration(componentId, state)
    getParentOfComponent(componentId).addGeneration componentId, genData

  window.addComponent = (hostId)->
    getBox(hostId).addComponent clobberBoxDataShim.getAppComponent()

  window.addHost = ()->
    hostBox = new nanobox.ClobberBox()
    hostBox.build $holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()

  window.addCluster = ()->
    clusterBox = new nanobox.ClobberBox()
    clusterBox.build $holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()

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
    PubSub.subscribe 'STATS.GET_OPTIONS', (m, cb)-> cb scaleMachineTestData.getHostOptions()
    PubSub.subscribe 'REGISTER'         , (m, box)=> boxes.push box
    PubSub.subscribe 'UNREGISTER'       , (m, box)=> removeBox box


  addEventListeners = () ->
    PubSub.subscribe 'SHOW.APP_COMPONENTS'     , (m, data)=> getBox(data.id).switchSubContent 'app-components', data.el
    PubSub.subscribe 'SHOW.PLATFORM_COMPONENTS', (m, data)=> getBox(data.id).switchSubContent 'platform-components', data.el
    PubSub.subscribe 'SHOW.INSTANCES'          , (m, data)=>
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
  addCluster()
