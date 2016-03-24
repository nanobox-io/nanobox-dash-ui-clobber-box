ClobberBoxDataShim = require './shims/data-shim'
clobberBoxDataShim = new ClobberBoxDataShim()

window.init = ()->
  hostBox = new nanobox.ClobberBox()
  hostBox.build $("body"), nanobox.ClobberBox.HOST_BOX,  clobberBoxDataShim.getBoxData()
  hostBox.updateLiveStats statsDataSimultor.generateFakeLiveStats()  # Load fake data (only included for testing : hourly-stats/rel/data-shim.js)

  clusterBox = new nanobox.ClobberBox()
  clusterBox.build $("body"), nanobox.ClobberBox.CLUSTER_BOX,  clobberBoxDataShim.getClusterData()
  clusterBox.updateLiveStats statsDataSimultor.generateFakeLiveStats()  # Load fake data (only included for testing : hourly-stats/rel/data-shim.js)
