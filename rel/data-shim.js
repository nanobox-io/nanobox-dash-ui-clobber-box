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
    this.platformServices = [new PlatformComponent("lb", "mesh", "nanobox/portal", this.id), new PlatformComponent("lg", "logger", "nanobox/logvac", this.id), new PlatformComponent("hm", "monitor", "nanobox/pulse", this.id), new PlatformComponent("mr", "pusher", "nanobox/mist", this.id), new PlatformComponent("gs", "warehouse", "nanobox/hoarder", this.id), new PlatformComponent("gs", "warehouse", "nanobox/hoarder", this.id)];
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

nanobox.fqName = 'flock/fishfeather';

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
      return getBox("host.1").setReadinessState('no-deploys', 'nbx');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzaGltcy9hcHAtY29tcG9uZW50LmNvZmZlZSIsInNoaW1zL2RhdGEtY2x1c3Rlci5jb2ZmZWUiLCJzaGltcy9kYXRhLXNoaW0uY29mZmVlIiwic2hpbXMvZ2VuZXJhdGlvbi5jb2ZmZWUiLCJzaGltcy9ob3Jpei1jbHVzdGVyLmNvZmZlZSIsInNoaW1zL2hvc3QuY29mZmVlIiwic2hpbXMvcGxhdGZvcm0tY29tcG9uZW50LmNvZmZlZSIsInN0YWdlLmNvZmZlZSIsInRlc3QtdWkvdWkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEFwcENvbXBvbmVudDtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDb21wb25lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIEFwcENvbXBvbmVudC5hcHBDb21wb25lbnRDb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gQXBwQ29tcG9uZW50KGtpbmQsIHR5cGUsIHNjYWxlc0hvcml6b250YWxseSwgc2NhbGVzUmVkdW5kLCBob3N0SWQpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIHRoaXMudHlwZSA9IHR5cGUgIT0gbnVsbCA/IHR5cGUgOiBcInJ1YnlcIjtcbiAgICBpZiAoc2NhbGVzSG9yaXpvbnRhbGx5ID09IG51bGwpIHtcbiAgICAgIHNjYWxlc0hvcml6b250YWxseSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzY2FsZXNSZWR1bmQgPT0gbnVsbCkge1xuICAgICAgc2NhbGVzUmVkdW5kID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuZ2VuZXJhdGlvbkNvdW50ID0gMTtcbiAgICB0aGlzLnN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgdGhpcy5zdGF0dXMgPSAnb25saW5lJztcbiAgICB0aGlzLnNlcnZlclNwZWNzSWQgPSBcImIzXCI7XG4gICAgdGhpcy5pZCA9IGtpbmQgKyBcIi5cIiArICgrK0FwcENvbXBvbmVudC5hcHBDb21wb25lbnRDb3VudCk7XG4gICAgdGhpcy5uYW1lID0ga2luZCArIFwiIFwiICsgQXBwQ29tcG9uZW50LmFwcENvbXBvbmVudENvdW50O1xuICAgIHRoaXMuZ2VuZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFkbWluUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hZG1pblwiO1xuICAgIHRoaXMuYWN0aW9uUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hY3Rpb25cIjtcbiAgICB0aGlzLmNhdGVnb3J5ID0gc2NhbGVzSG9yaXpvbnRhbGx5ID8gJ3dlYicgOiAnZGF0YSc7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHNjYWxlc1JlZHVuZDtcbiAgICB0aGlzLmNsdXN0ZXJTaGFwZUlzID0gJyc7XG4gICAgdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSA9IGNsb2JiZXJzaGltLmdldENsdXN0ZXJQb3RlbnRpYWwoc2NhbGVzSG9yaXpvbnRhbGx5KTtcbiAgICB0aGlzLnRvcG9sb2d5ID0gJ2J1bmtob3VzZSc7XG4gICAgdGhpcy51cmkgPSBob3N0SWQgKyBcIi9cIiArIHRoaXMuaWQ7XG4gICAgdGhpcy5hZGRHZW5lcmF0aW9uKCk7XG4gIH1cblxuICBBcHBDb21wb25lbnQucHJvdG90eXBlLmFkZEdlbmVyYXRpb24gPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHZhciBvYmo7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ3Byb3Zpc2lvbmluZyc7XG4gICAgfVxuICAgIG9iaiA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIHN0YXR1czogJ29ubGluZScsXG4gICAgICBpZDogdGhpcy5pZCArIFwiLmdlblwiICsgKHRoaXMuZ2VuZXJhdGlvbkNvdW50KyspXG4gICAgfTtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgb2JqLnN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdlbmVyYXRpb25zLnB1c2gob2JqKTtcbiAgfTtcblxuICBBcHBDb21wb25lbnQucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB7XG4gICAgICBnZW5lcmF0aW9uczogdGhpcy5nZW5lcmF0aW9ucyxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHNlcnZlclNwZWNzSWQ6IHRoaXMuc2VydmVyU3BlY3NJZCxcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgdWlkOiB0aGlzLmlkLFxuICAgICAgc2VydmljZVR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGFkbWluUGF0aDogdGhpcy5hZG1pblBhdGgsXG4gICAgICBhY3Rpb25QYXRoOiB0aGlzLmFjdGlvblBhdGgsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgdXJpOiB0aGlzLnVyaSxcbiAgICAgIGNsdXN0ZXJTaGFwZUlzOiB0aGlzLmNsdXN0ZXJTaGFwZUlzLFxuICAgICAgY2x1c3RlclNoYXBlQ2FuQmU6IHRoaXMuY2x1c3RlclNoYXBlQ2FuQmUsXG4gICAgICB0b3BvbG9neTogdGhpcy50b3BvbG9neVxuICAgIH07XG4gICAgaWYgKHRoaXMuY2F0ZWdvcnkgPT09ICdkYXRhJykge1xuICAgICAgZGF0YS50dW5uZWxDcmVkZW50aWFscyA9IHtcbiAgICAgICAgREJfSE9TVDogJzEyNy4wLjAuMScsXG4gICAgICAgIERCX1BPUlQ6ICc0MDAwJyxcbiAgICAgICAgREJfVVNFUjogJ25hbm9ib3gnLFxuICAgICAgICBEQl9QQVNTOiAneVlCYXZjQ1VXdXonLFxuICAgICAgICBEQl9OQU1FOiAnZGF0YS5kYidcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBBcHBDb21wb25lbnQ7XG5cbn0pKCk7XG4iLCJ2YXIgRGF0YUNsdXN0ZXIsIEhvc3Q7XG5cbkhvc3QgPSByZXF1aXJlKCcuL2hvc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhQ2x1c3RlciA9IChmdW5jdGlvbigpIHtcbiAgRGF0YUNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcblxuICBmdW5jdGlvbiBEYXRhQ2x1c3RlcigpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbiwgaSwgaiwgaywgbGVuLCByZWYsIHJvbGUsIHJvbGVzLCB0b3RhbEdlbmVyYXRpb25zO1xuICAgIHRvdGFsR2VuZXJhdGlvbnMgPSAxO1xuICAgIHRoaXMuaWQgPSBcImNsdXN0ZXIuXCIgKyBEYXRhQ2x1c3Rlci5jbHVzdGVyQ291bnQ7XG4gICAgdGhpcy5uYW1lID0gXCJDdXN0b21lcnMgREJcIjtcbiAgICB0aGlzLnN0YXRlID0gXCJhY3RpdmVcIjtcbiAgICB0aGlzLnN0YXR1cyA9IFwib25saW5lXCI7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zZXJ2aWNlVHlwZSA9IFwibXlzcWwtZGJcIjtcbiAgICB0aGlzLmNhdGVnb3J5ID0gXCJkYXRhXCI7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHRydWU7XG4gICAgdGhpcy5hZG1pblBhdGggPSBcIi9zb21lL3BhdGgvdG8vYWRtaW5cIjtcbiAgICB0aGlzLnVyaSA9IHRoaXMuaWQ7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuY2x1c3RlclNoYXBlSXMgPSAnZGF0YS1zaW5nbGUnO1xuICAgIHRoaXMuY2x1c3RlclNoYXBlQ2FuQmUgPSBjbG9iYmVyc2hpbS5nZXRDbHVzdGVyUG90ZW50aWFsKGZhbHNlKTtcbiAgICB0aGlzLnRvcG9sb2d5ID0gJ2NsdXN0ZXInO1xuICAgIHRoaXMudHVubmVsQ3JlZGVudGlhbHMgPSB7XG4gICAgICBob3N0OiBcIjEyNy4wLjAuMVwiLFxuICAgICAgcG9ydDogXCJwcm92aWRlZCBpbiB0dW5uZWwgY29tbWFuZCBvdXRwdXRcIlxuICAgIH07XG4gICAgZm9yIChpID0gaiA9IDEsIHJlZiA9IHRvdGFsR2VuZXJhdGlvbnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBnZW5lcmF0aW9uID0ge1xuICAgICAgICBpZDogXCJkYi5tYWluLmdlblwiICsgaSxcbiAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgaW5zdGFuY2VzOiBbXVxuICAgICAgfTtcbiAgICAgIHJvbGVzID0gWydwcmltYXJ5JywgJ3NlY29uZGFyeScsICdhcmJpdGVyJ107XG4gICAgICBmb3IgKGkgPSBrID0gMCwgbGVuID0gcm9sZXMubGVuZ3RoOyBrIDwgbGVuOyBpID0gKytrKSB7XG4gICAgICAgIHJvbGUgPSByb2xlc1tpXTtcbiAgICAgICAgZ2VuZXJhdGlvbi5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgaG9zdElkOiBcImRvLlwiICsgaSxcbiAgICAgICAgICBob3N0TmFtZTogXCJkby5cIiArIGksXG4gICAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgc2VydmVyU3BlY3NJZDogXCJkMTZcIixcbiAgICAgICAgICBydW5uaW5nOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIERhdGFDbHVzdGVyLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICB1aWQ6IHRoaXMuaWQsXG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBydW5uaW5nOiB0aGlzLnJ1bm5pbmcsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgZ2VuZXJhdGlvbnM6IHRoaXMuZ2VuZXJhdGlvbnMsXG4gICAgICBzZXJ2aWNlVHlwZTogdGhpcy5zZXJ2aWNlVHlwZSxcbiAgICAgIGFkbWluUGF0aDogdGhpcy5hZG1pblBhdGgsXG4gICAgICB1cmk6IHRoaXMudXJpLFxuICAgICAgY2x1c3RlclNoYXBlSXM6IHRoaXMuY2x1c3RlclNoYXBlSXMsXG4gICAgICBjbHVzdGVyU2hhcGVDYW5CZTogdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSxcbiAgICAgIHRvcG9sb2d5OiB0aGlzLnRvcG9sb2d5LFxuICAgICAgdHVubmVsQ3JlZGVudGlhbHM6IHRoaXMudHVubmVsQ3JlZGVudGlhbHNcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBEYXRhQ2x1c3RlcjtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIENsb2JiZXJCb3hEYXRhU2hpbSwgRGF0YUNsdXN0ZXIsIEdlbmVyYXRpb24sIEhvcml6Q2x1c3RlciwgSG9zdCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcGxhdGZvcm0tY29tcG9uZW50Jyk7XG5cbkhvc3QgPSByZXF1aXJlKCcuL2hvc3QnKTtcblxuSG9yaXpDbHVzdGVyID0gcmVxdWlyZSgnLi9ob3Jpei1jbHVzdGVyJyk7XG5cbkRhdGFDbHVzdGVyID0gcmVxdWlyZSgnLi9kYXRhLWNsdXN0ZXInKTtcblxuR2VuZXJhdGlvbiA9IHJlcXVpcmUoJy4vZ2VuZXJhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2JiZXJCb3hEYXRhU2hpbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveERhdGFTaGltKCkge1xuICAgIHdpbmRvdy5jbG9iYmVyc2hpbSA9IHtcbiAgICAgIGdldENsdXN0ZXJQb3RlbnRpYWw6IHRoaXMuZ2V0Q2x1c3RlclBvdGVudGlhbFxuICAgIH07XG4gIH1cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEhvc3QgPSBmdW5jdGlvbihtYWtlTG90c09mQ29tcG9uZW50cykge1xuICAgIGlmIChtYWtlTG90c09mQ29tcG9uZW50cyA9PSBudWxsKSB7XG4gICAgICBtYWtlTG90c09mQ29tcG9uZW50cyA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEhvc3QobWFrZUxvdHNPZkNvbXBvbmVudHMpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0SG9yaXpDbHVzdGVyID0gZnVuY3Rpb24odG90YWxNZW1iZXJzKSB7XG4gICAgcmV0dXJuIG5ldyBIb3JpekNsdXN0ZXIodG90YWxNZW1iZXJzKTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldERhdGFDbHVzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhQ2x1c3RlcigpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0QXBwQ29tcG9uZW50ID0gZnVuY3Rpb24oa2luZCwgdHlwZSwgc2NhbGVzSG9yaXpvbnRhbGx5LCBzY2FsZXNSZWR1bmQsIHVyaSkge1xuICAgIHJldHVybiBuZXcgQXBwQ29tcG9uZW50KGtpbmQsIHR5cGUsIHNjYWxlc0hvcml6b250YWxseSwgc2NhbGVzUmVkdW5kLCB1cmkpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0UGxhdGZvcm1Db21wb25lbnQgPSBmdW5jdGlvbihpZCwga2luZCkge1xuICAgIHJldHVybiBuZXcgUGxhdGZvcm1Db21wb25lbnQoaWQsIGtpbmQpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0R2VuZXJhdGlvbiA9IGZ1bmN0aW9uKHBhcmVudElkLCBzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgR2VuZXJhdGlvbihwYXJlbnRJZCwgc3RhdGUpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUucmVzZXRDb3VudHMgPSBmdW5jdGlvbigpIHtcbiAgICBIb3N0Lmhvc3RDb3VudCA9IDA7XG4gICAgQXBwQ29tcG9uZW50LmFwcENvbXBvbmVudENvdW50ID0gMDtcbiAgICBIb3JpekNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcbiAgICByZXR1cm4gRGF0YUNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldENsdXN0ZXJQb3RlbnRpYWwgPSBmdW5jdGlvbihzY2FsZXNIb3Jpem9udGFsbHkpIHtcbiAgICBpZiAoc2NhbGVzSG9yaXpvbnRhbGx5KSB7XG4gICAgICByZXR1cm4gWydob3Jpem9udGFsJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbJ2RhdGEtc2luZ2xlJ107XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBDbG9iYmVyQm94RGF0YVNoaW07XG5cbn0pKCk7XG4iLCJ2YXIgR2VuZXJhdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0aW9uID0gKGZ1bmN0aW9uKCkge1xuICBHZW5lcmF0aW9uLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEdlbmVyYXRpb24ocGFyZW50SWQsIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmlkID0gcGFyZW50SWQgKyBcIi5nZW5cIiArIChHZW5lcmF0aW9uLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQrKyk7XG4gIH1cblxuICBHZW5lcmF0aW9uLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBpZDogdGhpcy5pZFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEdlbmVyYXRpb247XG5cbn0pKCk7XG4iLCJ2YXIgSG9yaXpDbHVzdGVyLCBIb3N0O1xuXG5Ib3N0ID0gcmVxdWlyZSgnLi9ob3N0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9yaXpDbHVzdGVyID0gKGZ1bmN0aW9uKCkge1xuICBIb3JpekNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcblxuICBmdW5jdGlvbiBIb3JpekNsdXN0ZXIodG90YWxNZW1iZXJzLCB0b3RhbEdlbmVyYXRpb25zKSB7XG4gICAgdmFyIGdlbmVyYXRpb24sIGksIGosIGssIHJlZiwgcmVmMTtcbiAgICBpZiAodG90YWxNZW1iZXJzID09IG51bGwpIHtcbiAgICAgIHRvdGFsTWVtYmVycyA9IDQ7XG4gICAgfVxuICAgIGlmICh0b3RhbEdlbmVyYXRpb25zID09IG51bGwpIHtcbiAgICAgIHRvdGFsR2VuZXJhdGlvbnMgPSAxO1xuICAgIH1cbiAgICB0aGlzLmlkID0gXCJjbHVzdGVyLlwiICsgSG9yaXpDbHVzdGVyLmNsdXN0ZXJDb3VudDtcbiAgICB0aGlzLm5hbWUgPSBcIk1haW4gQXBwXCI7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXRlID0gXCJhY3RpdmVcIjtcbiAgICB0aGlzLnN0YXR1cyA9IFwib25saW5lXCI7XG4gICAgdGhpcy5zZXJ2aWNlVHlwZSA9IFwiZ29sYW5nXCI7XG4gICAgdGhpcy5jYXRlZ29yeSA9IFwid2ViXCI7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHRydWU7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWRtaW5QYXRoID0gXCIvc29tZS9wYXRoL3RvL2FkbWluXCI7XG4gICAgdGhpcy51cmkgPSB0aGlzLmlkO1xuICAgIHRoaXMuY2x1c3RlclNoYXBlSXMgPSAnaG9yaXpvbnRhbCc7XG4gICAgdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSA9IGNsb2JiZXJzaGltLmdldENsdXN0ZXJQb3RlbnRpYWwodHJ1ZSk7XG4gICAgdGhpcy50b3BvbG9neSA9ICdjbHVzdGVyJztcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxHZW5lcmF0aW9uczsgMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmOyBpID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGdlbmVyYXRpb24gPSB7XG4gICAgICAgIGlkOiBcIndlYi5tYWluLmdlblwiICsgaSxcbiAgICAgICAgc3RhdGU6ICdhY3RpdmUnLFxuICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgIGluc3RhbmNlczogW11cbiAgICAgIH07XG4gICAgICBmb3IgKGkgPSBrID0gMSwgcmVmMSA9IHRvdGFsTWVtYmVyczsgMSA8PSByZWYxID8gayA8PSByZWYxIDogayA+PSByZWYxOyBpID0gMSA8PSByZWYxID8gKytrIDogLS1rKSB7XG4gICAgICAgIGdlbmVyYXRpb24uaW5zdGFuY2VzLnB1c2goe1xuICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgIGhvc3RJZDogXCJkby5cIiArIGksXG4gICAgICAgICAgaG9zdE5hbWU6IFwiZG8uXCIgKyBpLFxuICAgICAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgICByb2xlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICBzZXJ2ZXJTcGVjc0lkOiBcImQxNlwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIEhvcml6Q2x1c3Rlci5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgdWlkOiB0aGlzLmlkLFxuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBydW5uaW5nOiB0aGlzLnJ1bm5pbmcsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgc2NhbGVzSG9yaXo6IHRoaXMuc2NhbGVzSG9yaXosXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgc2NhbGVzUmVkdW5kOiB0aGlzLnNjYWxlc1JlZHVuZCxcbiAgICAgIGdlbmVyYXRpb25zOiB0aGlzLmdlbmVyYXRpb25zLFxuICAgICAgc2VydmljZVR5cGU6IHRoaXMuc2VydmljZVR5cGUsXG4gICAgICBhZG1pblBhdGg6IHRoaXMuYWRtaW5QYXRoLFxuICAgICAgdXJpOiB0aGlzLnVyaSxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgY2x1c3RlclNoYXBlSXM6IHRoaXMuY2x1c3RlclNoYXBlSXMsXG4gICAgICBjbHVzdGVyU2hhcGVDYW5CZTogdGhpcy5jbHVzdGVyU2hhcGVDYW5CZSxcbiAgICAgIHRvcG9sb2d5OiB0aGlzLnRvcG9sb2d5XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gSG9yaXpDbHVzdGVyO1xuXG59KSgpO1xuIiwidmFyIEFwcENvbXBvbmVudCwgSG9zdCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcGxhdGZvcm0tY29tcG9uZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9zdCA9IChmdW5jdGlvbigpIHtcbiAgSG9zdC5ob3N0Q291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEhvc3QobWFrZUxvdHNPZkNvbXBvbmVudHMpIHtcbiAgICBpZiAobWFrZUxvdHNPZkNvbXBvbmVudHMgPT0gbnVsbCkge1xuICAgICAgbWFrZUxvdHNPZkNvbXBvbmVudHMgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXR1cyA9ICdvbmxpbmUnO1xuICAgIHRoaXMuaWQgPSBcImhvc3QuXCIgKyAoKytIb3N0Lmhvc3RDb3VudCk7XG4gICAgdGhpcy5uYW1lID0gXCJlYzIuXCIgKyBIb3N0Lmhvc3RDb3VudDtcbiAgICB0aGlzLnNlcnZlclNwZWNzSWQgPSBcImQxNlwiO1xuICAgIHRoaXMuYnVua2hvdXNlSWQgPSBcImJ1bmtob3VzZVwiO1xuICAgIHRoaXMuYWN0aW9uUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hY3Rpb25zXCI7XG4gICAgdGhpcy5wbGF0Zm9ybVNlcnZpY2VzID0gW25ldyBQbGF0Zm9ybUNvbXBvbmVudChcImxiXCIsIFwibWVzaFwiLCBcIm5hbm9ib3gvcG9ydGFsXCIsIHRoaXMuaWQpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJsZ1wiLCBcImxvZ2dlclwiLCBcIm5hbm9ib3gvbG9ndmFjXCIsIHRoaXMuaWQpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIm1vbml0b3JcIiwgXCJuYW5vYm94L3B1bHNlXCIsIHRoaXMuaWQpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJtclwiLCBcInB1c2hlclwiLCBcIm5hbm9ib3gvbWlzdFwiLCB0aGlzLmlkKSwgbmV3IFBsYXRmb3JtQ29tcG9uZW50KFwiZ3NcIiwgXCJ3YXJlaG91c2VcIiwgXCJuYW5vYm94L2hvYXJkZXJcIiwgdGhpcy5pZCksIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChcImdzXCIsIFwid2FyZWhvdXNlXCIsIFwibmFub2JveC9ob2FyZGVyXCIsIHRoaXMuaWQpXTtcbiAgICB0aGlzLmFwcENvbXBvbmVudHMgPSBbXTtcbiAgICB0aGlzLmNyZWF0ZUNvbXBvbmVudHMobWFrZUxvdHNPZkNvbXBvbmVudHMpO1xuICB9XG5cbiAgSG9zdC5wcm90b3R5cGUuY3JlYXRlQ29tcG9uZW50cyA9IGZ1bmN0aW9uKG1ha2VMb3RzT2ZDb21wb25lbnRzKSB7XG4gICAgaWYgKCFtYWtlTG90c09mQ29tcG9uZW50cykge1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICd0b2xtYXJrMycsIHRydWUsIHRydWUpO1xuICAgICAgcmV0dXJuIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdtb25nbzEyJywgZmFsc2UsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ21vbmdvLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnbm9kZS1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnbWVtY2FjaGVkLWVuZ2luZScsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdweXRob24tZW5naW5lJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3N0b3JhZ2UtZW5naW5lJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ2phdmEtZW5naW5lJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3BocC1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdjb3VjaC1lbmdpbmUnLCBmYWxzZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAnbWFyaWEtZW5naW5lJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ3Bvc3RncmVzLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdyZWRpcy1lbmdpbmUnLCBmYWxzZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAncGVyY29uYS1lbmdpbmUnLCBmYWxzZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3NvbWVyYW5kb21kYicsIHRydWUpO1xuICAgICAgcmV0dXJuIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdub3RoaW5nd2lsbG1hdGNoJywgZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBIb3N0LnByb3RvdHlwZS5hZGRDb21wb25lbnQgPSBmdW5jdGlvbihraW5kLCB0eXBlLCBpc0hvcml6b250YWxseVNjYWxhYmxlLCBpc1JlZHVuZFNjYWxhYmxlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwQ29tcG9uZW50cy5wdXNoKG5ldyBBcHBDb21wb25lbnQoa2luZCwgdHlwZSwgaXNIb3Jpem9udGFsbHlTY2FsYWJsZSwgaXNSZWR1bmRTY2FsYWJsZSwgdGhpcy5pZCkpO1xuICB9O1xuXG4gIEhvc3QucHJvdG90eXBlLnNlcmlhbGl6ZUNvbXBvbmVudHMgPSBmdW5jdGlvbihjb21wb25lbnRzKSB7XG4gICAgdmFyIGFyLCBjb21wb25lbnQsIGksIGxlbjtcbiAgICBhciA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbXBvbmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudHNbaV07XG4gICAgICBhci5wdXNoKGNvbXBvbmVudC5zZXJpYWxpemUoKSk7XG4gICAgfVxuICAgIHJldHVybiBhcjtcbiAgfTtcblxuICBIb3N0LnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBydW5uaW5nOiB0aGlzLnJ1bm5pbmcsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiB0aGlzLnNlcnZlclNwZWNzSWQsXG4gICAgICBidW5raG91c2VJZDogdGhpcy5idW5raG91c2VJZCxcbiAgICAgIGFjdGlvblBhdGg6IHRoaXMuYWN0aW9uUGF0aCxcbiAgICAgIHBsYXRmb3JtU2VydmljZXM6IHRoaXMuc2VyaWFsaXplQ29tcG9uZW50cyh0aGlzLnBsYXRmb3JtU2VydmljZXMpLFxuICAgICAgYXBwQ29tcG9uZW50czogdGhpcy5zZXJpYWxpemVDb21wb25lbnRzKHRoaXMuYXBwQ29tcG9uZW50cylcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBIb3N0O1xuXG59KSgpO1xuIiwidmFyIEFwcENvbXBvbmVudCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXRmb3JtQ29tcG9uZW50ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBQbGF0Zm9ybUNvbXBvbmVudChpZCwga2luZCwgY29tcG9uZW50S2luZCwgaG9zdElkKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgaWYgKGNvbXBvbmVudEtpbmQgPT0gbnVsbCkge1xuICAgICAgY29tcG9uZW50S2luZCA9ICdtaXN0JztcbiAgICB9XG4gICAgdGhpcy5pc1NwbGl0YWJsZSA9IHRydWU7XG4gICAgdGhpcy5tb2RlID0gJ3NpbXBsZSc7XG4gICAgdGhpcy5hZG1pblBhdGggPSBcIi9zb21lL3BhdGgvdG8vYWRtaW5cIjtcbiAgICB0aGlzLmNvbXBvbmVudHMgPSBbbmV3IEFwcENvbXBvbmVudCgnd2ViJywgY29tcG9uZW50S2luZCwgdHJ1ZSwgdHJ1ZSwgaG9zdElkKS5zZXJpYWxpemUoKV07XG4gIH1cblxuICBQbGF0Zm9ybUNvbXBvbmVudC5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAga2luZDogdGhpcy5raW5kLFxuICAgICAgaXNTcGxpdGFibGU6IHRoaXMuaXNTcGxpdGFibGUsXG4gICAgICBtb2RlOiB0aGlzLm1vZGUsXG4gICAgICBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHMsXG4gICAgICBzdGF0dXM6ICdvbmxpbmUnXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gUGxhdGZvcm1Db21wb25lbnQ7XG5cbn0pKCk7XG5cbih7XG4gIGlkOiBcImxvZ2dlcjFcIixcbiAga2luZDogXCJtZXNoXCIsXG4gIG1vZGU6IFwic2ltcGxlXCIsXG4gIGlzU3BsaXRhYmxlOiB0cnVlLFxuICBjb21wb25lbnRzOiBbXG4gICAge1xuICAgICAgaWQ6IFwiOWU2M2Q3MDAtYzg0ZS00NWVkLWJhMTUtZWQxOTJmY2Y5MmIyXCIsXG4gICAgICB1aWQ6IFwiZGF0YS5wb3J0YWxcIixcbiAgICAgIG5hbWU6IFwibHVja3ktbGltZVwiLFxuICAgICAgc3RhdGU6IFwiY3JlYXRlZFwiLFxuICAgICAgc2VydmljZVR5cGU6IFwiZGVmYXVsdC1kYlwiLFxuICAgICAgc2NhbGVzSG9yaXo6IGZhbHNlLFxuICAgICAgc2NhbGVzUmVkdW5kOiBmYWxzZSxcbiAgICAgIGlzU3BsaXRhYmxlOiB0cnVlLFxuICAgICAgZ2VuZXJhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBcImRhdGEucG9ydGFsLmdlbjFcIixcbiAgICAgICAgICBzdGF0ZTogXCJjcmVhdGVkXCIsXG4gICAgICAgICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgaG9zdElkOiBcInRlc3QtaG9zdC1uYW1lXCIsXG4gICAgICAgICAgICAgIGhvc3ROYW1lOiBcInRlc3QtaG9zdC1uYW1lXCIsXG4gICAgICAgICAgICAgIHN0YXRlOiBcImNyZWF0ZWRcIixcbiAgICAgICAgICAgICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgICAgICAgICAgICByb2xlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgICAgc2VydmVyU3BlY3NJZDogXCI1MTJtYlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59KTtcbiIsInZhciAkaG9sZGVyLCBDbG9iYmVyQm94RGF0YVNoaW0sIFVJLCBib3hlcztcblxuVUkgPSByZXF1aXJlKCcuL3Rlc3QtdWkvdWknKTtcblxuQ2xvYmJlckJveERhdGFTaGltID0gcmVxdWlyZSgnLi9zaGltcy9kYXRhLXNoaW0nKTtcblxud2luZG93LmNsb2JiZXJCb3hEYXRhU2hpbSA9IG5ldyBDbG9iYmVyQm94RGF0YVNoaW0oKTtcblxuYm94ZXMgPSBbXTtcblxuJGhvbGRlciA9ICQoXCIuaG9sZGVyXCIpO1xuXG5uYW5vYm94Lm5vRGVwbG95cyA9IGZhbHNlO1xuXG5uYW5vYm94LmFwcE5hbWUgPSAnZmlzaGZlYXRoZXInO1xuXG5uYW5vYm94LmZxTmFtZSA9ICdmbG9jay9maXNoZmVhdGhlcic7XG5cbndpbmRvdy5pbml0ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lcnMsIGdldEJveCwgZ2V0UGFyZW50T2ZDb21wb25lbnQsIGdldFBhcmVudE9mR2VuZXJhdGlvbiwgcmVtb3ZlQm94LCBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMsIHVpO1xuICAgIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gICAgdWkgPSBuZXcgVUkoJCgnYm9keScpKTtcbiAgICB3aW5kb3cuYWRkR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGNvbXBvbmVudElkLCBzdGF0ZSkge1xuICAgICAgdmFyIGdlbkRhdGE7XG4gICAgICBpZiAoc3RhdGUgPT0gbnVsbCkge1xuICAgICAgICBzdGF0ZSA9ICdwcm92aXNpb25pbmcnO1xuICAgICAgfVxuICAgICAgZ2VuRGF0YSA9IGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRHZW5lcmF0aW9uKGNvbXBvbmVudElkLCBzdGF0ZSkuc2VyaWFsaXplKCk7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZDb21wb25lbnQoY29tcG9uZW50SWQpLmFkZEdlbmVyYXRpb24oY29tcG9uZW50SWQsIGdlbkRhdGEpO1xuICAgIH07XG4gICAgd2luZG93LmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGhvc3RJZCkge1xuICAgICAgcmV0dXJuIGdldEJveChob3N0SWQpLmFkZENvbXBvbmVudChjbG9iYmVyQm94RGF0YVNoaW0uZ2V0QXBwQ29tcG9uZW50KCkuc2VyaWFsaXplKCkpO1xuICAgIH07XG4gICAgd2luZG93LnJlbW92ZUNvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudElkKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZDb21wb25lbnQoY29tcG9uZW50SWQpLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnRJZCk7XG4gICAgfTtcbiAgICB3aW5kb3cucmVtb3ZlR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGdlbmVyYXRpb25JZCkge1xuICAgICAgcmV0dXJuIGdldFBhcmVudE9mR2VuZXJhdGlvbihnZW5lcmF0aW9uSWQpLnJlbW92ZUdlbmVyYXRpb24oZ2VuZXJhdGlvbklkKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRIb3N0ID0gZnVuY3Rpb24obG90c09mSWNvbnMpIHtcbiAgICAgIHZhciBob3N0Qm94O1xuICAgICAgaG9zdEJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICAgIGhvc3RCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkhPU1QsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3N0KGxvdHNPZkljb25zKS5zZXJpYWxpemUoKSk7XG4gICAgICByZXR1cm4gdWkubm90ZUNvbXBvbmVudHMoaG9zdEJveCk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkQ2x1c3RlciA9IGZ1bmN0aW9uKGNsdXN0ZXJEYXRhKSB7XG4gICAgICB2YXIgY2x1c3RlckJveCwgZGF0YSwgZ2VuZXJhdGlvbiwgaiwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICByZWYgPSBjbHVzdGVyRGF0YS5nZW5lcmF0aW9ucztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBnZW5lcmF0aW9uID0gcmVmW2pdO1xuICAgICAgICBkYXRhID0gbmFub2JveC5DbG9iYmVyQm94LmpvaW5DbHVzdGVyRGF0YShjbHVzdGVyRGF0YSwgZ2VuZXJhdGlvbik7XG4gICAgICAgIGNsdXN0ZXJCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgICAgIHJlc3VsdHMucHVzaChjbHVzdGVyQm94LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5DTFVTVEVSLCBkYXRhKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuICAgIHdpbmRvdy5zZXRTdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgICAgcmV0dXJuIGdldEJveChpZCkuc2V0U3RhdGUoc3RhdGUpO1xuICAgIH07XG4gICAgd2luZG93Lm1hbmFnZUNvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudElkKSB7XG4gICAgICB2YXIgYm94LCBib3hIb3N0LCB4O1xuICAgICAgYm94ID0gZ2V0Qm94KGNvbXBvbmVudElkKTtcbiAgICAgIGlmIChib3ggIT0gbnVsbCkge1xuICAgICAgICB4ID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYm94SG9zdCA9IGdldFBhcmVudE9mQ29tcG9uZW50KCk7XG4gICAgICBpZiAoYm94SG9zdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB4ID0gMDtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvdy5zZXRHZW5lcmF0aW9uU3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkdlbmVyYXRpb24oaWQpLnNldEdlbmVyYXRpb25TdGF0ZShpZCwgc3RhdGUpO1xuICAgIH07XG4gICAgd2luZG93LnNldEdlbmVyYXRpb25TdGF0dXMgPSBmdW5jdGlvbihpZCwgc3RhdHVzKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZHZW5lcmF0aW9uKGlkKS5zZXRHZW5lcmF0aW9uU3RhdHVzKGlkLCBzdGF0dXMpO1xuICAgIH07XG4gICAgc3Vic2NyaWJlVG9SZWdpc3RyYXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTQ0FMRS5HRVRfT1BUSU9OUycsIGZ1bmN0aW9uKG0sIGNiKSB7XG4gICAgICAgIHJldHVybiBjYihzY2FsZU1hY2hpbmVUZXN0RGF0YS5nZXRIb3N0T3B0aW9ucygpKTtcbiAgICAgIH0pO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnR0VUX0JVTktIT1VTRVMnLCBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmNiKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogXCJhXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkVDMiAxXCIsXG4gICAgICAgICAgICBjdXJyZW50OiB0cnVlLFxuICAgICAgICAgICAgc3RhdGU6ICdhY3RpdmUnXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgaWQ6IFwiY1wiLFxuICAgICAgICAgICAgbmFtZTogXCJFQzIgM1wiLFxuICAgICAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgICAgfSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdSRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgICAgcmV0dXJuIGJveGVzLnB1c2goYm94KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1VOUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGJveCkge1xuICAgICAgICAgIHJldHVybiByZW1vdmVCb3goYm94KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NDQUxFLlNBVkUnLCBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IFNjYWxlOlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHJldHVybiBkYXRhLnN1Ym1pdENiKCk7XG4gICAgICB9KTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NQTElULlNBVkUnLCBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3BsaXQ6XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuc3VibWl0Q2IoKTtcbiAgICAgIH0pO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnSE9TVC5SVU4tQUNUSU9OJywgZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgaG9zdCBhY3Rpb24gYFwiICsgZGF0YS5hY3Rpb24gKyBcImAgb24gaG9zdCBgXCIgKyBkYXRhLmhvc3RJZCArIFwiYFwiKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZGF0YS5vbkNvbXBsZXRlLCBNYXRoLnJhbmRvbSgpICogMTAwMCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdDT01QT05FTlQuUlVOLUFDVElPTicsIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIGNvbXBvbmVudCBhY3Rpb24gYFwiICsgZGF0YS5hY3Rpb24gKyBcImAgb24gY29tcG9uZW50IGBcIiArIGRhdGEuY29tcG9uZW50SWQgKyBcImBcIik7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGRhdGEub25Db21wbGV0ZSwgTWF0aC5yYW5kb20oKSAqIDEwMDApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BUFBfQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ2FwcC1jb21wb25lbnRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlBMQVRGT1JNX0NPTVBPTkVOVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCdwbGF0Zm9ybS1jb21wb25lbnRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkhPU1QtSU5UQU5DRVMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCdob3N0LWluc3RhbmNlcycsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TQ0FMRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS51cmkpLnN3aXRjaFN1YkNvbnRlbnQoJ3NjYWxlLW1hY2hpbmUnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1RBVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCdzdGF0cycsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5DT05TT0xFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEJveChkYXRhLnVyaSkuc3dpdGNoU3ViQ29udGVudCgnY29uc29sZScsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5UVU5ORUwnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCd0dW5uZWwnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1BMSVQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCdzcGxpdCcsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQURNSU4nLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEudXJpKS5zd2l0Y2hTdWJDb250ZW50KCdhZG1pbicsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG4gICAgZ2V0Qm94ID0gZnVuY3Rpb24odXJpKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW47XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBib3ggPSBib3hlc1tqXTtcbiAgICAgICAgaWYgKHVyaSA9PT0gYm94LnVyaSkge1xuICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFBhcmVudE9mQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoYm94Lmhhc0NvbXBvbmVudFdpdGhJZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRQYXJlbnRPZkdlbmVyYXRpb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIGJveCwgaiwgbGVuO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gYm94ZXNbal07XG4gICAgICAgIGlmIChib3guaGFzR2VuZXJhdGlvbldpdGhJZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZW1vdmVCb3ggPSBmdW5jdGlvbihkb29tZWRCb3gpIHtcbiAgICAgIHZhciBib3gsIGksIGosIGxlbjtcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgYm94ID0gYm94ZXNbaV07XG4gICAgICAgIGlmIChib3guaWQgPT09IGRvb21lZEJveC5pZCkge1xuICAgICAgICAgIGJveGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucygpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgbmFub2JveC5ub0RlcGxveXMgPSB0cnVlO1xuICAgIG5hbm9ib3guY2xvYmJlckNvbmZpZyA9IHt9O1xuICAgIG5hbm9ib3guY2xvYmJlckNvbmZpZy5ob3N0QWN0aW9ucyA9IFtcbiAgICAgIHtcbiAgICAgICAgYWN0aW9uOiAnZGVsZXRlJyxcbiAgICAgICAgcGVybWlzc2lvbjogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBhY3Rpb246ICdyZWJvb3QnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3N0b3AnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3N0YXJ0JyxcbiAgICAgICAgcGVybWlzc2lvbjogdHJ1ZVxuICAgICAgfVxuICAgIF07XG4gICAgbmFub2JveC5jbG9iYmVyQ29uZmlnLmNvbXBvbmVudEFjdGlvbnMgPSBbXG4gICAgICB7XG4gICAgICAgIGFjdGlvbjogJ3JlZnJlc2gnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3JlYm9vdCcsXG4gICAgICAgIHBlcm1pc3Npb246IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3JlYnVpbGQnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3VwZGF0ZScsXG4gICAgICAgIHBlcm1pc3Npb246IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgYWN0aW9uOiAnbWFuYWdlJyxcbiAgICAgICAgcGVybWlzc2lvbjogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBhY3Rpb246ICdkZWxldGUnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3N0b3AnLFxuICAgICAgICBwZXJtaXNzaW9uOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGFjdGlvbjogJ3N0YXJ0JyxcbiAgICAgICAgcGVybWlzc2lvbjogdHJ1ZVxuICAgICAgfVxuICAgIF07XG4gICAgYWRkSG9zdChmYWxzZSk7XG4gICAgYWRkQ2x1c3RlcihjbG9iYmVyQm94RGF0YVNoaW0uZ2V0SG9yaXpDbHVzdGVyKCkuc2VyaWFsaXplKCkpO1xuICAgIGFkZENsdXN0ZXIoY2xvYmJlckJveERhdGFTaGltLmdldERhdGFDbHVzdGVyKCkuc2VyaWFsaXplKCkpO1xuICAgIHdpbmRvdy5zZXROb0RlcGxveXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBnZXRCb3goXCJob3N0LjFcIikuc2V0UmVhZGluZXNzU3RhdGUoJ25vLWRlcGxveXMnLCAnbmJ4Jyk7XG4gICAgfTtcbiAgICB3aW5kb3cuc2V0UGxhdGZvcm1CdWlsZGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGdldEJveChcImhvc3QuMVwiKS5zZXRSZWFkaW5lc3NTdGF0ZSgncGxhdGZvcm0tYnVpbGRpbmcnKTtcbiAgICB9O1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcG9uZW50RGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGdldEJveChcImhvc3QuMVwiKS5nZXREYXRhRm9yVXNhZ2VCcmVha2Rvd24oKTtcbiAgICB9O1xuICB9O1xufSkodGhpcyk7XG4iLCJ2YXIgVUk7XG5cbm1vZHVsZS5leHBvcnRzID0gVUkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFVJKCkge1xuICAgIHRoaXMuaW5pdFN0YXRlU2VsZWN0b3IoJChcIi5zdGF0ZXNcIikpO1xuICAgIHRoaXMuaW5pdEV2ZW50cygpO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1JFR0lTVEVSJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RlckJveChib3gpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cblxuICBVSS5wcm90b3R5cGUucmVnaXN0ZXJCb3ggPSBmdW5jdGlvbihib3gpIHtcbiAgICBpZiAoYm94LmRhdGEuaWQuaW5jbHVkZXMoJ2dlbicpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRUb1NlbGVjdG9yKCQoJy5nZW5lcmF0aW9ucycsICcudWktc2hpbScpLCBib3gpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRUb1NlbGVjdG9yKCQoJy5ob3N0cycsICcudWktc2hpbScpLCBib3gpO1xuICAgIH1cbiAgfTtcblxuICBVSS5wcm90b3R5cGUuYWRkVG9TZWxlY3RvciA9IGZ1bmN0aW9uKCRzZWxlY3RvciwgYm94KSB7XG4gICAgaWYgKCQoXCJvcHRpb25bdmFsdWU9J1wiICsgYm94LmRhdGEuaWQgKyBcIiddXCIsICRzZWxlY3RvcikubGVuZ3RoICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiAkc2VsZWN0b3IuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyBib3guZGF0YS5pZCArIFwiJz5cIiArIGJveC5kYXRhLmlkICsgXCI8L29wdGlvbj5cIik7XG4gIH07XG5cbiAgVUkucHJvdG90eXBlLmluaXRTdGF0ZVNlbGVjdG9yID0gZnVuY3Rpb24oJHNlbGVjdG9yKSB7XG4gICAgdmFyIGksIGxlbiwgcmVzdWx0cywgc3RhdGUsIHN0YXRlcztcbiAgICBzdGF0ZXMgPSBbJycsICdjcmVhdGVkJywgJ2luaXRpYWxpemVkJywgJ29yZGVyZWQnLCAncHJvdmlzaW9uaW5nJywgJ2RlZnVuY3QnLCAnYWN0aXZlJywgJ2RlY29taXNzaW9uaW5nJywgJ2Rlc3Ryb3knLCAnYXJjaGl2ZWQnXTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RhdGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdGF0ZSA9IHN0YXRlc1tpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgkc2VsZWN0b3IuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyBzdGF0ZSArIFwiJz5cIiArIHN0YXRlICsgXCI8L29wdGlvbj5cIikpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBVSS5wcm90b3R5cGUuaW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICQoXCJidXR0b24jaG9zdHNcIikub24oJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZCwgc3RhdGU7XG4gICAgICAgIGlkID0gJChcInNlbGVjdCNob3N0cy1zdGF0ZS1zZWxlY3RvclwiKS52YWwoKTtcbiAgICAgICAgc3RhdGUgPSAkKFwic2VsZWN0I2hvc3Qtc3RhdGVzXCIpLnZhbCgpO1xuICAgICAgICByZXR1cm4gc2V0U3RhdGUoaWQsIHN0YXRlKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgICQoXCJidXR0b24jZ2VuZXJhdGlvbnNcIikub24oJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZCwgc3RhdGU7XG4gICAgICAgIGlkID0gJChcInNlbGVjdCNnZW5lcmF0aW9ucy1zdGF0ZS1zZWxlY3RvclwiKS52YWwoKTtcbiAgICAgICAgc3RhdGUgPSAkKFwic2VsZWN0I2dlbi1zdGF0ZXNcIikudmFsKCk7XG4gICAgICAgIHJldHVybiBzZXRHZW5lcmF0aW9uU3RhdGUoaWQsIHN0YXRlKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgICQoXCJidXR0b24jZ2VuLXN0YXR1cy1nb1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0dXM7XG4gICAgICAgIGlkID0gJChcInNlbGVjdCNnZW5lcmF0aW9ucy1zdGF0dXMtc2VsZWN0b3JcIikudmFsKCk7XG4gICAgICAgIHN0YXR1cyA9ICQoXCJzZWxlY3QjZ2VuLXN0YXR1c1wiKS52YWwoKTtcbiAgICAgICAgcmV0dXJuIHNldEdlbmVyYXRpb25TdGF0dXMoaWQsIHN0YXR1cyk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICAkKFwiYnV0dG9uI2FkZC1nZW5lcmF0aW9uXCIpLm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWRkR2VuZXJhdGlvbigkKFwic2VsZWN0I2FkZC1nZW5lcmF0aW9uLXNlbGVjdFwiKS52YWwoKSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICAkKFwiYnV0dG9uI3JlbW92ZS1nZW5lcmF0aW9uXCIpLm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlR2VuZXJhdGlvbigkKFwic2VsZWN0I3JlbW92ZS1nZW5lcmF0aW9uLXNlbGVjdFwiKS52YWwoKSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICAkKFwiYnV0dG9uI2FkZC1jb21wb25lbnRcIikub24oJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhZGRDb21wb25lbnQoJChcInNlbGVjdCNhZGQtY29tcG9uZW50LXNlbGVjdFwiKS52YWwoKSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gJChcImJ1dHRvbiNyZW1vdmUtY29tcG9uZW50XCIpLm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlQ29tcG9uZW50KCQoXCJzZWxlY3QjcmVtb3ZlLWNvbXBvbmVudC1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVUkucHJvdG90eXBlLm5vdGVDb21wb25lbnRzID0gZnVuY3Rpb24oYm94KSB7XG4gICAgdmFyICRzZWxlY3RvciwgY29tcG9uZW50LCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAkc2VsZWN0b3IgPSAkKFwic2VsZWN0LmNvbXBvbmVudHNcIik7XG4gICAgcmVmID0gYm94LmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnQgPSByZWZbaV07XG4gICAgICByZXN1bHRzLnB1c2goJHNlbGVjdG9yLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgY29tcG9uZW50LmlkICsgXCInPlwiICsgY29tcG9uZW50LmlkICsgXCI8L29wdGlvbj5cIikpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICByZXR1cm4gVUk7XG5cbn0pKCk7XG4iXX0=
