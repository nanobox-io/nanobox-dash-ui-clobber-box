ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

boxes = hostBox = clusterBox = appComponent = platformComponent = ""
$holder = $ ".holder"

window.init = ()=>
  statsDataSimultor.createFakeStatDataProvider()

  hostBox = new nanobox.ClobberBox()
  hostBox.build $holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()

  appComponent = new nanobox.ClobberBox()
  appComponent.build $holder, nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent()

  platformComponent = new nanobox.ClobberBox()
  platformComponent.build $holder, nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("hm", "Health Monitor", "health-monitor")

  boxes = [hostBox, clusterBox, appComponent, platformComponent]

  addEventListeners()

addButtonEvents = ()=>
  $("#show-platform-components").on "click", ()=> hostBox.box.showPlatformComponents()
  $("#show-app-components").on      "click", ()=> hostBox.box.showAppComponents()
  $("#show-scale").on               "click", ()=> hostBox.box.showScaleMachine()
  $("#show-stats").on               "click", ()=> hostBox.box.showStats()

  # Useful for triggering some click right away
  # $("#show-platform-components").trigger "click"
  # $("#show-app-components").trigger "click"


addEventListeners = () ->
  PubSub.subscribe 'SHOW.APP_COMPONENTS'     , (m, data)=> getBox(data).box.showAppComponents()
  PubSub.subscribe 'SHOW.PLATFORM_COMPONENTS', (m, data)=> getBox(data).box.showPlatformComponents()
  PubSub.subscribe 'SHOW.INSTANCES'          , (m, data)=>
  PubSub.subscribe 'SHOW.SCALE'              , (m, data)=> getBox(data).box.showScaleMachine()
  PubSub.subscribe 'SHOW.STATS'              , (m, data)=>
    box = getBox(data)
    box.box.showStats()

  PubSub.subscribe 'SHOW.CONSOLE'            , (m, data)=>
  PubSub.subscribe 'SHOW.SPLIT'              , (m, data)=>
  PubSub.subscribe 'SHOW.ADMIN'              , (m, data)=>
  PubSub.subscribe 'SHOW'                    , (m,data) => console.log m, data

getBox = (key) ->
  for box in boxes
    if key == box.id
      return box
