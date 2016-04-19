
ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

boxes = []
$holder = $ ".holder"

window.init = ()=>
  subscribeToRegistrations()
  addEventListeners()
  statsDataSimultor.createFakeStatDataProvider()

  window.hostBox = new nanobox.ClobberBox()
  hostBox.build $holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()


  # Useful for triggering some click right away
  # $("#show-app-components").trigger "click"

subscribeToRegistrations = ->
  # Shim, this should be handled by valkrie..
  PubSub.subscribe 'STATS.GET_OPTIONS', (m, cb)-> cb scaleMachineTestData.getHostOptions()
  PubSub.subscribe 'REGISTER'         , (m, box)=> boxes.push box
  # 'REGISTER.HOST'
  # 'REGISTER.CLUSTER'
  # 'REGISTER.PLATFORM_COMPONENT'
  # 'REGISTER.APP_COMPONENT'
  PubSub.subscribe 'UNREGISTER'       , (m, box)=> removeBox box

  # PubSub.subscribe 'UNREGISTER.HOST'
  # PubSub.subscribe 'UNREGISTER.CLUSTER'
  # PubSub.subscribe 'UNREGISTER.PLATFORM_COMPONENT'
  # PubSub.subscribe 'UNREGISTER.APP_COMPONENT'

window.setState = (id, state)-> getBox(id).setState state

addEventListeners = () ->
  PubSub.subscribe 'SHOW.APP_COMPONENTS'     , (m, data)=> getBox(data.id).switchSubContent 'app-components', data.el
  PubSub.subscribe 'SHOW.PLATFORM_COMPONENTS', (m, data)=> getBox(data.id).switchSubContent 'platform-components', data.el
  PubSub.subscribe 'SHOW.INSTANCES'          , (m, data)=>
  PubSub.subscribe 'SHOW.SCALE'              , (m, data)=> getBox(data.id).switchSubContent 'scale-machine', data.el
  PubSub.subscribe 'SHOW.STATS'              , (m, data)=> getBox(data.id).switchSubContent 'stats', data.el

  PubSub.subscribe 'SHOW.CONSOLE'            , (m, data)=> getBox(data.id).switchSubContent 'console', data.el
  PubSub.subscribe 'SHOW.SPLIT'              , (m, data)=> getBox(data.id).switchSubContent 'split', data.el
  PubSub.subscribe 'SHOW.ADMIN'              , (m, data)=> getBox(data.id).switchSubContent 'admin', data.el
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
