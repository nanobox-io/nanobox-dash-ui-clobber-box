(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AppComponent;

module.exports = AppComponent = (function() {
  AppComponent.appComponentCount = 0;

  function AppComponent(kind, type, scalesHorizontally, scalesRedund, hostId) {
    if (kind == null) {
      kind = 'web';
    }
    this.type = type != null ? type : "ruby";
    if (scalesHorizontally == null) {
      scalesHorizontally = true;
    }
    if (scalesRedund == null) {
      scalesRedund = false;
    }
    this.generationCount = 1;
    this.state = 'active';
    this.status = 'online';
    this.serverSpecsId = "b3";
    this.id = kind + "." + (++AppComponent.appComponentCount);
    this.name = kind + " " + AppComponent.appComponentCount;
    this.generations = [];
    this.adminPath = "/some/path/to/admin";
    this.actionPath = "/some/path/to/action";
    this.category = scalesHorizontally ? 'web' : 'data';
    this.clusterable = scalesRedund;
    this.clusterShapeIs = '';
    this.clusterShapeCanBe = clobbershim.getClusterPotential(scalesHorizontally);
    this.topology = 'bunkhouse';
    this.uri = hostId + "/" + this.id;
    this.addGeneration();
  }

  AppComponent.prototype.addGeneration = function(state) {
    var obj;
    if (state == null) {
      state = 'provisioning';
    }
    obj = {
      state: state,
      status: 'online',
      id: this.id + ".gen" + (this.generationCount++)
    };
    if (Math.random() > 0.5) {
      obj.state = 'active';
    }
    return this.generations.push(obj);
  };

  AppComponent.prototype.serialize = function() {
    var data;
    data = {
      generations: this.generations,
      state: this.state,
      status: this.status,
      serverSpecsId: this.serverSpecsId,
      id: this.id,
      name: this.name,
      uid: this.id,
      serviceType: this.type,
      adminPath: this.adminPath,
      actionPath: this.actionPath,
      category: this.category,
      clusterable: this.clusterable,
      uri: this.uri,
      clusterShapeIs: this.clusterShapeIs,
      clusterShapeCanBe: this.clusterShapeCanBe,
      topology: this.topology
    };
    if (this.category === 'data') {
      data.tunnelCredentials = {
        DB_HOST: '127.0.0.1',
        DB_PORT: '4000',
        DB_USER: 'nanobox',
        DB_PASS: 'yYBavcCUWuz',
        DB_NAME: 'data.db'
      };
    }
    return data;
  };

  return AppComponent;

})();

},{}],2:[function(require,module,exports){
var DataCluster, Host;

Host = require('./host');

module.exports = DataCluster = (function() {
  DataCluster.clusterCount = 0;

  function DataCluster() {
    var generation, i, j, k, len, ref, role, roles, totalGenerations;
    totalGenerations = 1;
    this.id = "cluster." + DataCluster.clusterCount;
    this.name = "Customers DB";
    this.state = "active";
    this.status = "online";
    this.running = false;
    this.serviceType = "mysql-db";
    this.category = "data";
    this.clusterable = true;
    this.adminPath = "/some/path/to/admin";
    this.uri = this.id;
    this.generations = [];
    this.clusterShapeIs = 'data-single';
    this.clusterShapeCanBe = clobbershim.getClusterPotential(false);
    this.topology = 'cluster';
    this.tunnelCredentials = {
      host: "127.0.0.1",
      port: "provided in tunnel command output"
    };
    for (i = j = 1, ref = totalGenerations; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      generation = {
        id: "db.main.gen" + i,
        state: "active",
        status: "online",
        instances: []
      };
      roles = ['primary', 'secondary', 'arbiter'];
      for (i = k = 0, len = roles.length; k < len; i = ++k) {
        role = roles[i];
        generation.instances.push({
          id: i,
          hostId: "do." + i,
          hostName: "do." + i,
          state: "active",
          status: "online",
          role: role,
          serverSpecsId: "d16",
          running: true
        });
      }
      this.generations.push(generation);
    }
  }

  DataCluster.prototype.serialize = function() {
    return {
      id: this.id,
      uid: this.id,
      state: this.state,
      status: this.status,
      running: this.running,
      name: this.name,
      category: this.category,
      clusterable: this.clusterable,
      generations: this.generations,
      serviceType: this.serviceType,
      adminPath: this.adminPath,
      uri: this.uri,
      clusterShapeIs: this.clusterShapeIs,
      clusterShapeCanBe: this.clusterShapeCanBe,
      topology: this.topology,
      tunnelCredentials: this.tunnelCredentials
    };
  };

  return DataCluster;

})();

},{"./host":6}],3:[function(require,module,exports){
var AppComponent, ClobberBoxDataShim, DataCluster, Generation, HorizCluster, Host, PlatformComponent;

AppComponent = require('./app-component');

PlatformComponent = require('./platform-component');

Host = require('./host');

HorizCluster = require('./horiz-cluster');

DataCluster = require('./data-cluster');

Generation = require('./generation');

module.exports = ClobberBoxDataShim = (function() {
  function ClobberBoxDataShim() {
    window.clobbershim = {
      getClusterPotential: this.getClusterPotential
    };
  }

  ClobberBoxDataShim.prototype.getHost = function(makeLotsOfComponents) {
    if (makeLotsOfComponents == null) {
      makeLotsOfComponents = false;
    }
    return new Host(makeLotsOfComponents);
  };

  ClobberBoxDataShim.prototype.getHorizCluster = function(totalMembers) {
    return new HorizCluster(totalMembers);
  };

  ClobberBoxDataShim.prototype.getDataCluster = function() {
    return new DataCluster();
  };

  ClobberBoxDataShim.prototype.getAppComponent = function(kind, type, scalesHorizontally, scalesRedund, uri) {
    return new AppComponent(kind, type, scalesHorizontally, scalesRedund, uri);
  };

  ClobberBoxDataShim.prototype.getPlatformComponent = function(id, kind) {
    return new PlatformComponent(id, kind);
  };

  ClobberBoxDataShim.prototype.getGeneration = function(parentId, state) {
    return new Generation(parentId, state);
  };

  ClobberBoxDataShim.prototype.resetCounts = function() {
    Host.hostCount = 0;
    AppComponent.appComponentCount = 0;
    HorizCluster.clusterCount = 0;
    return DataCluster.clusterCount = 0;
  };

  ClobberBoxDataShim.prototype.getClusterPotential = function(scalesHorizontally) {
    if (scalesHorizontally) {
      return ['horizontal'];
    } else {
      return ['data-single'];
    }
  };

  return ClobberBoxDataShim;

})();

},{"./app-component":1,"./data-cluster":2,"./generation":4,"./horiz-cluster":5,"./host":6,"./platform-component":7}],4:[function(require,module,exports){
var Generation;

module.exports = Generation = (function() {
  Generation.genericGenerationCount = 0;

  function Generation(parentId, state) {
    if (state == null) {
      state = 'active';
    }
    this.state = state;
    this.id = parentId + ".gen" + (Generation.genericGenerationCount++);
  }

  Generation.prototype.serialize = function() {
    return {
      state: this.state,
      id: this.id
    };
  };

  return Generation;

})();

},{}],5:[function(require,module,exports){
var HorizCluster, Host;

Host = require('./host');

module.exports = HorizCluster = (function() {
  HorizCluster.clusterCount = 0;

  function HorizCluster(totalMembers, totalGenerations) {
    var generation, i, j, k, ref, ref1;
    if (totalMembers == null) {
      totalMembers = 4;
    }
    if (totalGenerations == null) {
      totalGenerations = 1;
    }
    this.id = "cluster." + HorizCluster.clusterCount;
    this.name = "Main App";
    this.running = true;
    this.state = "active";
    this.status = "online";
    this.serviceType = "golang";
    this.category = "web";
    this.clusterable = true;
    this.generations = [];
    this.adminPath = "/some/path/to/admin";
    this.uri = this.id;
    this.clusterShapeIs = 'horizontal';
    this.clusterShapeCanBe = clobbershim.getClusterPotential(true);
    this.topology = 'cluster';
    for (i = j = 1, ref = totalGenerations; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      generation = {
        id: "web.main.gen" + i,
        state: 'active',
        status: "online",
        instances: []
      };
      for (i = k = 1, ref1 = totalMembers; 1 <= ref1 ? k <= ref1 : k >= ref1; i = 1 <= ref1 ? ++k : --k) {
        generation.instances.push({
          id: i,
          hostId: "do." + i,
          hostName: "do." + i,
          state: "active",
          status: "online",
          role: "default",
          serverSpecsId: "d16"
        });
      }
      this.generations.push(generation);
    }
  }

  HorizCluster.prototype.serialize = function() {
    return {
      id: this.id,
      uid: this.id,
      state: this.state,
      running: this.running,
      status: this.status,
      name: this.name,
      scalesHoriz: this.scalesHoriz,
      category: this.category,
      clusterable: this.clusterable,
      scalesRedund: this.scalesRedund,
      generations: this.generations,
      serviceType: this.serviceType,
      adminPath: this.adminPath,
      uri: this.uri,
      state: this.state,
      clusterShapeIs: this.clusterShapeIs,
      clusterShapeCanBe: this.clusterShapeCanBe,
      topology: this.topology
    };
  };

  return HorizCluster;

})();

},{"./host":6}],6:[function(require,module,exports){
var AppComponent, Host, PlatformComponent;

AppComponent = require('./app-component');

PlatformComponent = require('./platform-component');

module.exports = Host = (function() {
  Host.hostCount = 0;

  function Host(makeLotsOfComponents) {
    if (makeLotsOfComponents == null) {
      makeLotsOfComponents = false;
    }
    this.state = "active";
    this.running = true;
    this.status = 'online';
    this.id = "host." + (++Host.hostCount);
    this.name = "ec2." + Host.hostCount;
    this.serverSpecsId = "d16";
    this.bunkhouseId = "bunkhouse";
    this.actionPath = "/some/path/to/actions";
    this.platformServices = [new PlatformComponent("lb", "mesh", "nanobox/portal", this.id), new PlatformComponent("lg", "logger", "nanobox/logvac", this.id), new PlatformComponent("hm", "monitor", "nanobox/pulse", this.id), new PlatformComponent("mr", "pusher", "nanobox/mist", this.id), new PlatformComponent("gs", "warehouse", "nanobox/hoarder", this.id)];
    this.appComponents = [];
    this.createComponents(makeLotsOfComponents);
  }

  Host.prototype.createComponents = function(makeLotsOfComponents) {
    if (!makeLotsOfComponents) {
      this.addComponent('web', 'tolmark3', true, true);
      return this.addComponent('db', 'mongo12', false, true);
    } else {
      this.addComponent();
      this.addComponent('db', 'mongo-engine', false);
      this.addComponent('web', 'node-engine', true);
      this.addComponent('web', 'memcached-engine', true);
      this.addComponent('web', 'python-engine', true);
      this.addComponent('web', 'storage-engine', true);
      this.addComponent('web', 'java-engine', true);
      this.addComponent('web', 'php-engine', true);
      this.addComponent('db', 'couch-engine', false);
      this.addComponent('db', 'maria-engine', false);
      this.addComponent('db', 'postgres-engine', false);
      this.addComponent('db', 'redis-engine', false);
      this.addComponent('db', 'percona-engine', false);
      this.addComponent('web', 'somerandomdb', true);
      return this.addComponent('db', 'nothingwillmatch', false);
    }
  };

  Host.prototype.addComponent = function(kind, type, isHorizontallyScalable, isRedundScalable) {
    return this.appComponents.push(new AppComponent(kind, type, isHorizontallyScalable, isRedundScalable, this.id));
  };

  Host.prototype.serializeComponents = function(components) {
    var ar, component, i, len;
    ar = [];
    for (i = 0, len = components.length; i < len; i++) {
      component = components[i];
      ar.push(component.serialize());
    }
    return ar;
  };

  Host.prototype.serialize = function() {
    return {
      state: this.state,
      status: this.status,
      id: this.id,
      running: this.running,
      name: this.name,
      serverSpecsId: this.serverSpecsId,
      bunkhouseId: this.bunkhouseId,
      actionPath: this.actionPath,
      platformServices: this.serializeComponents(this.platformServices),
      appComponents: this.serializeComponents(this.appComponents)
    };
  };

  return Host;

})();

},{"./app-component":1,"./platform-component":7}],7:[function(require,module,exports){
var AppComponent, PlatformComponent;

AppComponent = require('./app-component');

module.exports = PlatformComponent = (function() {
  function PlatformComponent(id, kind, componentKind, hostId) {
    this.id = id;
    this.kind = kind;
    if (componentKind == null) {
      componentKind = 'mist';
    }
    this.isSplitable = true;
    this.mode = 'simple';
    this.adminPath = "/some/path/to/admin";
    this.components = [new AppComponent('web', componentKind, true, true, hostId).serialize()];
  }

  PlatformComponent.prototype.serialize = function() {
    return {
      id: this.id,
      kind: this.kind,
      isSplitable: this.isSplitable,
      mode: this.mode,
      components: this.components,
      status: 'online'
    };
  };

  return PlatformComponent;

})();

({
  id: "logger1",
  kind: "mesh",
  mode: "simple",
  isSplitable: true,
  components: [
    {
      id: "9e63d700-c84e-45ed-ba15-ed192fcf92b2",
      uid: "data.portal",
      name: "lucky-lime",
      state: "created",
      serviceType: "default-db",
      scalesHoriz: false,
      scalesRedund: false,
      isSplitable: true,
      generations: [
        {
          id: "data.portal.gen1",
          state: "created",
          status: "online",
          instances: [
            {
              id: 1,
              hostId: "test-host-name",
              hostName: "test-host-name",
              state: "created",
              status: "online",
              role: "default",
              serverSpecsId: "512mb"
            }
          ]
        }
      ]
    }
  ]
});

},{"./app-component":1}],8:[function(require,module,exports){
var $holder, ClobberBoxDataShim, UI, boxes;

UI = require('./test-ui/ui');

ClobberBoxDataShim = require('./shims/data-shim');

window.clobberBoxDataShim = new ClobberBoxDataShim();

boxes = [];

$holder = $(".holder");

nanobox.noDeploys = false;

nanobox.appName = 'fishfeather';

nanobox.fqAppName = 'flock/fishfeather';

window.init = (function(_this) {
  return function() {
    var addEventListeners, getBox, getParentOfComponent, getParentOfGeneration, removeBox, subscribeToRegistrations, ui;
    statsDataSimultor.createFakeStatDataProvider();
    ui = new UI($('body'));
    window.addGeneration = function(componentId, state) {
      var genData;
      if (state == null) {
        state = 'provisioning';
      }
      genData = clobberBoxDataShim.getGeneration(componentId, state).serialize();
      return getParentOfComponent(componentId).addGeneration(componentId, genData);
    };
    window.addComponent = function(hostId) {
      return getBox(hostId).addComponent(clobberBoxDataShim.getAppComponent().serialize());
    };
    window.removeComponent = function(componentId) {
      return getParentOfComponent(componentId).removeComponent(componentId);
    };
    window.removeGeneration = function(generationId) {
      return getParentOfGeneration(generationId).removeGeneration(generationId);
    };
    window.addHost = function(lotsOfIcons) {
      var hostBox;
      hostBox = new nanobox.ClobberBox();
      hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost(lotsOfIcons).serialize());
      return ui.noteComponents(hostBox);
    };
    window.addCluster = function(clusterData) {
      var clusterBox, data, generation, j, len, ref, results;
      ref = clusterData.generations;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        generation = ref[j];
        data = nanobox.ClobberBox.joinClusterData(clusterData, generation);
        clusterBox = new nanobox.ClobberBox();
        results.push(clusterBox.build($holder, nanobox.ClobberBox.CLUSTER, data));
      }
      return results;
    };
    window.setState = function(id, state) {
      return getBox(id).setState(state);
    };
    window.manageComponent = function(componentId) {
      var box, boxHost, x;
      box = getBox(componentId);
      if (box != null) {
        x = 0;
        return;
      }
      boxHost = getParentOfComponent();
      if (boxHost != null) {
        return x = 0;
      }
    };
    window.setGenerationState = function(id, state) {
      return getParentOfGeneration(id).setGenerationState(id, state);
    };
    window.setGenerationStatus = function(id, status) {
      return getParentOfGeneration(id).setGenerationStatus(id, status);
    };
    subscribeToRegistrations = function() {
      PubSub.subscribe('SCALE.GET_OPTIONS', function(m, cb) {
        return cb(scaleMachineTestData.getHostOptions());
      });
      PubSub.subscribe('GET_BUNKHOUSES', function(m, data) {
        return data.cb([
          {
            id: "a",
            name: "EC2 1",
            current: true,
            state: 'active'
          }, {
            id: "c",
            name: "EC2 3",
            state: "active"
          }
        ]);
      });
      PubSub.subscribe('REGISTER', (function(_this) {
        return function(m, box) {
          return boxes.push(box);
        };
      })(this));
      PubSub.subscribe('UNREGISTER', (function(_this) {
        return function(m, box) {
          return removeBox(box);
        };
      })(this));
      PubSub.subscribe('SCALE.SAVE', function(m, data) {
        console.log("New Scale:");
        console.log(data);
        return data.submitCb();
      });
      PubSub.subscribe('SPLIT.SAVE', function(m, data) {
        console.log("Split:");
        console.log(data);
        return data.submitCb();
      });
      PubSub.subscribe('HOST.RUN-ACTION', function(m, data) {
        console.log("running host action `" + data.action + "` on host `" + data.hostId + "`");
        return setTimeout(data.onComplete, Math.random() * 1000);
      });
      return PubSub.subscribe('COMPONENT.RUN-ACTION', function(m, data) {
        console.log("running component action `" + data.action + "` on component `" + data.componentId + "`");
        return setTimeout(data.onComplete, Math.random() * 1000);
      });
    };
    addEventListeners = function() {
      PubSub.subscribe('SHOW.APP_COMPONENTS', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('app-components', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.PLATFORM_COMPONENTS', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('platform-components', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.HOST-INTANCES', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('host-instances', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.SCALE', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('scale-machine', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.STATS', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('stats', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.CONSOLE', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('console', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.TUNNEL', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('tunnel', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.SPLIT', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('split', data.el);
        };
      })(this));
      return PubSub.subscribe('SHOW.ADMIN', (function(_this) {
        return function(m, data) {
          return getBox(data.uri).switchSubContent('admin', data.el);
        };
      })(this));
    };
    getBox = function(uri) {
      var box, j, len;
      for (j = 0, len = boxes.length; j < len; j++) {
        box = boxes[j];
        if (uri === box.uri) {
          return box;
        }
      }
    };
    getParentOfComponent = function(id) {
      var box, j, len;
      for (j = 0, len = boxes.length; j < len; j++) {
        box = boxes[j];
        if (box.hasComponentWithId(id)) {
          return box;
        }
      }
    };
    getParentOfGeneration = function(id) {
      var box, j, len;
      for (j = 0, len = boxes.length; j < len; j++) {
        box = boxes[j];
        if (box.hasGenerationWithId(id)) {
          return box;
        }
      }
    };
    removeBox = function(doomedBox) {
      var box, i, j, len;
      for (i = j = 0, len = boxes.length; j < len; i = ++j) {
        box = boxes[i];
        if (box.id === doomedBox.id) {
          boxes.splice(i, 1);
          return;
        }
      }
    };
    subscribeToRegistrations();
    addEventListeners();
    nanobox.noDeploys = true;
    nanobox.clobberConfig = {};
    nanobox.clobberConfig.hostActions = [
      {
        action: 'delete',
        permission: true
      }, {
        action: 'reboot',
        permission: true
      }, {
        action: 'stop',
        permission: true
      }, {
        action: 'start',
        permission: true
      }
    ];
    nanobox.clobberConfig.componentActions = [
      {
        action: 'refresh',
        permission: true
      }, {
        action: 'reboot',
        permission: false
      }, {
        action: 'rebuild',
        permission: true
      }, {
        action: 'update',
        permission: true
      }, {
        action: 'manage',
        permission: true
      }, {
        action: 'delete',
        permission: true
      }, {
        action: 'stop',
        permission: true
      }, {
        action: 'start',
        permission: true
      }
    ];
    addHost(false);
    addCluster(clobberBoxDataShim.getHorizCluster().serialize());
    addCluster(clobberBoxDataShim.getDataCluster().serialize());
    window.setNoDeploys = function() {
      return getBox("host.1").setReadinessState('no-deploys', 'legacy');
    };
    window.setPlatformBuilding = function() {
      return getBox("host.1").setReadinessState('platform-building');
    };
    return window.getComponentData = function() {
      return getBox("host.1").getDataForUsageBreakdown();
    };
  };
})(this);

},{"./shims/data-shim":3,"./test-ui/ui":9}],9:[function(require,module,exports){
var UI;

module.exports = UI = (function() {
  function UI() {
    this.initStateSelector($(".states"));
    this.initEvents();
    PubSub.subscribe('REGISTER', (function(_this) {
      return function(m, box) {
        return _this.registerBox(box);
      };
    })(this));
  }

  UI.prototype.registerBox = function(box) {
    if (box.data.id.includes('gen')) {
      return this.addToSelector($('.generations', '.ui-shim'), box);
    } else {
      return this.addToSelector($('.hosts', '.ui-shim'), box);
    }
  };

  UI.prototype.addToSelector = function($selector, box) {
    if ($("option[value='" + box.data.id + "']", $selector).length !== 0) {
      return;
    }
    return $selector.append("<option value='" + box.data.id + "'>" + box.data.id + "</option>");
  };

  UI.prototype.initStateSelector = function($selector) {
    var i, len, results, state, states;
    states = ['', 'created', 'initialized', 'ordered', 'provisioning', 'defunct', 'active', 'decomissioning', 'destroy', 'archived'];
    results = [];
    for (i = 0, len = states.length; i < len; i++) {
      state = states[i];
      results.push($selector.append("<option value='" + state + "'>" + state + "</option>"));
    }
    return results;
  };

  UI.prototype.initEvents = function() {
    $("button#hosts").on('click', (function(_this) {
      return function() {
        var id, state;
        id = $("select#hosts-state-selector").val();
        state = $("select#host-states").val();
        return setState(id, state);
      };
    })(this));
    $("button#generations").on('click', (function(_this) {
      return function() {
        var id, state;
        id = $("select#generations-state-selector").val();
        state = $("select#gen-states").val();
        return setGenerationState(id, state);
      };
    })(this));
    $("button#gen-status-go").on('click', (function(_this) {
      return function() {
        var id, status;
        id = $("select#generations-status-selector").val();
        status = $("select#gen-status").val();
        return setGenerationStatus(id, status);
      };
    })(this));
    $("button#add-generation").on('click', (function(_this) {
      return function() {
        return addGeneration($("select#add-generation-select").val());
      };
    })(this));
    $("button#remove-generation").on('click', (function(_this) {
      return function() {
        return removeGeneration($("select#remove-generation-select").val());
      };
    })(this));
    $("button#add-component").on('click', (function(_this) {
      return function() {
        return addComponent($("select#add-component-select").val());
      };
    })(this));
    return $("button#remove-component").on('click', (function(_this) {
      return function() {
        return removeComponent($("select#remove-component-select").val());
      };
    })(this));
  };

  UI.prototype.noteComponents = function(box) {
    var $selector, component, i, len, ref, results;
    $selector = $("select.components");
    ref = box.data.appComponents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      component = ref[i];
      results.push($selector.append("<option value='" + component.id + "'>" + component.id + "</option>"));
    }
    return results;
  };

  return UI;

})();

},{}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzaGltcy9hcHAtY29tcG9uZW50LmNvZmZlZSIsInNoaW1zL2RhdGEtY2x1c3Rlci5jb2ZmZWUiLCJzaGltcy9kYXRhLXNoaW0uY29mZmVlIiwic2hpbXMvZ2VuZXJhdGlvbi5jb2ZmZWUiLCJzaGltcy9ob3Jpei1jbHVzdGVyLmNvZmZlZSIsInNoaW1zL2hvc3QuY29mZmVlIiwic2hpbXMvcGxhdGZvcm0tY29tcG9uZW50LmNvZmZlZSIsInN0YWdlLmNvZmZlZSIsInRlc3QtdWkvdWkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEFwcENvbXBvbmVudDtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDb21wb25lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIEFwcENvbXBvbmVudC5hcHBDb21wb25lbnRDb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gQXBwQ29tcG9uZW50KGtpbmQsIHR5cGUsIHNjYWxlc0hvcml6b250YWxseSwgc2NhbGVzUmVkdW5kLCBob3N0SWQpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIHRoaXMudHlwZSA9IHR5cGUgIT0gbnVsbCA/IHR5cGUgOiBcInJ1YnlcIjtcbiAgICBpZiAoc2NhbGVzSG9yaXpvbnRhbGx5ID09IG51bGwpIHtcbiAgICAgIHNjYWxlc0hvcml6b250YWxseSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzY2FsZXNSZWR1bmQgPT0gbnVsbCkge1xuICAgICAgc2NhbGVzUmVkdW5kID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuZ2VuZXJhdGlvbkNvdW50ID0gMTtcbiAgICB0aGlzLnN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgdGhpcy5zdGF0dXMgPSAnb25saW5lJztcbiAgICB0aGlzLnNlcnZlclNwZWNzSWQgPSBcImIzXCI7XG4gICAgdGhpcy5pZCA9IGtpbmQgKyBcIi5cIiArICgrK0FwcENvbXBvbmVudC5hcHBDb21wb25lbnRDb3VudCk7XG4gICAgdGhpcy5uYW1lID0ga2luZCArIFwiIFwiICsgQXBwQ29tcG9uZW50LmFwcENvbXBvbmVudENvdW50O1xuICAgIHRoaXMuZ2VuZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFkbWluUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hZG1pblwiO1xuICAgIHRoaXMuYWN0aW9uUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hY3Rpb25cIjtcbiAgICB0aGlzLmNhdGVnb3J5ID0gc2NhbGVzSG9yaXpvbnRhbGx5ID8gJ3dlYicgOiAnZGF0YSc7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHNjYWxlc1JlZHVuZDtcbiAgICB0aGlzLmNsdXN0ZXJTaGFwZUlzID0gJyc7XG4gICAgdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSA9IGNsb2JiZXJzaGltLmdldENsdXN0ZXJQb3RlbnRpYWwoc2NhbGVzSG9yaXpvbnRhbGx5KTtcbiAgICB0aGlzLnRvcG9sb2d5ID0gJ2J1bmtob3VzZSc7XG4gICAgdGhpcy51cmkgPSBob3N0SWQgKyBcIi9cIiArIHRoaXMuaWQ7XG4gICAgdGhpcy5hZGRHZW5lcmF0aW9uKCk7XG4gIH1cblxuICBBcHBDb21wb25lbnQucHJvdG90eXBlLmFkZEdlbmVyYXRpb24gPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHZhciBvYmo7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ3Byb3Zpc2lvbmluZyc7XG4gICAgfVxuICAgIG9iaiA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIHN0YXR1czogJ29ubGluZScsXG4gICAgICBpZDogdGhpcy5pZCArIFwiLmdlblwiICsgKHRoaXMuZ2VuZXJhdGlvbkNvdW50KyspXG4gICAgfTtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgb2JqLnN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdlbmVyYXRpb25zLnB1c2gob2JqKTtcbiAgfTtcblxuICBBcHBDb21wb25lbnQucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB7XG4gICAgICBnZW5lcmF0aW9uczogdGhpcy5nZW5lcmF0aW9ucyxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHNlcnZlclNwZWNzSWQ6IHRoaXMuc2VydmVyU3BlY3NJZCxcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgdWlkOiB0aGlzLmlkLFxuICAgICAgc2VydmljZVR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGFkbWluUGF0aDogdGhpcy5hZG1pblBhdGgsXG4gICAgICBhY3Rpb25QYXRoOiB0aGlzLmFjdGlvblBhdGgsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgdXJpOiB0aGlzLnVyaSxcbiAgICAgIGNsdXN0ZXJTaGFwZUlzOiB0aGlzLmNsdXN0ZXJTaGFwZUlzLFxuICAgICAgY2x1c3RlclNoYXBlQ2FuQmU6IHRoaXMuY2x1c3RlclNoYXBlQ2FuQmUsXG4gICAgICB0b3BvbG9neTogdGhpcy50b3BvbG9neVxuICAgIH07XG4gICAgaWYgKHRoaXMuY2F0ZWdvcnkgPT09ICdkYXRhJykge1xuICAgICAgZGF0YS50dW5uZWxDcmVkZW50aWFscyA9IHtcbiAgICAgICAgREJfSE9TVDogJzEyNy4wLjAuMScsXG4gICAgICAgIERCX1BPUlQ6ICc0MDAwJyxcbiAgICAgICAgREJfVVNFUjogJ25hbm9ib3gnLFxuICAgICAgICBEQl9QQVNTOiAneVlCYXZjQ1VXdXonLFxuICAgICAgICBEQl9OQU1FOiAnZGF0YS5kYidcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBBcHBDb21wb25lbnQ7XG5cbn0pKCk7XG4iLCJ2YXIgRGF0YUNsdXN0ZXIsIEhvc3Q7XG5cbkhvc3QgPSByZXF1aXJlKCcuL2hvc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhQ2x1c3RlciA9IChmdW5jdGlvbigpIHtcbiAgRGF0YUNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcblxuICBmdW5jdGlvbiBEYXRhQ2x1c3RlcigpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbiwgaSwgaiwgaywgbGVuLCByZWYsIHJvbGUsIHJvbGVzLCB0b3RhbEdlbmVyYXRpb25zO1xuICAgIHRvdGFsR2VuZXJhdGlvbnMgPSAxO1xuICAgIHRoaXMuaWQgPSBcImNsdXN0ZXIuXCIgKyBEYXRhQ2x1c3Rlci5jbHVzdGVyQ291bnQ7XG4gICAgdGhpcy5uYW1lID0gXCJDdXN0b21lcnMgREJcIjtcbiAgICB0aGlzLnN0YXRlID0gXCJhY3RpdmVcIjtcbiAgICB0aGlzLnN0YXR1cyA9IFwib25saW5lXCI7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zZXJ2aWNlVHlwZSA9IFwibXlzcWwtZGJcIjtcbiAgICB0aGlzLmNhdGVnb3J5ID0gXCJkYXRhXCI7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHRydWU7XG4gICAgdGhpcy5hZG1pblBhdGggPSBcIi9zb21lL3BhdGgvdG8vYWRtaW5cIjtcbiAgICB0aGlzLnVyaSA9IHRoaXMuaWQ7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuY2x1c3RlclNoYXBlSXMgPSAnZGF0YS1zaW5nbGUnO1xuICAgIHRoaXMuY2x1c3RlclNoYXBlQ2FuQmUgPSBjbG9iYmVyc2hpbS5nZXRDbHVzdGVyUG90ZW50aWFsKGZhbHNlKTtcbiAgICB0aGlzLnRvcG9sb2d5ID0gJ2NsdXN0ZXInO1xuICAgIHRoaXMudHVubmVsQ3JlZGVudGlhbHMgPSB7XG4gICAgICBob3N0OiBcIjEyNy4wLjAuMVwiLFxuICAgICAgcG9ydDogXCJwcm92aWRlZCBpbiB0dW5uZWwgY29tbWFuZCBvdXRwdXRcIlxuICAgIH07XG4gICAgZm9yIChpID0gaiA9IDEsIHJlZiA9IHRvdGFsR2VuZXJhdGlvbnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBnZW5lcmF0aW9uID0ge1xuICAgICAgICBpZDogXCJkYi5tYWluLmdlblwiICsgaSxcbiAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgaW5zdGFuY2VzOiBbXVxuICAgICAgfTtcbiAgICAgIHJvbGVzID0gWydwcmltYXJ5JywgJ3NlY29uZGFyeScsICdhcmJpdGVyJ107XG4gICAgICBmb3IgKGkgPSBrID0gMCwgbGVuID0gcm9sZXMubGVuZ3RoOyBrIDwgbGVuOyBpID0gKytrKSB7XG4gICAgICAgIHJvbGUgPSByb2xlc1tpXTtcbiAgICAgICAgZ2VuZXJhdGlvbi5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgaG9zdElkOiBcImRvLlwiICsgaSxcbiAgICAgICAgICBob3N0TmFtZTogXCJkby5cIiArIGksXG4gICAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgc2VydmVyU3BlY3NJZDogXCJkMTZcIixcbiAgICAgICAgICBydW5uaW5nOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIERhdGFDbHVzdGVyLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICB1aWQ6IHRoaXMuaWQsXG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBydW5uaW5nOiB0aGlzLnJ1bm5pbmcsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgZ2VuZXJhdGlvbnM6IHRoaXMuZ2VuZXJhdGlvbnMsXG4gICAgICBzZXJ2aWNlVHlwZTogdGhpcy5zZXJ2aWNlVHlwZSxcbiAgICAgIGFkbWluUGF0aDogdGhpcy5hZG1pblBhdGgsXG4gICAgICB1cmk6IHRoaXMudXJpLFxuICAgICAgY2x1c3RlclNoYXBlSXM6IHRoaXMuY2x1c3RlclNoYXBlSXMsXG4gICAgICBjbHVzdGVyU2hhcGVDYW5CZTogdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSxcbiAgICAgIHRvcG9sb2d5OiB0aGlzLnRvcG9sb2d5LFxuICAgICAgdHVubmVsQ3JlZGVudGlhbHM6IHRoaXMudHVubmVsQ3JlZGVudGlhbHNcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBEYXRhQ2x1c3RlcjtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIENsb2JiZXJCb3hEYXRhU2hpbSwgRGF0YUNsdXN0ZXIsIEdlbmVyYXRpb24sIEhvcml6Q2x1c3RlciwgSG9zdCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcGxhdGZvcm0tY29tcG9uZW50Jyk7XG5cbkhvc3QgPSByZXF1aXJlKCcuL2hvc3QnKTtcblxuSG9yaXpDbHVzdGVyID0gcmVxdWlyZSgnLi9ob3Jpei1jbHVzdGVyJyk7XG5cbkRhdGFDbHVzdGVyID0gcmVxdWlyZSgnLi9kYXRhLWNsdXN0ZXInKTtcblxuR2VuZXJhdGlvbiA9IHJlcXVpcmUoJy4vZ2VuZXJhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2JiZXJCb3hEYXRhU2hpbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveERhdGFTaGltKCkge1xuICAgIHdpbmRvdy5jbG9iYmVyc2hpbSA9IHtcbiAgICAgIGdldENsdXN0ZXJQb3RlbnRpYWw6IHRoaXMuZ2V0Q2x1c3RlclBvdGVudGlhbFxuICAgIH07XG4gIH1cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEhvc3QgPSBmdW5jdGlvbihtYWtlTG90c09mQ29tcG9uZW50cykge1xuICAgIGlmIChtYWtlTG90c09mQ29tcG9uZW50cyA9PSBudWxsKSB7XG4gICAgICBtYWtlTG90c09mQ29tcG9uZW50cyA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEhvc3QobWFrZUxvdHNPZkNvbXBvbmVudHMpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0SG9yaXpDbHVzdGVyID0gZnVuY3Rpb24odG90YWxNZW1iZXJzKSB7XG4gICAgcmV0dXJuIG5ldyBIb3JpekNsdXN0ZXIodG90YWxNZW1iZXJzKTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldERhdGFDbHVzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhQ2x1c3RlcigpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0QXBwQ29tcG9uZW50ID0gZnVuY3Rpb24oa2luZCwgdHlwZSwgc2NhbGVzSG9yaXpvbnRhbGx5LCBzY2FsZXNSZWR1bmQsIHVyaSkge1xuICAgIHJldHVybiBuZXcgQXBwQ29tcG9uZW50KGtpbmQsIHR5cGUsIHNjYWxlc0hvcml6b250YWxseSwgc2NhbGVzUmVkdW5kLCB1cmkpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0UGxhdGZvcm1Db21wb25lbnQgPSBmdW5jdGlvbihpZCwga2luZCkge1xuICAgIHJldHVybiBuZXcgUGxhdGZvcm1Db21wb25lbnQoaWQsIGtpbmQpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0R2VuZXJhdGlvbiA9IGZ1bmN0aW9uKHBhcmVudElkLCBzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgR2VuZXJhdGlvbihwYXJlbnRJZCwgc3RhdGUpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUucmVzZXRDb3VudHMgPSBmdW5jdGlvbigpIHtcbiAgICBIb3N0Lmhvc3RDb3VudCA9IDA7XG4gICAgQXBwQ29tcG9uZW50LmFwcENvbXBvbmVudENvdW50ID0gMDtcbiAgICBIb3JpekNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcbiAgICByZXR1cm4gRGF0YUNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldENsdXN0ZXJQb3RlbnRpYWwgPSBmdW5jdGlvbihzY2FsZXNIb3Jpem9udGFsbHkpIHtcbiAgICBpZiAoc2NhbGVzSG9yaXpvbnRhbGx5KSB7XG4gICAgICByZXR1cm4gWydob3Jpem9udGFsJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbJ2RhdGEtc2luZ2xlJ107XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBDbG9iYmVyQm94RGF0YVNoaW07XG5cbn0pKCk7XG4iLCJ2YXIgR2VuZXJhdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0aW9uID0gKGZ1bmN0aW9uKCkge1xuICBHZW5lcmF0aW9uLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEdlbmVyYXRpb24ocGFyZW50SWQsIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmlkID0gcGFyZW50SWQgKyBcIi5nZW5cIiArIChHZW5lcmF0aW9uLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQrKyk7XG4gIH1cblxuICBHZW5lcmF0aW9uLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBpZDogdGhpcy5pZFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEdlbmVyYXRpb247XG5cbn0pKCk7XG4iLCJ2YXIgSG9yaXpDbHVzdGVyLCBIb3N0O1xuXG5Ib3N0ID0gcmVxdWlyZSgnLi9ob3N0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9yaXpDbHVzdGVyID0gKGZ1bmN0aW9uKCkge1xuICBIb3JpekNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcblxuICBmdW5jdGlvbiBIb3JpekNsdXN0ZXIodG90YWxNZW1iZXJzLCB0b3RhbEdlbmVyYXRpb25zKSB7XG4gICAgdmFyIGdlbmVyYXRpb24sIGksIGosIGssIHJlZiwgcmVmMTtcbiAgICBpZiAodG90YWxNZW1iZXJzID09IG51bGwpIHtcbiAgICAgIHRvdGFsTWVtYmVycyA9IDQ7XG4gICAgfVxuICAgIGlmICh0b3RhbEdlbmVyYXRpb25zID09IG51bGwpIHtcbiAgICAgIHRvdGFsR2VuZXJhdGlvbnMgPSAxO1xuICAgIH1cbiAgICB0aGlzLmlkID0gXCJjbHVzdGVyLlwiICsgSG9yaXpDbHVzdGVyLmNsdXN0ZXJDb3VudDtcbiAgICB0aGlzLm5hbWUgPSBcIk1haW4gQXBwXCI7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXRlID0gXCJhY3RpdmVcIjtcbiAgICB0aGlzLnN0YXR1cyA9IFwib25saW5lXCI7XG4gICAgdGhpcy5zZXJ2aWNlVHlwZSA9IFwiZ29sYW5nXCI7XG4gICAgdGhpcy5jYXRlZ29yeSA9IFwid2ViXCI7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHRydWU7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWRtaW5QYXRoID0gXCIvc29tZS9wYXRoL3RvL2FkbWluXCI7XG4gICAgdGhpcy51cmkgPSB0aGlzLmlkO1xuICAgIHRoaXMuY2x1c3RlclNoYXBlSXMgPSAnaG9yaXpvbnRhbCc7XG4gICAgdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSA9IGNsb2JiZXJzaGltLmdldENsdXN0ZXJQb3RlbnRpYWwodHJ1ZSk7XG4gICAgdGhpcy50b3BvbG9neSA9ICdjbHVzdGVyJztcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxHZW5lcmF0aW9uczsgMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmOyBpID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGdlbmVyYXRpb24gPSB7XG4gICAgICAgIGlkOiBcIndlYi5tYWluLmdlblwiICsgaSxcbiAgICAgICAgc3RhdGU6ICdhY3RpdmUnLFxuICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgIGluc3RhbmNlczogW11cbiAgICAgIH07XG4gICAgICBmb3IgKGkgPSBrID0gMSwgcmVmMSA9IHRvdGFsTWVtYmVyczsgMSA8PSByZWYxID8gayA8PSByZWYxIDogayA+PSByZWYxOyBpID0gMSA8PSByZWYxID8gKytrIDogLS1rKSB7XG4gICAgICAgIGdlbmVyYXRpb24uaW5zdGFuY2VzLnB1c2goe1xuICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgIGhvc3RJZDogXCJkby5cIiArIGksXG4gICAgICAgICAgaG9zdE5hbWU6IFwiZG8uXCIgKyBpLFxuICAgICAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgICByb2xlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICBzZXJ2ZXJTcGVjc0lkOiBcImQxNlwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIEhvcml6Q2x1c3Rlci5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgdWlkOiB0aGlzLmlkLFxuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBydW5uaW5nOiB0aGlzLnJ1bm5pbmcsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgc2NhbGVzSG9yaXo6IHRoaXMuc2NhbGVzSG9yaXosXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgc2NhbGVzUmVkdW5kOiB0aGlzLnNjYWxlc1JlZHVuZCxcbiAgICAgIGdlbmVyYXRpb25zOiB0aGlzLmdlbmVyYXRpb25zLFxuICAgICAgc2VydmljZVR5cGU6IHRoaXMuc2VydmljZVR5cGUsXG4gICAgICBhZG1pblBhdGg6IHRoaXMuYWRtaW5QYXRoLFxuICAgICAgdXJpOiB0aGlzLnVyaSxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgY2x1c3RlclNoYXBlSXM6IHRoaXMuY2x1c3RlclNoYXBlSXMsXG4gICAgICBjbHVzdGVyU2hhcGVDYW5CZTogdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSxcbiAgICAgIHRvcG9sb2d5OiB0aGlzLnRvcG9sb2d5XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gSG9yaXpDbHVzdGVyO1xuXG59KSgpO1xuIiwidmFyIEFwcENvbXBvbmVudCwgSG9zdCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcGxhdGZvcm0tY29tcG9uZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9zdCA9IChmdW5jdGlvbigpIHtcbiAgSG9zdC5ob3N0Q291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEhvc3QobWFrZUxvdHNPZkNvbXBvbmVudHMpIHtcbiAgICBpZiAobWFrZUxvdHNPZkNvbXBvbmVudHMgPT0gbnVsbCkge1xuICAgICAgbWFrZUxvdHNPZkNvbXBvbmVudHMgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXR1cyA9ICdvbmxpbmUnO1xuICAgIHRoaXMuaWQgPSBcImhvc3QuXCIgKyAoKytIb3N0Lmhvc3RDb3VudCk7XG4gICAgdGhpcy5uYW1lID0gXCJlYzIuXCIgKyBIb3N0Lmhvc3RDb3VudDtcbiAgICB0aGlzLnNlcnZlclNwZWNzSWQgPSBcImQxNlwiO1xuICAgIHRoaXMuYnVua2hvdXNlSWQgPSBcImJ1bmtob3VzZVwiO1xuICAgIHRoaXMuYWN0aW9uUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hY3Rpb25zXCI7XG4gICAgdGhpcy5wbGF0Zm9ybVNlcnZpY2VzID0gW25ldyBQbGF0Zm9ybUNvbXBvbmVudChcImxiXCIsIFwibWVzaFwiLCBcIm5hbm9ib3gvcG9ydGFsXCIsIHRoaXMuaWQpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJsZ1wiLCBcImxvZ2dlclwiLCBcIm5hbm9ib3gvbG9ndmFjXCIsIHRoaXMuaWQpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIm1vbml0b3JcIiwgXCJuYW5vYm94L3B1bHNlXCIsIHRoaXMuaWQpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJtclwiLCBcInB1c2hlclwiLCBcIm5hbm9ib3gvbWlzdFwiLCB0aGlzLmlkKSwgbmV3IFBsYXRmb3JtQ29tcG9uZW50KFwiZ3NcIiwgXCJ3YXJlaG91c2VcIiwgXCJuYW5vYm94L2hvYXJkZXJcIiwgdGhpcy5pZCldO1xuICAgIHRoaXMuYXBwQ29tcG9uZW50cyA9IFtdO1xuICAgIHRoaXMuY3JlYXRlQ29tcG9uZW50cyhtYWtlTG90c09mQ29tcG9uZW50cyk7XG4gIH1cblxuICBIb3N0LnByb3RvdHlwZS5jcmVhdGVDb21wb25lbnRzID0gZnVuY3Rpb24obWFrZUxvdHNPZkNvbXBvbmVudHMpIHtcbiAgICBpZiAoIW1ha2VMb3RzT2ZDb21wb25lbnRzKSB7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3RvbG1hcmszJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ21vbmdvMTInLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAnbW9uZ28tZW5naW5lJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdub2RlLWVuZ2luZScsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdtZW1jYWNoZWQtZW5naW5lJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3B5dGhvbi1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnc3RvcmFnZS1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnamF2YS1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAncGhwLWVuZ2luZScsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ2NvdWNoLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdtYXJpYS1lbmdpbmUnLCBmYWxzZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAncG9zdGdyZXMtZW5naW5lJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ3JlZGlzLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdwZXJjb25hLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnc29tZXJhbmRvbWRiJywgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ25vdGhpbmd3aWxsbWF0Y2gnLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIEhvc3QucHJvdG90eXBlLmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUsIGlzSG9yaXpvbnRhbGx5U2NhbGFibGUsIGlzUmVkdW5kU2NhbGFibGUpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBDb21wb25lbnRzLnB1c2gobmV3IEFwcENvbXBvbmVudChraW5kLCB0eXBlLCBpc0hvcml6b250YWxseVNjYWxhYmxlLCBpc1JlZHVuZFNjYWxhYmxlLCB0aGlzLmlkKSk7XG4gIH07XG5cbiAgSG9zdC5wcm90b3R5cGUuc2VyaWFsaXplQ29tcG9uZW50cyA9IGZ1bmN0aW9uKGNvbXBvbmVudHMpIHtcbiAgICB2YXIgYXIsIGNvbXBvbmVudCwgaSwgbGVuO1xuICAgIGFyID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY29tcG9uZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50ID0gY29tcG9uZW50c1tpXTtcbiAgICAgIGFyLnB1c2goY29tcG9uZW50LnNlcmlhbGl6ZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyO1xuICB9O1xuXG4gIEhvc3QucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIHJ1bm5pbmc6IHRoaXMucnVubmluZyxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIHNlcnZlclNwZWNzSWQ6IHRoaXMuc2VydmVyU3BlY3NJZCxcbiAgICAgIGJ1bmtob3VzZUlkOiB0aGlzLmJ1bmtob3VzZUlkLFxuICAgICAgYWN0aW9uUGF0aDogdGhpcy5hY3Rpb25QYXRoLFxuICAgICAgcGxhdGZvcm1TZXJ2aWNlczogdGhpcy5zZXJpYWxpemVDb21wb25lbnRzKHRoaXMucGxhdGZvcm1TZXJ2aWNlcyksXG4gICAgICBhcHBDb21wb25lbnRzOiB0aGlzLnNlcmlhbGl6ZUNvbXBvbmVudHModGhpcy5hcHBDb21wb25lbnRzKVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEhvc3Q7XG5cbn0pKCk7XG4iLCJ2YXIgQXBwQ29tcG9uZW50LCBQbGF0Zm9ybUNvbXBvbmVudDtcblxuQXBwQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9hcHAtY29tcG9uZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGxhdGZvcm1Db21wb25lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFBsYXRmb3JtQ29tcG9uZW50KGlkLCBraW5kLCBjb21wb25lbnRLaW5kLCBob3N0SWQpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5raW5kID0ga2luZDtcbiAgICBpZiAoY29tcG9uZW50S2luZCA9PSBudWxsKSB7XG4gICAgICBjb21wb25lbnRLaW5kID0gJ21pc3QnO1xuICAgIH1cbiAgICB0aGlzLmlzU3BsaXRhYmxlID0gdHJ1ZTtcbiAgICB0aGlzLm1vZGUgPSAnc2ltcGxlJztcbiAgICB0aGlzLmFkbWluUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hZG1pblwiO1xuICAgIHRoaXMuY29tcG9uZW50cyA9IFtuZXcgQXBwQ29tcG9uZW50KCd3ZWInLCBjb21wb25lbnRLaW5kLCB0cnVlLCB0cnVlLCBob3N0SWQpLnNlcmlhbGl6ZSgpXTtcbiAgfVxuXG4gIFBsYXRmb3JtQ29tcG9uZW50LnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBraW5kOiB0aGlzLmtpbmQsXG4gICAgICBpc1NwbGl0YWJsZTogdGhpcy5pc1NwbGl0YWJsZSxcbiAgICAgIG1vZGU6IHRoaXMubW9kZSxcbiAgICAgIGNvbXBvbmVudHM6IHRoaXMuY29tcG9uZW50cyxcbiAgICAgIHN0YXR1czogJ29ubGluZSdcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBQbGF0Zm9ybUNvbXBvbmVudDtcblxufSkoKTtcblxuKHtcbiAgaWQ6IFwibG9nZ2VyMVwiLFxuICBraW5kOiBcIm1lc2hcIixcbiAgbW9kZTogXCJzaW1wbGVcIixcbiAgaXNTcGxpdGFibGU6IHRydWUsXG4gIGNvbXBvbmVudHM6IFtcbiAgICB7XG4gICAgICBpZDogXCI5ZTYzZDcwMC1jODRlLTQ1ZWQtYmExNS1lZDE5MmZjZjkyYjJcIixcbiAgICAgIHVpZDogXCJkYXRhLnBvcnRhbFwiLFxuICAgICAgbmFtZTogXCJsdWNreS1saW1lXCIsXG4gICAgICBzdGF0ZTogXCJjcmVhdGVkXCIsXG4gICAgICBzZXJ2aWNlVHlwZTogXCJkZWZhdWx0LWRiXCIsXG4gICAgICBzY2FsZXNIb3JpejogZmFsc2UsXG4gICAgICBzY2FsZXNSZWR1bmQ6IGZhbHNlLFxuICAgICAgaXNTcGxpdGFibGU6IHRydWUsXG4gICAgICBnZW5lcmF0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IFwiZGF0YS5wb3J0YWwuZ2VuMVwiLFxuICAgICAgICAgIHN0YXRlOiBcImNyZWF0ZWRcIixcbiAgICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgICAgaW5zdGFuY2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICBob3N0SWQ6IFwidGVzdC1ob3N0LW5hbWVcIixcbiAgICAgICAgICAgICAgaG9zdE5hbWU6IFwidGVzdC1ob3N0LW5hbWVcIixcbiAgICAgICAgICAgICAgc3RhdGU6IFwiY3JlYXRlZFwiLFxuICAgICAgICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgICAgICAgIHJvbGU6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgICBzZXJ2ZXJTcGVjc0lkOiBcIjUxMm1iXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn0pO1xuIiwidmFyICRob2xkZXIsIENsb2JiZXJCb3hEYXRhU2hpbSwgVUksIGJveGVzO1xuXG5VSSA9IHJlcXVpcmUoJy4vdGVzdC11aS91aScpO1xuXG5DbG9iYmVyQm94RGF0YVNoaW0gPSByZXF1aXJlKCcuL3NoaW1zL2RhdGEtc2hpbScpO1xuXG53aW5kb3cuY2xvYmJlckJveERhdGFTaGltID0gbmV3IENsb2JiZXJCb3hEYXRhU2hpbSgpO1xuXG5ib3hlcyA9IFtdO1xuXG4kaG9sZGVyID0gJChcIi5ob2xkZXJcIik7XG5cbm5hbm9ib3gubm9EZXBsb3lzID0gZmFsc2U7XG5cbm5hbm9ib3guYXBwTmFtZSA9ICdmaXNoZmVhdGhlcic7XG5cbm5hbm9ib3guZnFBcHBOYW1lID0gJ2Zsb2NrL2Zpc2hmZWF0aGVyJztcblxud2luZG93LmluaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZGRFdmVudExpc3RlbmVycywgZ2V0Qm94LCBnZXRQYXJlbnRPZkNvbXBvbmVudCwgZ2V0UGFyZW50T2ZHZW5lcmF0aW9uLCByZW1vdmVCb3gsIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucywgdWk7XG4gICAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgICB1aSA9IG5ldyBVSSgkKCdib2R5JykpO1xuICAgIHdpbmRvdy5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oY29tcG9uZW50SWQsIHN0YXRlKSB7XG4gICAgICB2YXIgZ2VuRGF0YTtcbiAgICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlID0gJ3Byb3Zpc2lvbmluZyc7XG4gICAgICB9XG4gICAgICBnZW5EYXRhID0gY2xvYmJlckJveERhdGFTaGltLmdldEdlbmVyYXRpb24oY29tcG9uZW50SWQsIHN0YXRlKS5zZXJpYWxpemUoKTtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkNvbXBvbmVudChjb21wb25lbnRJZCkuYWRkR2VuZXJhdGlvbihjb21wb25lbnRJZCwgZ2VuRGF0YSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oaG9zdElkKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGhvc3RJZCkuYWRkQ29tcG9uZW50KGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRBcHBDb21wb25lbnQoKS5zZXJpYWxpemUoKSk7XG4gICAgfTtcbiAgICB3aW5kb3cucmVtb3ZlQ29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50SWQpIHtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkNvbXBvbmVudChjb21wb25lbnRJZCkucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudElkKTtcbiAgICB9O1xuICAgIHdpbmRvdy5yZW1vdmVHZW5lcmF0aW9uID0gZnVuY3Rpb24oZ2VuZXJhdGlvbklkKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZHZW5lcmF0aW9uKGdlbmVyYXRpb25JZCkucmVtb3ZlR2VuZXJhdGlvbihnZW5lcmF0aW9uSWQpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEhvc3QgPSBmdW5jdGlvbihsb3RzT2ZJY29ucykge1xuICAgICAgdmFyIGhvc3RCb3g7XG4gICAgICBob3N0Qm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgICAgaG9zdEJveC5idWlsZCgkaG9sZGVyLCBuYW5vYm94LkNsb2JiZXJCb3guSE9TVCwgY2xvYmJlckJveERhdGFTaGltLmdldEhvc3QobG90c09mSWNvbnMpLnNlcmlhbGl6ZSgpKTtcbiAgICAgIHJldHVybiB1aS5ub3RlQ29tcG9uZW50cyhob3N0Qm94KTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRDbHVzdGVyID0gZnVuY3Rpb24oY2x1c3RlckRhdGEpIHtcbiAgICAgIHZhciBjbHVzdGVyQm94LCBkYXRhLCBnZW5lcmF0aW9uLCBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IGNsdXN0ZXJEYXRhLmdlbmVyYXRpb25zO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGdlbmVyYXRpb24gPSByZWZbal07XG4gICAgICAgIGRhdGEgPSBuYW5vYm94LkNsb2JiZXJCb3guam9pbkNsdXN0ZXJEYXRhKGNsdXN0ZXJEYXRhLCBnZW5lcmF0aW9uKTtcbiAgICAgICAgY2x1c3RlckJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGNsdXN0ZXJCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkNMVVNURVIsIGRhdGEpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG4gICAgd2luZG93LnNldFN0YXRlID0gZnVuY3Rpb24oaWQsIHN0YXRlKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGlkKS5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgfTtcbiAgICB3aW5kb3cubWFuYWdlQ29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50SWQpIHtcbiAgICAgIHZhciBib3gsIGJveEhvc3QsIHg7XG4gICAgICBib3ggPSBnZXRCb3goY29tcG9uZW50SWQpO1xuICAgICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICAgIHggPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBib3hIb3N0ID0gZ2V0UGFyZW50T2ZDb21wb25lbnQoKTtcbiAgICAgIGlmIChib3hIb3N0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHggPSAwO1xuICAgICAgfVxuICAgIH07XG4gICAgd2luZG93LnNldEdlbmVyYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgICAgcmV0dXJuIGdldFBhcmVudE9mR2VuZXJhdGlvbihpZCkuc2V0R2VuZXJhdGlvblN0YXRlKGlkLCBzdGF0ZSk7XG4gICAgfTtcbiAgICB3aW5kb3cuc2V0R2VuZXJhdGlvblN0YXR1cyA9IGZ1bmN0aW9uKGlkLCBzdGF0dXMpIHtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkdlbmVyYXRpb24oaWQpLnNldEdlbmVyYXRpb25TdGF0dXMoaWQsIHN0YXR1cyk7XG4gICAgfTtcbiAgICBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NDQUxFLkdFVF9PUFRJT05TJywgZnVuY3Rpb24obSwgY2IpIHtcbiAgICAgICAgcmV0dXJuIGNiKHNjYWxlTWFjaGluZVRlc3REYXRhLmdldEhvc3RPcHRpb25zKCkpO1xuICAgICAgfSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdHRVRfQlVOS0hPVVNFUycsIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuY2IoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBcImFcIixcbiAgICAgICAgICAgIG5hbWU6IFwiRUMyIDFcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWUsXG4gICAgICAgICAgICBzdGF0ZTogJ2FjdGl2ZSdcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBpZDogXCJjXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkVDMiAzXCIsXG4gICAgICAgICAgICBzdGF0ZTogXCJhY3RpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9KTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1JFR0lTVEVSJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgICByZXR1cm4gYm94ZXMucHVzaChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnVU5SRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgICAgcmV0dXJuIHJlbW92ZUJveChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0NBTEUuU0FWRScsIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXcgU2NhbGU6XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuc3VibWl0Q2IoKTtcbiAgICAgIH0pO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU1BMSVQuU0FWRScsIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTcGxpdDpcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICByZXR1cm4gZGF0YS5zdWJtaXRDYigpO1xuICAgICAgfSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdIT1NULlJVTi1BQ1RJT04nLCBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBob3N0IGFjdGlvbiBgXCIgKyBkYXRhLmFjdGlvbiArIFwiYCBvbiBob3N0IGBcIiArIGRhdGEuaG9zdElkICsgXCJgXCIpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChkYXRhLm9uQ29tcGxldGUsIE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ0NPTVBPTkVOVC5SVU4tQUNUSU9OJywgZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgY29tcG9uZW50IGFjdGlvbiBgXCIgKyBkYXRhLmFjdGlvbiArIFwiYCBvbiBjb21wb25lbnQgYFwiICsgZGF0YS5jb21wb25lbnRJZCArIFwiYFwiKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZGF0YS5vbkNvbXBsZXRlLCBNYXRoLnJhbmRvbSgpICogMTAwMCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGFkZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkFQUF9DT01QT05FTlRTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEJveChkYXRhLnVyaSkuc3dpdGNoU3ViQ29udGVudCgnYXBwLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuUExBVEZPUk1fQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ3BsYXRmb3JtLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuSE9TVC1JTlRBTkNFUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ2hvc3QtaW5zdGFuY2VzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlNDQUxFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEJveChkYXRhLnVyaSkuc3dpdGNoU3ViQ29udGVudCgnc2NhbGUtbWFjaGluZScsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TVEFUUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ3N0YXRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkNPTlNPTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCdjb25zb2xlJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlRVTk5FTCcsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ3R1bm5lbCcsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TUExJVCcsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ3NwbGl0JywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BRE1JTicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ2FkbWluJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcbiAgICBnZXRCb3ggPSBmdW5jdGlvbih1cmkpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAodXJpID09PSBib3gudXJpKSB7XG4gICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0UGFyZW50T2ZDb21wb25lbnQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIGJveCwgaiwgbGVuO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gYm94ZXNbal07XG4gICAgICAgIGlmIChib3guaGFzQ29tcG9uZW50V2l0aElkKGlkKSkge1xuICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFBhcmVudE9mR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW47XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBib3ggPSBib3hlc1tqXTtcbiAgICAgICAgaWYgKGJveC5oYXNHZW5lcmF0aW9uV2l0aElkKGlkKSkge1xuICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbW92ZUJveCA9IGZ1bmN0aW9uKGRvb21lZEJveCkge1xuICAgICAgdmFyIGJveCwgaSwgaiwgbGVuO1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBib3ggPSBib3hlc1tpXTtcbiAgICAgICAgaWYgKGJveC5pZCA9PT0gZG9vbWVkQm94LmlkKSB7XG4gICAgICAgICAgYm94ZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgc3Vic2NyaWJlVG9SZWdpc3RyYXRpb25zKCk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBuYW5vYm94Lm5vRGVwbG95cyA9IHRydWU7XG4gICAgbmFub2JveC5jbG9iYmVyQ29uZmlnID0ge307XG4gICAgbmFub2JveC5jbG9iYmVyQ29uZmlnLmhvc3RBY3Rpb25zID0gW1xuICAgICAge1xuICAgICAgICBhY3Rpb246ICdkZWxldGUnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3JlYm9vdCcsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAnc3RvcCcsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAnc3RhcnQnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9XG4gICAgXTtcbiAgICBuYW5vYm94LmNsb2JiZXJDb25maWcuY29tcG9uZW50QWN0aW9ucyA9IFtcbiAgICAgIHtcbiAgICAgICAgYWN0aW9uOiAncmVmcmVzaCcsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAncmVib290JyxcbiAgICAgICAgcGVybWlzc2lvbjogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAncmVidWlsZCcsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAndXBkYXRlJyxcbiAgICAgICAgcGVybWlzc2lvbjogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBhY3Rpb246ICdtYW5hZ2UnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ2RlbGV0ZScsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAnc3RvcCcsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAnc3RhcnQnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9XG4gICAgXTtcbiAgICBhZGRIb3N0KGZhbHNlKTtcbiAgICBhZGRDbHVzdGVyKGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3JpekNsdXN0ZXIoKS5zZXJpYWxpemUoKSk7XG4gICAgYWRkQ2x1c3RlcihjbG9iYmVyQm94RGF0YVNoaW0uZ2V0RGF0YUNsdXN0ZXIoKS5zZXJpYWxpemUoKSk7XG4gICAgd2luZG93LnNldE5vRGVwbG95cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGdldEJveChcImhvc3QuMVwiKS5zZXRSZWFkaW5lc3NTdGF0ZSgnbm8tZGVwbG95cycsICdsZWdhY3knKTtcbiAgICB9O1xuICAgIHdpbmRvdy5zZXRQbGF0Zm9ybUJ1aWxkaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KFwiaG9zdC4xXCIpLnNldFJlYWRpbmVzc1N0YXRlKCdwbGF0Zm9ybS1idWlsZGluZycpO1xuICAgIH07XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wb25lbnREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KFwiaG9zdC4xXCIpLmdldERhdGFGb3JVc2FnZUJyZWFrZG93bigpO1xuICAgIH07XG4gIH07XG59KSh0aGlzKTtcbiIsInZhciBVSTtcblxubW9kdWxlLmV4cG9ydHMgPSBVSSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVUkoKSB7XG4gICAgdGhpcy5pbml0U3RhdGVTZWxlY3RvcigkKFwiLnN0YXRlc1wiKSk7XG4gICAgdGhpcy5pbml0RXZlbnRzKCk7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdGVyQm94KGJveCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuXG4gIFVJLnByb3RvdHlwZS5yZWdpc3RlckJveCA9IGZ1bmN0aW9uKGJveCkge1xuICAgIGlmIChib3guZGF0YS5pZC5pbmNsdWRlcygnZ2VuJykpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnLmdlbmVyYXRpb25zJywgJy51aS1zaGltJyksIGJveCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnLmhvc3RzJywgJy51aS1zaGltJyksIGJveCk7XG4gICAgfVxuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5hZGRUb1NlbGVjdG9yID0gZnVuY3Rpb24oJHNlbGVjdG9yLCBib3gpIHtcbiAgICBpZiAoJChcIm9wdGlvblt2YWx1ZT0nXCIgKyBib3guZGF0YS5pZCArIFwiJ11cIiwgJHNlbGVjdG9yKS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuICRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGJveC5kYXRhLmlkICsgXCInPlwiICsgYm94LmRhdGEuaWQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgfTtcblxuICBVSS5wcm90b3R5cGUuaW5pdFN0YXRlU2VsZWN0b3IgPSBmdW5jdGlvbigkc2VsZWN0b3IpIHtcbiAgICB2YXIgaSwgbGVuLCByZXN1bHRzLCBzdGF0ZSwgc3RhdGVzO1xuICAgIHN0YXRlcyA9IFsnJywgJ2NyZWF0ZWQnLCAnaW5pdGlhbGl6ZWQnLCAnb3JkZXJlZCcsICdwcm92aXNpb25pbmcnLCAnZGVmdW5jdCcsICdhY3RpdmUnLCAnZGVjb21pc3Npb25pbmcnLCAnZGVzdHJveScsICdhcmNoaXZlZCddO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0YXRlID0gc3RhdGVzW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKCRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHN0YXRlICsgXCInPlwiICsgc3RhdGUgKyBcIjwvb3B0aW9uPlwiKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgJChcImJ1dHRvbiNob3N0c1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2hvc3RzLXN0YXRlLXNlbGVjdG9yXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjaG9zdC1zdGF0ZXNcIikudmFsKCk7XG4gICAgICAgIHJldHVybiBzZXRTdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNnZW5lcmF0aW9uc1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2dlbmVyYXRpb25zLXN0YXRlLXNlbGVjdG9yXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjZ2VuLXN0YXRlc1wiKS52YWwoKTtcbiAgICAgICAgcmV0dXJuIHNldEdlbmVyYXRpb25TdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNnZW4tc3RhdHVzLWdvXCIpLm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWQsIHN0YXR1cztcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2dlbmVyYXRpb25zLXN0YXR1cy1zZWxlY3RvclwiKS52YWwoKTtcbiAgICAgICAgc3RhdHVzID0gJChcInNlbGVjdCNnZW4tc3RhdHVzXCIpLnZhbCgpO1xuICAgICAgICByZXR1cm4gc2V0R2VuZXJhdGlvblN0YXR1cyhpZCwgc3RhdHVzKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgICQoXCJidXR0b24jYWRkLWdlbmVyYXRpb25cIikub24oJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhZGRHZW5lcmF0aW9uKCQoXCJzZWxlY3QjYWRkLWdlbmVyYXRpb24tc2VsZWN0XCIpLnZhbCgpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgICQoXCJidXR0b24jcmVtb3ZlLWdlbmVyYXRpb25cIikub24oJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVHZW5lcmF0aW9uKCQoXCJzZWxlY3QjcmVtb3ZlLWdlbmVyYXRpb24tc2VsZWN0XCIpLnZhbCgpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgICQoXCJidXR0b24jYWRkLWNvbXBvbmVudFwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFkZENvbXBvbmVudCgkKFwic2VsZWN0I2FkZC1jb21wb25lbnQtc2VsZWN0XCIpLnZhbCgpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiAkKFwiYnV0dG9uI3JlbW92ZS1jb21wb25lbnRcIikub24oJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVDb21wb25lbnQoJChcInNlbGVjdCNyZW1vdmUtY29tcG9uZW50LXNlbGVjdFwiKS52YWwoKSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBVSS5wcm90b3R5cGUubm90ZUNvbXBvbmVudHMgPSBmdW5jdGlvbihib3gpIHtcbiAgICB2YXIgJHNlbGVjdG9yLCBjb21wb25lbnQsIGksIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICRzZWxlY3RvciA9ICQoXCJzZWxlY3QuY29tcG9uZW50c1wiKTtcbiAgICByZWYgPSBib3guZGF0YS5hcHBDb21wb25lbnRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudCA9IHJlZltpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgkc2VsZWN0b3IuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyBjb21wb25lbnQuaWQgKyBcIic+XCIgKyBjb21wb25lbnQuaWQgKyBcIjwvb3B0aW9uPlwiKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHJldHVybiBVSTtcblxufSkoKTtcbiJdfQ==
