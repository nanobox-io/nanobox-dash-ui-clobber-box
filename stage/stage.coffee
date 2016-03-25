ClobberBoxDataShim = require './shims/data-shim'
clobberBoxDataShim = new ClobberBoxDataShim()

window.init = ()->
  hostBox = new nanobox.ClobberBox()
  hostBox.build $("body"), nanobox.ClobberBox.HOST,  clobberBoxDataShim.getHost()
  hostBox.updateLiveStats statsDataSimultor.generateFakeLiveStats()

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $("body"), nanobox.ClobberBox.CLUSTER,  clobberBoxDataShim.getCluster()
  clusterBox.updateLiveStats statsDataSimultor.generateFakeLiveStats()

  appComponent = new nanobox.ClobberBox()
  appComponent.build $("body"), nanobox.ClobberBox.APP_COMPONENT,  clobberBoxDataShim.getAppComponent()
  appComponent.updateLiveStats statsDataSimultor.generateFakeLiveStats()

  platformComponent = new nanobox.ClobberBox()
  platformComponent.build $("body"), nanobox.ClobberBox.PLATFORM_COMPONENT,  clobberBoxDataShim.getPlatformComponent("lb", "Load Balancer", "load-balancer")
  platformComponent.updateLiveStats statsDataSimultor.generateFakeLiveStats()
