ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

hostBox = clusterBox = appComponent = platformComponent = ""

window.init = ()=>
  statsDataSimultor.createFakeStatDataProvider()

  hostBox = new nanobox.ClobberBox()
  hostBox.build $("body"), nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $("body"), nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()

  appComponent = new nanobox.ClobberBox()
  appComponent.build $("body"), nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent()

  platformComponent = new nanobox.ClobberBox()
  platformComponent.build $("body"), nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("hm", "Health Monitor", "health-monitor")

  addButtonEvents()

addButtonEvents = ()=>
  $("#show-platform-components").on "click", ()=> hostBox.box.showPlatformComponents()
  $("#show-app-components").on      "click", ()=> hostBox.box.showAppComponents()
  $("#show-scale").on               "click", ()=> hostBox.box.showScaleMachine()
  $("#show-stats").on               "click", ()=> hostBox.box.showStats()

  # Useful for triggering some click right away
  # $("#show-platform-components").trigger "click"
  # $("#show-app-components").trigger "click"
