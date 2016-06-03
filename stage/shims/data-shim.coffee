AppComponent      = require './app-component'
PlatformComponent = require './platform-component'
Host              = require './host'
HorizCluster      = require './horiz-cluster'
DataCluster       = require './data-cluster'
Generation        = require './generation'

module.exports = class ClobberBoxDataShim

  constructor : () ->

  getHost              : (makeLotsOfComponents=false)     -> new Host makeLotsOfComponents
  getHorizCluster      : (totalMembers)                   -> new HorizCluster totalMembers
  getDataCluster       : ()                               -> new DataCluster
  getAppComponent      : (kind, type, scalesHorizontally) -> new AppComponent kind, type, scalesHorizontally
  getPlatformComponent : (id, kind)                       -> new PlatformComponent id, kind
  getGeneration        : (parentId, state)                -> new Generation parentId, state

  #
  resetCounts : ()->
    Host.hostCount                 = 0
    AppComponent.appComponentCount = 0
    HorizCluster.clusterCount      = 0
    DataCluster.clusterCount       = 0
