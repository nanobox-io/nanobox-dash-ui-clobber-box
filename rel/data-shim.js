(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AppComponent;

module.exports = AppComponent = (function() {
  AppComponent.appComponentCount = 0;

  function AppComponent(kind, type, scalesHorizontally, scalesRedund) {
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
    this.serverSpecsId = "b3";
    this.id = kind + "." + (++AppComponent.appComponentCount);
    this.name = kind + " " + AppComponent.appComponentCount;
    this.generations = [];
    this.adminPath = "/some/path/to/admin";
    this.actionPath = "/some/path/to/action";
    this.category = scalesHorizontally ? 'web' : 'data';
    this.clusterable = scalesRedund;
    this.addGeneration();
  }

  AppComponent.prototype.addGeneration = function(state) {
    if (state == null) {
      state = 'active';
    }
    return this.generations.push({
      state: state,
      id: this.id + ".gen" + (this.generationCount++)
    });
  };

  AppComponent.prototype.serialize = function() {
    return {
      generations: this.generations,
      state: this.state,
      serverSpecsId: this.serverSpecsId,
      id: this.id,
      name: this.name,
      serviceType: this.type,
      adminPath: this.adminPath,
      actionPath: this.actionPath,
      category: this.category,
      clusterable: this.clusterable
    };
  };

  return AppComponent;

})();

},{}],2:[function(require,module,exports){
var AppComponent, DataCluster, Host;

AppComponent = require('./app-component');

Host = require('./host');

module.exports = DataCluster = (function() {
  DataCluster.clusterCount = 0;

  function DataCluster() {
    var generation, i, j, k, len, ref, role, roles, totalGenerations;
    totalGenerations = 1;
    this.id = "cluster." + DataCluster.clusterCount;
    this.name = "Customers DB";
    this.state = "active";
    this.serviceType = "mysql-db";
    this.category = "data";
    this.clusterable = true;
    this.adminPath = "/some/path/to/admin";
    this.generations = [];
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
          serverSpecsId: "b2"
        });
      }
      this.generations.push(generation);
    }
  }

  DataCluster.prototype.serialize = function() {
    return {
      id: this.id,
      state: this.state,
      name: this.name,
      category: this.category,
      clusterable: this.clusterable,
      generations: this.generations,
      serviceType: this.serviceType,
      adminPath: this.adminPath
    };
  };

  return DataCluster;

})();

},{"./app-component":1,"./host":6}],3:[function(require,module,exports){
var AppComponent, ClobberBoxDataShim, DataCluster, Generation, HorizCluster, Host, PlatformComponent;

AppComponent = require('./app-component');

PlatformComponent = require('./platform-component');

Host = require('./host');

HorizCluster = require('./horiz-cluster');

DataCluster = require('./data-cluster');

Generation = require('./generation');

module.exports = ClobberBoxDataShim = (function() {
  function ClobberBoxDataShim() {}

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

  ClobberBoxDataShim.prototype.getAppComponent = function(kind, type, scalesHorizontally, scalesRedund) {
    return new AppComponent(kind, type, scalesHorizontally, scalesRedund);
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
var AppComponent, HorizCluster, Host;

AppComponent = require('./app-component');

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
    this.state = "active";
    this.serviceType = "middleman";
    this.category = "web";
    this.clusterable = true;
    this.generations = [];
    this.adminPath = "/some/path/to/admin";
    for (i = j = 1, ref = totalGenerations; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      generation = {
        id: "web.main.gen" + i,
        state: "active",
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
          serverSpecsId: "b2"
        });
      }
      this.generations.push(generation);
    }
  }

  HorizCluster.prototype.serialize = function() {
    return {
      id: this.id,
      state: this.state,
      name: this.name,
      scalesHoriz: this.scalesHoriz,
      category: this.category,
      clusterable: this.clusterable,
      scalesRedund: this.scalesRedund,
      generations: this.generations,
      serviceType: this.serviceType,
      adminPath: this.adminPath
    };
  };

  return HorizCluster;

})();

},{"./app-component":1,"./host":6}],6:[function(require,module,exports){
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
    this.id = "host." + (++Host.hostCount);
    this.name = "ec2." + Host.hostCount;
    this.serverSpecsId = "b1";
    this.bunkhouseId = "bunkhouse";
    this.actionPath = "/some/path/to/actions";
    this.platformServices = [new PlatformComponent("lb", "mesh", "nanobox/portal"), new PlatformComponent("lg", "logger", "nanobox/logvac"), new PlatformComponent("hm", "monitor", "nanobox/pulse"), new PlatformComponent("mr", "pusher", "nanobox/mist"), new PlatformComponent("gs", "warehouse", "nanobox/hoarder")];
    this.appComponents = [];
    this.createComponents(makeLotsOfComponents);
  }

  Host.prototype.createComponents = function(makeLotsOfComponents) {
    if (!makeLotsOfComponents) {
      this.addComponent('web', 'middleman', true, true);
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
    return this.appComponents.push(new AppComponent(kind, type, isHorizontallyScalable, isRedundScalable));
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
      id: this.id,
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
  function PlatformComponent(id, kind, componentKind) {
    this.id = id;
    this.kind = kind;
    if (componentKind == null) {
      componentKind = 'mist';
    }
    this.isSplitable = true;
    this.mode = 'simple';
    this.adminPath = "/some/path/to/admin";
    this.components = [new AppComponent('web', componentKind, true, true).serialize()];
  }

  PlatformComponent.prototype.serialize = function() {
    return {
      id: this.id,
      kind: this.kind,
      isSplitable: this.isSplitable,
      mode: this.mode,
      components: this.components
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
    window.addHost = function() {
      var hostBox;
      hostBox = new nanobox.ClobberBox();
      hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost(false).serialize());
      return ui.noteComponents(hostBox);
    };
    window.addCluster = function(clusterData) {
      var clusterBox, data, generation, j, len, ref, results;
      ref = clusterData.generations;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        generation = ref[j];
        data = {
          serviceId: clusterData.id,
          serviceState: clusterData.state,
          name: clusterData.name,
          serviceType: clusterData.serviceType,
          scalesHoriz: clusterData.scalesHoriz,
          scalesRedund: clusterData.scalesRedund,
          category: clusterData.category,
          clusterable: clusterData.clusterable,
          adminPath: clusterData.adminPath,
          actionPath: clusterData.adminPath,
          instances: clusterData.instances,
          id: generation.id,
          generationState: generation.state,
          generationStatus: generation.status,
          members: generation.instances,
          totalMembers: generation.instances.length
        };
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
    subscribeToRegistrations = function() {
      PubSub.subscribe('SCALE.GET_OPTIONS', function(m, cb) {
        return cb(scaleMachineTestData.getHostOptions());
      });
      PubSub.subscribe('GET_BUNKHOUSES', function(m, data) {
        return data.cb([
          {
            id: "a",
            name: "EC2 1",
            current: true
          }, {
            id: "c",
            name: "EC2 3"
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
      return PubSub.subscribe('SPLIT.SAVE', function(m, data) {
        console.log("Split:");
        console.log(data);
        return data.submitCb();
      });
    };
    addEventListeners = function() {
      PubSub.subscribe('SHOW.APP_COMPONENTS', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('app-components', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.PLATFORM_COMPONENTS', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('platform-components', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.HOST-INTANCES', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('host-instances', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.SCALE', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('scale-machine', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.STATS', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('stats', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.CONSOLE', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('console', data.el);
        };
      })(this));
      PubSub.subscribe('SHOW.SPLIT', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('split', data.el);
        };
      })(this));
      return PubSub.subscribe('SHOW.ADMIN', (function(_this) {
        return function(m, data) {
          return getBox(data.id).switchSubContent('admin', data.el);
        };
      })(this));
    };
    getBox = function(id) {
      var box, j, len;
      for (j = 0, len = boxes.length; j < len; j++) {
        box = boxes[j];
        if (id === box.id) {
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
    addCluster(clobberBoxDataShim.getHorizCluster().serialize());
    window.setNoDeploys = function() {
      return getBox("host.1").showAsReadyForDeploys();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvYXBwLWNvbXBvbmVudC5jb2ZmZWUiLCJzaGltcy9kYXRhLWNsdXN0ZXIuY29mZmVlIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInNoaW1zL2dlbmVyYXRpb24uY29mZmVlIiwic2hpbXMvaG9yaXotY2x1c3Rlci5jb2ZmZWUiLCJzaGltcy9ob3N0LmNvZmZlZSIsInNoaW1zL3BsYXRmb3JtLWNvbXBvbmVudC5jb2ZmZWUiLCJzdGFnZS5jb2ZmZWUiLCJ0ZXN0LXVpL3VpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBBcHBDb21wb25lbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29tcG9uZW50ID0gKGZ1bmN0aW9uKCkge1xuICBBcHBDb21wb25lbnQuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEFwcENvbXBvbmVudChraW5kLCB0eXBlLCBzY2FsZXNIb3Jpem9udGFsbHksIHNjYWxlc1JlZHVuZCkge1xuICAgIGlmIChraW5kID09IG51bGwpIHtcbiAgICAgIGtpbmQgPSAnd2ViJztcbiAgICB9XG4gICAgdGhpcy50eXBlID0gdHlwZSAhPSBudWxsID8gdHlwZSA6IFwicnVieVwiO1xuICAgIGlmIChzY2FsZXNIb3Jpem9udGFsbHkgPT0gbnVsbCkge1xuICAgICAgc2NhbGVzSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHNjYWxlc1JlZHVuZCA9PSBudWxsKSB7XG4gICAgICBzY2FsZXNSZWR1bmQgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5nZW5lcmF0aW9uQ291bnQgPSAxO1xuICAgIHRoaXMuc3RhdGUgPSAnYWN0aXZlJztcbiAgICB0aGlzLnNlcnZlclNwZWNzSWQgPSBcImIzXCI7XG4gICAgdGhpcy5pZCA9IGtpbmQgKyBcIi5cIiArICgrK0FwcENvbXBvbmVudC5hcHBDb21wb25lbnRDb3VudCk7XG4gICAgdGhpcy5uYW1lID0ga2luZCArIFwiIFwiICsgQXBwQ29tcG9uZW50LmFwcENvbXBvbmVudENvdW50O1xuICAgIHRoaXMuZ2VuZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFkbWluUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hZG1pblwiO1xuICAgIHRoaXMuYWN0aW9uUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hY3Rpb25cIjtcbiAgICB0aGlzLmNhdGVnb3J5ID0gc2NhbGVzSG9yaXpvbnRhbGx5ID8gJ3dlYicgOiAnZGF0YSc7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHNjYWxlc1JlZHVuZDtcbiAgICB0aGlzLmFkZEdlbmVyYXRpb24oKTtcbiAgfVxuXG4gIEFwcENvbXBvbmVudC5wcm90b3R5cGUuYWRkR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdlbmVyYXRpb25zLnB1c2goe1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgaWQ6IHRoaXMuaWQgKyBcIi5nZW5cIiArICh0aGlzLmdlbmVyYXRpb25Db3VudCsrKVxuICAgIH0pO1xuICB9O1xuXG4gIEFwcENvbXBvbmVudC5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdlbmVyYXRpb25zOiB0aGlzLmdlbmVyYXRpb25zLFxuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiB0aGlzLnNlcnZlclNwZWNzSWQsXG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIHNlcnZpY2VUeXBlOiB0aGlzLnR5cGUsXG4gICAgICBhZG1pblBhdGg6IHRoaXMuYWRtaW5QYXRoLFxuICAgICAgYWN0aW9uUGF0aDogdGhpcy5hY3Rpb25QYXRoLFxuICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnksXG4gICAgICBjbHVzdGVyYWJsZTogdGhpcy5jbHVzdGVyYWJsZVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEFwcENvbXBvbmVudDtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIERhdGFDbHVzdGVyLCBIb3N0O1xuXG5BcHBDb21wb25lbnQgPSByZXF1aXJlKCcuL2FwcC1jb21wb25lbnQnKTtcblxuSG9zdCA9IHJlcXVpcmUoJy4vaG9zdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFDbHVzdGVyID0gKGZ1bmN0aW9uKCkge1xuICBEYXRhQ2x1c3Rlci5jbHVzdGVyQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIERhdGFDbHVzdGVyKCkge1xuICAgIHZhciBnZW5lcmF0aW9uLCBpLCBqLCBrLCBsZW4sIHJlZiwgcm9sZSwgcm9sZXMsIHRvdGFsR2VuZXJhdGlvbnM7XG4gICAgdG90YWxHZW5lcmF0aW9ucyA9IDE7XG4gICAgdGhpcy5pZCA9IFwiY2x1c3Rlci5cIiArIERhdGFDbHVzdGVyLmNsdXN0ZXJDb3VudDtcbiAgICB0aGlzLm5hbWUgPSBcIkN1c3RvbWVycyBEQlwiO1xuICAgIHRoaXMuc3RhdGUgPSBcImFjdGl2ZVwiO1xuICAgIHRoaXMuc2VydmljZVR5cGUgPSBcIm15c3FsLWRiXCI7XG4gICAgdGhpcy5jYXRlZ29yeSA9IFwiZGF0YVwiO1xuICAgIHRoaXMuY2x1c3RlcmFibGUgPSB0cnVlO1xuICAgIHRoaXMuYWRtaW5QYXRoID0gXCIvc29tZS9wYXRoL3RvL2FkbWluXCI7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbEdlbmVyYXRpb25zOyAxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWY7IGkgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgZ2VuZXJhdGlvbiA9IHtcbiAgICAgICAgaWQ6IFwiZGIubWFpbi5nZW5cIiArIGksXG4gICAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgIGluc3RhbmNlczogW11cbiAgICAgIH07XG4gICAgICByb2xlcyA9IFsncHJpbWFyeScsICdzZWNvbmRhcnknLCAnYXJiaXRlciddO1xuICAgICAgZm9yIChpID0gayA9IDAsIGxlbiA9IHJvbGVzLmxlbmd0aDsgayA8IGxlbjsgaSA9ICsraykge1xuICAgICAgICByb2xlID0gcm9sZXNbaV07XG4gICAgICAgIGdlbmVyYXRpb24uaW5zdGFuY2VzLnB1c2goe1xuICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgIGhvc3RJZDogXCJkby5cIiArIGksXG4gICAgICAgICAgaG9zdE5hbWU6IFwiZG8uXCIgKyBpLFxuICAgICAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgICByb2xlOiByb2xlLFxuICAgICAgICAgIHNlcnZlclNwZWNzSWQ6IFwiYjJcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGlvbnMucHVzaChnZW5lcmF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBEYXRhQ2x1c3Rlci5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcbiAgICAgIGNsdXN0ZXJhYmxlOiB0aGlzLmNsdXN0ZXJhYmxlLFxuICAgICAgZ2VuZXJhdGlvbnM6IHRoaXMuZ2VuZXJhdGlvbnMsXG4gICAgICBzZXJ2aWNlVHlwZTogdGhpcy5zZXJ2aWNlVHlwZSxcbiAgICAgIGFkbWluUGF0aDogdGhpcy5hZG1pblBhdGhcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBEYXRhQ2x1c3RlcjtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIENsb2JiZXJCb3hEYXRhU2hpbSwgRGF0YUNsdXN0ZXIsIEdlbmVyYXRpb24sIEhvcml6Q2x1c3RlciwgSG9zdCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcGxhdGZvcm0tY29tcG9uZW50Jyk7XG5cbkhvc3QgPSByZXF1aXJlKCcuL2hvc3QnKTtcblxuSG9yaXpDbHVzdGVyID0gcmVxdWlyZSgnLi9ob3Jpei1jbHVzdGVyJyk7XG5cbkRhdGFDbHVzdGVyID0gcmVxdWlyZSgnLi9kYXRhLWNsdXN0ZXInKTtcblxuR2VuZXJhdGlvbiA9IHJlcXVpcmUoJy4vZ2VuZXJhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2JiZXJCb3hEYXRhU2hpbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveERhdGFTaGltKCkge31cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEhvc3QgPSBmdW5jdGlvbihtYWtlTG90c09mQ29tcG9uZW50cykge1xuICAgIGlmIChtYWtlTG90c09mQ29tcG9uZW50cyA9PSBudWxsKSB7XG4gICAgICBtYWtlTG90c09mQ29tcG9uZW50cyA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEhvc3QobWFrZUxvdHNPZkNvbXBvbmVudHMpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0SG9yaXpDbHVzdGVyID0gZnVuY3Rpb24odG90YWxNZW1iZXJzKSB7XG4gICAgcmV0dXJuIG5ldyBIb3JpekNsdXN0ZXIodG90YWxNZW1iZXJzKTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldERhdGFDbHVzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhQ2x1c3RlcigpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0QXBwQ29tcG9uZW50ID0gZnVuY3Rpb24oa2luZCwgdHlwZSwgc2NhbGVzSG9yaXpvbnRhbGx5LCBzY2FsZXNSZWR1bmQpIHtcbiAgICByZXR1cm4gbmV3IEFwcENvbXBvbmVudChraW5kLCB0eXBlLCBzY2FsZXNIb3Jpem9udGFsbHksIHNjYWxlc1JlZHVuZCk7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRQbGF0Zm9ybUNvbXBvbmVudCA9IGZ1bmN0aW9uKGlkLCBraW5kKSB7XG4gICAgcmV0dXJuIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChpZCwga2luZCk7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRHZW5lcmF0aW9uID0gZnVuY3Rpb24ocGFyZW50SWQsIHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBHZW5lcmF0aW9uKHBhcmVudElkLCBzdGF0ZSk7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5yZXNldENvdW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIEhvc3QuaG9zdENvdW50ID0gMDtcbiAgICBBcHBDb21wb25lbnQuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuICAgIEhvcml6Q2x1c3Rlci5jbHVzdGVyQ291bnQgPSAwO1xuICAgIHJldHVybiBEYXRhQ2x1c3Rlci5jbHVzdGVyQ291bnQgPSAwO1xuICB9O1xuXG4gIHJldHVybiBDbG9iYmVyQm94RGF0YVNoaW07XG5cbn0pKCk7XG4iLCJ2YXIgR2VuZXJhdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0aW9uID0gKGZ1bmN0aW9uKCkge1xuICBHZW5lcmF0aW9uLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEdlbmVyYXRpb24ocGFyZW50SWQsIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmlkID0gcGFyZW50SWQgKyBcIi5nZW5cIiArIChHZW5lcmF0aW9uLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQrKyk7XG4gIH1cblxuICBHZW5lcmF0aW9uLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBpZDogdGhpcy5pZFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEdlbmVyYXRpb247XG5cbn0pKCk7XG4iLCJ2YXIgQXBwQ29tcG9uZW50LCBIb3JpekNsdXN0ZXIsIEhvc3Q7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5Ib3N0ID0gcmVxdWlyZSgnLi9ob3N0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9yaXpDbHVzdGVyID0gKGZ1bmN0aW9uKCkge1xuICBIb3JpekNsdXN0ZXIuY2x1c3RlckNvdW50ID0gMDtcblxuICBmdW5jdGlvbiBIb3JpekNsdXN0ZXIodG90YWxNZW1iZXJzLCB0b3RhbEdlbmVyYXRpb25zKSB7XG4gICAgdmFyIGdlbmVyYXRpb24sIGksIGosIGssIHJlZiwgcmVmMTtcbiAgICBpZiAodG90YWxNZW1iZXJzID09IG51bGwpIHtcbiAgICAgIHRvdGFsTWVtYmVycyA9IDQ7XG4gICAgfVxuICAgIGlmICh0b3RhbEdlbmVyYXRpb25zID09IG51bGwpIHtcbiAgICAgIHRvdGFsR2VuZXJhdGlvbnMgPSAxO1xuICAgIH1cbiAgICB0aGlzLmlkID0gXCJjbHVzdGVyLlwiICsgSG9yaXpDbHVzdGVyLmNsdXN0ZXJDb3VudDtcbiAgICB0aGlzLm5hbWUgPSBcIk1haW4gQXBwXCI7XG4gICAgdGhpcy5zdGF0ZSA9IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5zZXJ2aWNlVHlwZSA9IFwibWlkZGxlbWFuXCI7XG4gICAgdGhpcy5jYXRlZ29yeSA9IFwid2ViXCI7XG4gICAgdGhpcy5jbHVzdGVyYWJsZSA9IHRydWU7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWRtaW5QYXRoID0gXCIvc29tZS9wYXRoL3RvL2FkbWluXCI7XG4gICAgZm9yIChpID0gaiA9IDEsIHJlZiA9IHRvdGFsR2VuZXJhdGlvbnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBnZW5lcmF0aW9uID0ge1xuICAgICAgICBpZDogXCJ3ZWIubWFpbi5nZW5cIiArIGksXG4gICAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgIGluc3RhbmNlczogW11cbiAgICAgIH07XG4gICAgICBmb3IgKGkgPSBrID0gMSwgcmVmMSA9IHRvdGFsTWVtYmVyczsgMSA8PSByZWYxID8gayA8PSByZWYxIDogayA+PSByZWYxOyBpID0gMSA8PSByZWYxID8gKytrIDogLS1rKSB7XG4gICAgICAgIGdlbmVyYXRpb24uaW5zdGFuY2VzLnB1c2goe1xuICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgIGhvc3RJZDogXCJkby5cIiArIGksXG4gICAgICAgICAgaG9zdE5hbWU6IFwiZG8uXCIgKyBpLFxuICAgICAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgICByb2xlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICBzZXJ2ZXJTcGVjc0lkOiBcImIyXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdlbmVyYXRpb25zLnB1c2goZ2VuZXJhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgSG9yaXpDbHVzdGVyLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIHNjYWxlc0hvcml6OiB0aGlzLnNjYWxlc0hvcml6LFxuICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnksXG4gICAgICBjbHVzdGVyYWJsZTogdGhpcy5jbHVzdGVyYWJsZSxcbiAgICAgIHNjYWxlc1JlZHVuZDogdGhpcy5zY2FsZXNSZWR1bmQsXG4gICAgICBnZW5lcmF0aW9uczogdGhpcy5nZW5lcmF0aW9ucyxcbiAgICAgIHNlcnZpY2VUeXBlOiB0aGlzLnNlcnZpY2VUeXBlLFxuICAgICAgYWRtaW5QYXRoOiB0aGlzLmFkbWluUGF0aFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEhvcml6Q2x1c3RlcjtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIEhvc3QsIFBsYXRmb3JtQ29tcG9uZW50O1xuXG5BcHBDb21wb25lbnQgPSByZXF1aXJlKCcuL2FwcC1jb21wb25lbnQnKTtcblxuUGxhdGZvcm1Db21wb25lbnQgPSByZXF1aXJlKCcuL3BsYXRmb3JtLWNvbXBvbmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvc3QgPSAoZnVuY3Rpb24oKSB7XG4gIEhvc3QuaG9zdENvdW50ID0gMDtcblxuICBmdW5jdGlvbiBIb3N0KG1ha2VMb3RzT2ZDb21wb25lbnRzKSB7XG4gICAgaWYgKG1ha2VMb3RzT2ZDb21wb25lbnRzID09IG51bGwpIHtcbiAgICAgIG1ha2VMb3RzT2ZDb21wb25lbnRzID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBcImFjdGl2ZVwiO1xuICAgIHRoaXMuaWQgPSBcImhvc3QuXCIgKyAoKytIb3N0Lmhvc3RDb3VudCk7XG4gICAgdGhpcy5uYW1lID0gXCJlYzIuXCIgKyBIb3N0Lmhvc3RDb3VudDtcbiAgICB0aGlzLnNlcnZlclNwZWNzSWQgPSBcImIxXCI7XG4gICAgdGhpcy5idW5raG91c2VJZCA9IFwiYnVua2hvdXNlXCI7XG4gICAgdGhpcy5hY3Rpb25QYXRoID0gXCIvc29tZS9wYXRoL3RvL2FjdGlvbnNcIjtcbiAgICB0aGlzLnBsYXRmb3JtU2VydmljZXMgPSBbbmV3IFBsYXRmb3JtQ29tcG9uZW50KFwibGJcIiwgXCJtZXNoXCIsIFwibmFub2JveC9wb3J0YWxcIiksIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChcImxnXCIsIFwibG9nZ2VyXCIsIFwibmFub2JveC9sb2d2YWNcIiksIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChcImhtXCIsIFwibW9uaXRvclwiLCBcIm5hbm9ib3gvcHVsc2VcIiksIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChcIm1yXCIsIFwicHVzaGVyXCIsIFwibmFub2JveC9taXN0XCIpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJnc1wiLCBcIndhcmVob3VzZVwiLCBcIm5hbm9ib3gvaG9hcmRlclwiKV07XG4gICAgdGhpcy5hcHBDb21wb25lbnRzID0gW107XG4gICAgdGhpcy5jcmVhdGVDb21wb25lbnRzKG1ha2VMb3RzT2ZDb21wb25lbnRzKTtcbiAgfVxuXG4gIEhvc3QucHJvdG90eXBlLmNyZWF0ZUNvbXBvbmVudHMgPSBmdW5jdGlvbihtYWtlTG90c09mQ29tcG9uZW50cykge1xuICAgIGlmICghbWFrZUxvdHNPZkNvbXBvbmVudHMpIHtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnbWlkZGxlbWFuJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ21vbmdvMTInLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAnbW9uZ28tZW5naW5lJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdub2RlLWVuZ2luZScsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdtZW1jYWNoZWQtZW5naW5lJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3B5dGhvbi1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnc3RvcmFnZS1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnamF2YS1lbmdpbmUnLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAncGhwLWVuZ2luZScsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ2NvdWNoLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdtYXJpYS1lbmdpbmUnLCBmYWxzZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAncG9zdGdyZXMtZW5naW5lJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ3JlZGlzLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdkYicsICdwZXJjb25hLWVuZ2luZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnc29tZXJhbmRvbWRiJywgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ25vdGhpbmd3aWxsbWF0Y2gnLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIEhvc3QucHJvdG90eXBlLmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUsIGlzSG9yaXpvbnRhbGx5U2NhbGFibGUsIGlzUmVkdW5kU2NhbGFibGUpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBDb21wb25lbnRzLnB1c2gobmV3IEFwcENvbXBvbmVudChraW5kLCB0eXBlLCBpc0hvcml6b250YWxseVNjYWxhYmxlLCBpc1JlZHVuZFNjYWxhYmxlKSk7XG4gIH07XG5cbiAgSG9zdC5wcm90b3R5cGUuc2VyaWFsaXplQ29tcG9uZW50cyA9IGZ1bmN0aW9uKGNvbXBvbmVudHMpIHtcbiAgICB2YXIgYXIsIGNvbXBvbmVudCwgaSwgbGVuO1xuICAgIGFyID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY29tcG9uZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50ID0gY29tcG9uZW50c1tpXTtcbiAgICAgIGFyLnB1c2goY29tcG9uZW50LnNlcmlhbGl6ZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyO1xuICB9O1xuXG4gIEhvc3QucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgc2VydmVyU3BlY3NJZDogdGhpcy5zZXJ2ZXJTcGVjc0lkLFxuICAgICAgYnVua2hvdXNlSWQ6IHRoaXMuYnVua2hvdXNlSWQsXG4gICAgICBhY3Rpb25QYXRoOiB0aGlzLmFjdGlvblBhdGgsXG4gICAgICBwbGF0Zm9ybVNlcnZpY2VzOiB0aGlzLnNlcmlhbGl6ZUNvbXBvbmVudHModGhpcy5wbGF0Zm9ybVNlcnZpY2VzKSxcbiAgICAgIGFwcENvbXBvbmVudHM6IHRoaXMuc2VyaWFsaXplQ29tcG9uZW50cyh0aGlzLmFwcENvbXBvbmVudHMpXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gSG9zdDtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIFBsYXRmb3JtQ29tcG9uZW50O1xuXG5BcHBDb21wb25lbnQgPSByZXF1aXJlKCcuL2FwcC1jb21wb25lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF0Zm9ybUNvbXBvbmVudCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUGxhdGZvcm1Db21wb25lbnQoaWQsIGtpbmQsIGNvbXBvbmVudEtpbmQpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5raW5kID0ga2luZDtcbiAgICBpZiAoY29tcG9uZW50S2luZCA9PSBudWxsKSB7XG4gICAgICBjb21wb25lbnRLaW5kID0gJ21pc3QnO1xuICAgIH1cbiAgICB0aGlzLmlzU3BsaXRhYmxlID0gdHJ1ZTtcbiAgICB0aGlzLm1vZGUgPSAnc2ltcGxlJztcbiAgICB0aGlzLmFkbWluUGF0aCA9IFwiL3NvbWUvcGF0aC90by9hZG1pblwiO1xuICAgIHRoaXMuY29tcG9uZW50cyA9IFtuZXcgQXBwQ29tcG9uZW50KCd3ZWInLCBjb21wb25lbnRLaW5kLCB0cnVlLCB0cnVlKS5zZXJpYWxpemUoKV07XG4gIH1cblxuICBQbGF0Zm9ybUNvbXBvbmVudC5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAga2luZDogdGhpcy5raW5kLFxuICAgICAgaXNTcGxpdGFibGU6IHRoaXMuaXNTcGxpdGFibGUsXG4gICAgICBtb2RlOiB0aGlzLm1vZGUsXG4gICAgICBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHNcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBQbGF0Zm9ybUNvbXBvbmVudDtcblxufSkoKTtcblxuKHtcbiAgaWQ6IFwibG9nZ2VyMVwiLFxuICBraW5kOiBcIm1lc2hcIixcbiAgbW9kZTogXCJzaW1wbGVcIixcbiAgaXNTcGxpdGFibGU6IHRydWUsXG4gIGNvbXBvbmVudHM6IFtcbiAgICB7XG4gICAgICBpZDogXCI5ZTYzZDcwMC1jODRlLTQ1ZWQtYmExNS1lZDE5MmZjZjkyYjJcIixcbiAgICAgIHVpZDogXCJkYXRhLnBvcnRhbFwiLFxuICAgICAgbmFtZTogXCJsdWNreS1saW1lXCIsXG4gICAgICBzdGF0ZTogXCJjcmVhdGVkXCIsXG4gICAgICBzZXJ2aWNlVHlwZTogXCJkZWZhdWx0LWRiXCIsXG4gICAgICBzY2FsZXNIb3JpejogZmFsc2UsXG4gICAgICBzY2FsZXNSZWR1bmQ6IGZhbHNlLFxuICAgICAgaXNTcGxpdGFibGU6IHRydWUsXG4gICAgICBnZW5lcmF0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IFwiZGF0YS5wb3J0YWwuZ2VuMVwiLFxuICAgICAgICAgIHN0YXRlOiBcImNyZWF0ZWRcIixcbiAgICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgICAgaW5zdGFuY2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICBob3N0SWQ6IFwidGVzdC1ob3N0LW5hbWVcIixcbiAgICAgICAgICAgICAgaG9zdE5hbWU6IFwidGVzdC1ob3N0LW5hbWVcIixcbiAgICAgICAgICAgICAgc3RhdGU6IFwiY3JlYXRlZFwiLFxuICAgICAgICAgICAgICBzdGF0dXM6IFwib25saW5lXCIsXG4gICAgICAgICAgICAgIHJvbGU6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgICBzZXJ2ZXJTcGVjc0lkOiBcIjUxMm1iXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn0pO1xuIiwidmFyICRob2xkZXIsIENsb2JiZXJCb3hEYXRhU2hpbSwgVUksIGJveGVzO1xuXG5VSSA9IHJlcXVpcmUoJy4vdGVzdC11aS91aScpO1xuXG5DbG9iYmVyQm94RGF0YVNoaW0gPSByZXF1aXJlKCcuL3NoaW1zL2RhdGEtc2hpbScpO1xuXG53aW5kb3cuY2xvYmJlckJveERhdGFTaGltID0gbmV3IENsb2JiZXJCb3hEYXRhU2hpbSgpO1xuXG5ib3hlcyA9IFtdO1xuXG4kaG9sZGVyID0gJChcIi5ob2xkZXJcIik7XG5cbndpbmRvdy5pbml0ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lcnMsIGdldEJveCwgZ2V0UGFyZW50T2ZDb21wb25lbnQsIGdldFBhcmVudE9mR2VuZXJhdGlvbiwgcmVtb3ZlQm94LCBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMsIHVpO1xuICAgIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gICAgdWkgPSBuZXcgVUkoJCgnYm9keScpKTtcbiAgICB3aW5kb3cuYWRkR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGNvbXBvbmVudElkLCBzdGF0ZSkge1xuICAgICAgdmFyIGdlbkRhdGE7XG4gICAgICBpZiAoc3RhdGUgPT0gbnVsbCkge1xuICAgICAgICBzdGF0ZSA9ICdwcm92aXNpb25pbmcnO1xuICAgICAgfVxuICAgICAgZ2VuRGF0YSA9IGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRHZW5lcmF0aW9uKGNvbXBvbmVudElkLCBzdGF0ZSkuc2VyaWFsaXplKCk7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZDb21wb25lbnQoY29tcG9uZW50SWQpLmFkZEdlbmVyYXRpb24oY29tcG9uZW50SWQsIGdlbkRhdGEpO1xuICAgIH07XG4gICAgd2luZG93LmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGhvc3RJZCkge1xuICAgICAgcmV0dXJuIGdldEJveChob3N0SWQpLmFkZENvbXBvbmVudChjbG9iYmVyQm94RGF0YVNoaW0uZ2V0QXBwQ29tcG9uZW50KCkuc2VyaWFsaXplKCkpO1xuICAgIH07XG4gICAgd2luZG93LnJlbW92ZUNvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudElkKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZDb21wb25lbnQoY29tcG9uZW50SWQpLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnRJZCk7XG4gICAgfTtcbiAgICB3aW5kb3cucmVtb3ZlR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGdlbmVyYXRpb25JZCkge1xuICAgICAgcmV0dXJuIGdldFBhcmVudE9mR2VuZXJhdGlvbihnZW5lcmF0aW9uSWQpLnJlbW92ZUdlbmVyYXRpb24oZ2VuZXJhdGlvbklkKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRIb3N0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaG9zdEJveDtcbiAgICAgIGhvc3RCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgICBob3N0Qm94LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5IT1NULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0SG9zdChmYWxzZSkuc2VyaWFsaXplKCkpO1xuICAgICAgcmV0dXJuIHVpLm5vdGVDb21wb25lbnRzKGhvc3RCb3gpO1xuICAgIH07XG4gICAgd2luZG93LmFkZENsdXN0ZXIgPSBmdW5jdGlvbihjbHVzdGVyRGF0YSkge1xuICAgICAgdmFyIGNsdXN0ZXJCb3gsIGRhdGEsIGdlbmVyYXRpb24sIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gY2x1c3RlckRhdGEuZ2VuZXJhdGlvbnM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgZ2VuZXJhdGlvbiA9IHJlZltqXTtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBzZXJ2aWNlSWQ6IGNsdXN0ZXJEYXRhLmlkLFxuICAgICAgICAgIHNlcnZpY2VTdGF0ZTogY2x1c3RlckRhdGEuc3RhdGUsXG4gICAgICAgICAgbmFtZTogY2x1c3RlckRhdGEubmFtZSxcbiAgICAgICAgICBzZXJ2aWNlVHlwZTogY2x1c3RlckRhdGEuc2VydmljZVR5cGUsXG4gICAgICAgICAgc2NhbGVzSG9yaXo6IGNsdXN0ZXJEYXRhLnNjYWxlc0hvcml6LFxuICAgICAgICAgIHNjYWxlc1JlZHVuZDogY2x1c3RlckRhdGEuc2NhbGVzUmVkdW5kLFxuICAgICAgICAgIGNhdGVnb3J5OiBjbHVzdGVyRGF0YS5jYXRlZ29yeSxcbiAgICAgICAgICBjbHVzdGVyYWJsZTogY2x1c3RlckRhdGEuY2x1c3RlcmFibGUsXG4gICAgICAgICAgYWRtaW5QYXRoOiBjbHVzdGVyRGF0YS5hZG1pblBhdGgsXG4gICAgICAgICAgYWN0aW9uUGF0aDogY2x1c3RlckRhdGEuYWRtaW5QYXRoLFxuICAgICAgICAgIGluc3RhbmNlczogY2x1c3RlckRhdGEuaW5zdGFuY2VzLFxuICAgICAgICAgIGlkOiBnZW5lcmF0aW9uLmlkLFxuICAgICAgICAgIGdlbmVyYXRpb25TdGF0ZTogZ2VuZXJhdGlvbi5zdGF0ZSxcbiAgICAgICAgICBnZW5lcmF0aW9uU3RhdHVzOiBnZW5lcmF0aW9uLnN0YXR1cyxcbiAgICAgICAgICBtZW1iZXJzOiBnZW5lcmF0aW9uLmluc3RhbmNlcyxcbiAgICAgICAgICB0b3RhbE1lbWJlcnM6IGdlbmVyYXRpb24uaW5zdGFuY2VzLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBjbHVzdGVyQm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgICAgICByZXN1bHRzLnB1c2goY2x1c3RlckJveC5idWlsZCgkaG9sZGVyLCBuYW5vYm94LkNsb2JiZXJCb3guQ0xVU1RFUiwgZGF0YSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcbiAgICB3aW5kb3cuc2V0U3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICAgIHJldHVybiBnZXRCb3goaWQpLnNldFN0YXRlKHN0YXRlKTtcbiAgICB9O1xuICAgIHdpbmRvdy5tYW5hZ2VDb21wb25lbnQgPSBmdW5jdGlvbihjb21wb25lbnRJZCkge1xuICAgICAgdmFyIGJveCwgYm94SG9zdCwgeDtcbiAgICAgIGJveCA9IGdldEJveChjb21wb25lbnRJZCk7XG4gICAgICBpZiAoYm94ICE9IG51bGwpIHtcbiAgICAgICAgeCA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGJveEhvc3QgPSBnZXRQYXJlbnRPZkNvbXBvbmVudCgpO1xuICAgICAgaWYgKGJveEhvc3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4geCA9IDA7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aW5kb3cuc2V0R2VuZXJhdGlvblN0YXRlID0gZnVuY3Rpb24oaWQsIHN0YXRlKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZHZW5lcmF0aW9uKGlkKS5zZXRHZW5lcmF0aW9uU3RhdGUoaWQsIHN0YXRlKTtcbiAgICB9O1xuICAgIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0NBTEUuR0VUX09QVElPTlMnLCBmdW5jdGlvbihtLCBjYikge1xuICAgICAgICByZXR1cm4gY2Ioc2NhbGVNYWNoaW5lVGVzdERhdGEuZ2V0SG9zdE9wdGlvbnMoKSk7XG4gICAgICB9KTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ0dFVF9CVU5LSE9VU0VTJywgZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jYihbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IFwiYVwiLFxuICAgICAgICAgICAgbmFtZTogXCJFQzIgMVwiLFxuICAgICAgICAgICAgY3VycmVudDogdHJ1ZVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGlkOiBcImNcIixcbiAgICAgICAgICAgIG5hbWU6IFwiRUMyIDNcIlxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9KTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1JFR0lTVEVSJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgICByZXR1cm4gYm94ZXMucHVzaChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnVU5SRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgICAgcmV0dXJuIHJlbW92ZUJveChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0NBTEUuU0FWRScsIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXcgU2NhbGU6XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuc3VibWl0Q2IoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1NQTElULlNBVkUnLCBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3BsaXQ6XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuc3VibWl0Q2IoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQVBQX0NPTVBPTkVOVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ2FwcC1jb21wb25lbnRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlBMQVRGT1JNX0NPTVBPTkVOVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3BsYXRmb3JtLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuSE9TVC1JTlRBTkNFUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnaG9zdC1pbnN0YW5jZXMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU0NBTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3NjYWxlLW1hY2hpbmUnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1RBVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3N0YXRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkNPTlNPTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ2NvbnNvbGUnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1BMSVQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3NwbGl0JywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BRE1JTicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnYWRtaW4nLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuICAgIGdldEJveCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW47XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBib3ggPSBib3hlc1tqXTtcbiAgICAgICAgaWYgKGlkID09PSBib3guaWQpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRQYXJlbnRPZkNvbXBvbmVudCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW47XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBib3ggPSBib3hlc1tqXTtcbiAgICAgICAgaWYgKGJveC5oYXNDb21wb25lbnRXaXRoSWQoaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0UGFyZW50T2ZHZW5lcmF0aW9uID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoYm94Lmhhc0dlbmVyYXRpb25XaXRoSWQoaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmVtb3ZlQm94ID0gZnVuY3Rpb24oZG9vbWVkQm94KSB7XG4gICAgICB2YXIgYm94LCBpLCBqLCBsZW47XG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2ldO1xuICAgICAgICBpZiAoYm94LmlkID09PSBkb29tZWRCb3guaWQpIHtcbiAgICAgICAgICBib3hlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMoKTtcbiAgICBhZGRFdmVudExpc3RlbmVycygpO1xuICAgIGFkZENsdXN0ZXIoY2xvYmJlckJveERhdGFTaGltLmdldEhvcml6Q2x1c3RlcigpLnNlcmlhbGl6ZSgpKTtcbiAgICB3aW5kb3cuc2V0Tm9EZXBsb3lzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KFwiaG9zdC4xXCIpLnNob3dBc1JlYWR5Rm9yRGVwbG95cygpO1xuICAgIH07XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wb25lbnREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KFwiaG9zdC4xXCIpLmdldERhdGFGb3JVc2FnZUJyZWFrZG93bigpO1xuICAgIH07XG4gIH07XG59KSh0aGlzKTtcbiIsInZhciBVSTtcblxubW9kdWxlLmV4cG9ydHMgPSBVSSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVUkoKSB7XG4gICAgdGhpcy5pbml0U3RhdGVTZWxlY3RvcigkKFwiLnN0YXRlc1wiKSk7XG4gICAgdGhpcy5pbml0RXZlbnRzKCk7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdGVyQm94KGJveCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuXG4gIFVJLnByb3RvdHlwZS5yZWdpc3RlckJveCA9IGZ1bmN0aW9uKGJveCkge1xuICAgIGlmIChib3guZGF0YS5pZC5pbmNsdWRlcygnZ2VuJykpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnLmdlbmVyYXRpb25zJywgJy51aS1zaGltJyksIGJveCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnLmhvc3RzJywgJy51aS1zaGltJyksIGJveCk7XG4gICAgfVxuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5hZGRUb1NlbGVjdG9yID0gZnVuY3Rpb24oJHNlbGVjdG9yLCBib3gpIHtcbiAgICBpZiAoJChcIm9wdGlvblt2YWx1ZT0nXCIgKyBib3guZGF0YS5pZCArIFwiJ11cIiwgJHNlbGVjdG9yKS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuICRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGJveC5kYXRhLmlkICsgXCInPlwiICsgYm94LmRhdGEuaWQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgfTtcblxuICBVSS5wcm90b3R5cGUuaW5pdFN0YXRlU2VsZWN0b3IgPSBmdW5jdGlvbigkc2VsZWN0b3IpIHtcbiAgICB2YXIgaSwgbGVuLCByZXN1bHRzLCBzdGF0ZSwgc3RhdGVzO1xuICAgIHN0YXRlcyA9IFsnJywgJ2NyZWF0ZWQnLCAnaW5pdGlhbGl6ZWQnLCAnb3JkZXJlZCcsICdwcm92aXNpb25pbmcnLCAnZGVmdW5jdCcsICdhY3RpdmUnLCAnZGVjb21pc3Npb25pbmcnLCAnZGVzdHJveScsICdhcmNoaXZlZCddO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0YXRlID0gc3RhdGVzW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKCRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHN0YXRlICsgXCInPlwiICsgc3RhdGUgKyBcIjwvb3B0aW9uPlwiKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgJChcImJ1dHRvbiNob3N0c1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2hvc3RzLXN0YXRlLXNlbGVjdG9yXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjaG9zdC1zdGF0ZXNcIikudmFsKCk7XG4gICAgICAgIHJldHVybiBzZXRTdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNnZW5lcmF0aW9uc1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2dlbmVyYXRpb25zLXN0YXRlLXNlbGVjdG9yXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjZ2VuLXN0YXRlc1wiKS52YWwoKTtcbiAgICAgICAgcmV0dXJuIHNldEdlbmVyYXRpb25TdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNhZGQtZ2VuZXJhdGlvblwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFkZEdlbmVyYXRpb24oJChcInNlbGVjdCNhZGQtZ2VuZXJhdGlvbi1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNyZW1vdmUtZ2VuZXJhdGlvblwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUdlbmVyYXRpb24oJChcInNlbGVjdCNyZW1vdmUtZ2VuZXJhdGlvbi1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNhZGQtY29tcG9uZW50XCIpLm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWRkQ29tcG9uZW50KCQoXCJzZWxlY3QjYWRkLWNvbXBvbmVudC1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuICQoXCJidXR0b24jcmVtb3ZlLWNvbXBvbmVudFwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUNvbXBvbmVudCgkKFwic2VsZWN0I3JlbW92ZS1jb21wb25lbnQtc2VsZWN0XCIpLnZhbCgpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5ub3RlQ29tcG9uZW50cyA9IGZ1bmN0aW9uKGJveCkge1xuICAgIHZhciAkc2VsZWN0b3IsIGNvbXBvbmVudCwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgJHNlbGVjdG9yID0gJChcInNlbGVjdC5jb21wb25lbnRzXCIpO1xuICAgIHJlZiA9IGJveC5kYXRhLmFwcENvbXBvbmVudHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50ID0gcmVmW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKCRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGNvbXBvbmVudC5pZCArIFwiJz5cIiArIGNvbXBvbmVudC5pZCArIFwiPC9vcHRpb24+XCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgcmV0dXJuIFVJO1xuXG59KSgpO1xuIl19
