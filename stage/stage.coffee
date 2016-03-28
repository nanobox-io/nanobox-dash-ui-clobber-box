ClobberBoxDataShim = require './shims/data-shim'
window.clobberBoxDataShim = new ClobberBoxDataShim()

window.init = ()->
  hostBox = new nanobox.ClobberBox()
  hostBox.build $("body"), nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost()
  clobberBoxDataShim.sendDummyStats hostBox

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $("body"), nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster()
  clobberBoxDataShim.sendDummyStats clusterBox

  appComponent = new nanobox.ClobberBox()
  appComponent.build $("body"), nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent()
  clobberBoxDataShim.sendDummyStats appComponent

  platformComponent = new nanobox.ClobberBox()
  platformComponent.build $("body"), nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("lb", "Load Balancer", "load-balancer")
  clobberBoxDataShim.sendDummyStats platformComponent
