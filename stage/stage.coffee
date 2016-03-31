ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

hostBox = clusterBox = appComponent = platformComponent = ""

window.init = ()=>
  statsDataSimultor.createFakeStatDataProvider()

  hostBox = new nanobox.ClobberBox()
  hostBox.build $("body"), nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()
  # clobberBoxDataShim.sendDummyStats hostBox

  # clusterBox = new nanobox.ClobberBox()
  # clusterBox.build $("body"), nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()
  # # clobberBoxDataShim.sendDummyStats clusterBox
  #
  # appComponent = new nanobox.ClobberBox()
  # appComponent.build $("body"), nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent()
  # # clobberBoxDataShim.sendDummyStats appComponent
  #
  # platformComponent = new nanobox.ClobberBox()
  # platformComponent.build $("body"), nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("lb", "Load Balancer", "load-balancer")
  # # clobberBoxDataShim.sendDummyStats platformComponent

  addButtonEvents()

addButtonEvents = ()=>
  $("#show-platform-components").on "click", ()=> hostBox.box.showPlatformComponents()
  $("#show-app-components").on      "click", ()=> hostBox.box.showAppComponents()

  # Useful for triggering some click right away
  $("#show-platform-components").trigger "click"
