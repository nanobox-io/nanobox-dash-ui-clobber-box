ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

boxes = []
$holder = $ ".holder"

window.init = ()=>
  subscribeToRegistrations()
  addEventListeners()
  statsDataSimultor.createFakeStatDataProvider()

  hostBox = new nanobox.ClobberBox()
  hostBox.build $holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()

  appComponent = new nanobox.ClobberBox()
  appComponent.build $holder, nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent()

  platformComponent = new nanobox.ClobberBox()
  platformComponent.build $holder, nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("hm", "Health Monitor", "health-monitor")

  # Useful for triggering some click right away
  # $("#show-app-components").trigger "click"

subscribeToRegistrations = ->
  PubSub.subscribe 'REGISTER'                , (m, box)=>
    boxes.push box
  # 'REGISTER.HOST'
  # 'REGISTER.CLUSTER'
  # 'REGISTER.PLATFORM_COMPONENT'
  # 'REGISTER.APP_COMPONENT'
  PubSub.subscribe 'UNREGISTER'              , (m, box)=>
    removeBox box

  # PubSub.subscribe 'UNREGISTER.HOST'
  # PubSub.subscribe 'UNREGISTER.CLUSTER'
  # PubSub.subscribe 'UNREGISTER.PLATFORM_COMPONENT'
  # PubSub.subscribe 'UNREGISTER.APP_COMPONENT'


addEventListeners = () ->
  PubSub.subscribe 'SHOW.APP_COMPONENTS'     , (m, data)=> getBox(data).showAppComponents()
  PubSub.subscribe 'SHOW.PLATFORM_COMPONENTS', (m, data)=> getBox(data).showPlatformComponents()
  PubSub.subscribe 'SHOW.INSTANCES'          , (m, data)=>
  PubSub.subscribe 'SHOW.SCALE'              , (m, data)=> getBox(data).showScaleMachine()
  PubSub.subscribe 'SHOW.STATS'              , (m, data)=>
    box = getBox(data)
    box.showStats()

  PubSub.subscribe 'SHOW.CONSOLE'            , (m, data)=> getBox(data).showConsole()
  PubSub.subscribe 'SHOW.SPLIT'              , (m, data)=>
  PubSub.subscribe 'SHOW.ADMIN'              , (m, data)=>
  PubSub.subscribe 'SHOW'                    , (m,data) =>
    # console.log m, data

getBox = (key) ->
  for box in boxes
    if key == box.id
      return box

removeBox = (doomedBox)->
  for box, i in boxes
    if box.id == doomedBox.id
      boxes.splice i, 1
      return
