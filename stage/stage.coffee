UI                 = require './test-ui/ui'
ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

boxes = []
$holder = $ ".holder"

nanobox.noDeploys = false
nanobox.appName   = 'fishfeather'

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

  window.addHost = (lotsOfIcons)->
    hostBox = new nanobox.ClobberBox()
    hostBox.build $holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost(lotsOfIcons).serialize()
    ui.noteComponents(hostBox)

  window.addCluster = (clusterData)->
    for generation in clusterData.generations
      data =
        serviceId         : clusterData.id
        serviceState      : clusterData.state
        name              : clusterData.name
        serviceType       : clusterData.serviceType
        scalesHoriz       : clusterData.scalesHoriz
        scalesRedund      : clusterData.scalesRedund
        category          : clusterData.category
        clusterable       : clusterData.clusterable
        adminPath         : clusterData.adminPath
        actionPath        : clusterData.adminPath
        uid               : clusterData.uid
        clusterShapeIs    : clusterData.clusterShapeIs
        clusterShapeCanBe : clusterData.clusterShapeCanBe
        topology          : clusterData.topology
        tunnelCredentials : clusterData.tunnelCredentials
        id                : generation.id
        generationState   : generation.state
        generationStatus  : generation.status
        members           : generation.instances
        totalMembers      : generation.instances.length
      clusterBox = new nanobox.ClobberBox()
      clusterBox.build $holder, nanobox.ClobberBox.CLUSTER, data

  # ------------------------------------ State

  # Used to set the state of any box, but should only be used for hosts and clusters
  window.setState = (id, state)->
    getBox(id).setState state

  # I don't know if we're going to build this functionality..
  window.manageComponent = (componentId)->
    box = getBox(componentId)
    if box?
      x = 0
      # Open the box...
      return

    boxHost = getParentOfComponent()
    if boxHost?
      x = 0
      # Open the box's sub component

  # Used to set the state of any generations
  window.setGenerationState = (id, state)->
    getParentOfGeneration(id).setGenerationState id, state


  # ------------------------------------ Subscriptions

  subscribeToRegistrations = ->
    # Shim, this should be handled by valkrie..
    PubSub.subscribe 'SCALE.GET_OPTIONS', (m, cb)-> cb scaleMachineTestData.getHostOptions()
    PubSub.subscribe 'GET_BUNKHOUSES'   , (m, data)-> data.cb [ {id:"a", name:"EC2 1", current:true, state:'active'}, {id:"c", name:"EC2 3", state:"active"} ]
    PubSub.subscribe 'REGISTER'         , (m, box)=> boxes.push box;
    PubSub.subscribe 'UNREGISTER'       , (m, box)=> removeBox box
    PubSub.subscribe 'SCALE.SAVE'       , (m, data)-> console.log("New Scale:"); console.log data; data.submitCb()
    PubSub.subscribe 'SPLIT.SAVE'       , (m, data)-> console.log("Split:"    ); console.log data; data.submitCb()


  addEventListeners = () ->
    PubSub.subscribe 'SHOW.APP_COMPONENTS'     , (m, data)=> getBox(data.uri).switchSubContent 'app-components', data.el
    PubSub.subscribe 'SHOW.PLATFORM_COMPONENTS', (m, data)=> getBox(data.uri).switchSubContent 'platform-components', data.el
    PubSub.subscribe 'SHOW.HOST-INTANCES'      , (m, data)=> getBox(data.uri).switchSubContent 'host-instances', data.el
    PubSub.subscribe 'SHOW.SCALE'              , (m, data)=> getBox(data.uri).switchSubContent 'scale-machine', data.el
    PubSub.subscribe 'SHOW.STATS'              , (m, data)=> getBox(data.uri).switchSubContent 'stats', data.el
    PubSub.subscribe 'SHOW.CONSOLE'            , (m, data)=> getBox(data.uri).switchSubContent 'console', data.el
    PubSub.subscribe 'SHOW.TUNNEL'             , (m, data)=> getBox(data.uri).switchSubContent 'tunnel', data.el
    PubSub.subscribe 'SHOW.SPLIT'              , (m, data)=> getBox(data.uri).switchSubContent 'split', data.el
    PubSub.subscribe 'SHOW.ADMIN'              , (m, data)=> getBox(data.uri).switchSubContent 'admin', data.el

  # ------------------------------------ Helpers
  getBox = (uri) ->
    for box in boxes
      if uri == box.uri
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
  addCluster( clobberBoxDataShim.getHorizCluster().serialize() )
  addCluster( clobberBoxDataShim.getDataCluster().serialize() )

  # Test no deploys
  window.setNoDeploys     = ()-> getBox("host.1").showAsReadyForDeploys()
  window.getComponentData = ()-> getBox("host.1").getDataForUsageBreakdown()
