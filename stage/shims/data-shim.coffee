AppComponent      = require './app-component'
PlatformComponent = require './platform-component'
Host              = require './host'
Cluster           = require './cluster'

module.exports = class ClobberBoxDataShim

  constructor : () ->

  getHost              : (makeLotsOfComponents=false)     -> new Host makeLotsOfComponents
  getCluster           : (totalMembers)                   -> new Cluster totalMembers
  getAppComponent      : (kind, type, scalesHorizontally) -> new AppComponent kind, type, scalesHorizontally
  getPlatformComponent : (id, kind)                       -> new PlatformComponent id, kind
