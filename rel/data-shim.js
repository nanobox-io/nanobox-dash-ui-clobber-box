(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AppComponent;

module.exports = AppComponent = (function() {
  AppComponent.appComponentCount = 0;

  function AppComponent(kind, type, scalesHorizontally) {
    if (kind == null) {
      kind = 'web';
    }
    this.type = type != null ? type : "ruby";
    this.scalesHorizontally = scalesHorizontally != null ? scalesHorizontally : true;
    this.generationCount = 1;
    this.state = 'active';
    this.serverSpecsId = "b3";
    this.id = kind + "." + (++AppComponent.appComponentCount);
    this.name = kind + " " + AppComponent.appComponentCount;
    this.generations = [];
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
      scalesHoriz: this.scalesHorizontally
    };
  };

  return AppComponent;

})();

},{}],2:[function(require,module,exports){
var AppComponent, DataCluster, Host, x;

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
    this.scalesHoriz = false;
    this.scalesRedund = true;
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
      scalesHoriz: this.scalesHoriz,
      scalesRedund: this.scalesRedund,
      generations: this.generations,
      serviceType: this.serviceType
    };
  };

  return DataCluster;

})();

x = {
  "id": "web.main",
  "name": "jade-jug",
  "state": "active",
  "serviceType": "default",
  "scalesHoriz": true,
  "scalesRedund": false,
  "generations": [
    {
      "id": "web.main.gen2",
      "state": "active",
      "status": "online",
      "instances": [
        {
          "id": 1,
          "hostId": "do.2",
          "hostName": "do.2",
          "state": "active",
          "status": "online",
          "role": "default",
          "serverSpecsId": "512mb"
        }
      ]
    }
  ]
};

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
    return new DataCluster;
  };

  ClobberBoxDataShim.prototype.getAppComponent = function(kind, type, scalesHorizontally) {
    return new AppComponent(kind, type, scalesHorizontally);
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
    return DAtaCluster.clusterCount = 0;
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
var AppComponent, HorizCluster, Host, x;

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
    this.serviceType = "python";
    this.scalesHoriz = true;
    this.scalesRedund = false;
    this.generations = [];
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
      scalesRedund: this.scalesRedund,
      generations: this.generations,
      serviceType: this.serviceType
    };
  };

  return HorizCluster;

})();

x = {
  "id": "web.main",
  "name": "jade-jug",
  "state": "active",
  "serviceType": "default",
  "scalesHoriz": true,
  "scalesRedund": false,
  "generations": [
    {
      "id": "web.main.gen2",
      "state": "active",
      "status": "online",
      "instances": [
        {
          "id": 1,
          "hostId": "do.2",
          "hostName": "do.2",
          "state": "active",
          "status": "online",
          "role": "default",
          "serverSpecsId": "512mb"
        }
      ]
    }
  ]
};

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
    this.platformComponents = [new PlatformComponent("lb", "mesh"), new PlatformComponent("lg", "logger"), new PlatformComponent("hm", "monitor"), new PlatformComponent("mr", "pusher"), new PlatformComponent("gs", "warehouse")];
    this.appComponents = [];
    this.createComponents(makeLotsOfComponents);
  }

  Host.prototype.createComponents = function(makeLotsOfComponents) {
    if (!makeLotsOfComponents) {
      this.addComponent();
      return this.addComponent('db', 'mongo-db', false);
    } else {
      this.addComponent();
      this.addComponent('db', 'mongo-db', false);
      this.addComponent('web', 'node', true);
      this.addComponent('web', 'memcached', true);
      this.addComponent('web', 'python', true);
      this.addComponent('web', 'storage', true);
      this.addComponent('web', 'java', true);
      this.addComponent('web', 'php', true);
      this.addComponent('db', 'couch-db', false);
      this.addComponent('db', 'maria-db', false);
      this.addComponent('db', 'postgres-db', false);
      this.addComponent('db', 'redis', false);
      this.addComponent('db', 'percona-db', false);
      this.addComponent('web', 'default', true);
      return this.addComponent('db', 'default-db', false);
    }
  };

  Host.prototype.addComponent = function(kind, type, isHorizontallyScalable) {
    return this.appComponents.push(new AppComponent(kind, type, isHorizontallyScalable));
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
      platformComponents: this.serializeComponents(this.platformComponents),
      appComponents: this.serializeComponents(this.appComponents)
    };
  };

  return Host;

})();

},{"./app-component":1,"./platform-component":7}],7:[function(require,module,exports){
var PlatformComponent;

module.exports = PlatformComponent = (function() {
  function PlatformComponent(id, kind) {
    this.id = id;
    this.kind = kind;
    this.isSplitable = Math.random() > 0.5;
    this.state = "active";
  }

  PlatformComponent.prototype.serialize = function() {
    return {
      id: this.id,
      kind: this.kind,
      isSplitable: this.isSplitable,
      state: this.state
    };
  };

  return PlatformComponent;

})();

},{}],8:[function(require,module,exports){
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
      hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost(true).serialize());
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
    window.setGenerationState = function(id, state) {
      return getParentOfGeneration(id).setGenerationState(id, state);
    };
    subscribeToRegistrations = function() {
      PubSub.subscribe('SCALE.GET_OPTIONS', function(m, cb) {
        return cb(scaleMachineTestData.getHostOptions());
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
        return console.log(data);
      });
      return PubSub.subscribe('SPLIT.SAVE', function(m, data) {
        console.log("Split:");
        return console.log(data);
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
    addHost();
    addCluster(clobberBoxDataShim.getHorizCluster().serialize());
    return addCluster(clobberBoxDataShim.getDataCluster().serialize());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvYXBwLWNvbXBvbmVudC5jb2ZmZWUiLCJzaGltcy9kYXRhLWNsdXN0ZXIuY29mZmVlIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInNoaW1zL2dlbmVyYXRpb24uY29mZmVlIiwic2hpbXMvaG9yaXotY2x1c3Rlci5jb2ZmZWUiLCJzaGltcy9ob3N0LmNvZmZlZSIsInNoaW1zL3BsYXRmb3JtLWNvbXBvbmVudC5jb2ZmZWUiLCJzdGFnZS5jb2ZmZWUiLCJ0ZXN0LXVpL3VpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBBcHBDb21wb25lbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29tcG9uZW50ID0gKGZ1bmN0aW9uKCkge1xuICBBcHBDb21wb25lbnQuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEFwcENvbXBvbmVudChraW5kLCB0eXBlLCBzY2FsZXNIb3Jpem9udGFsbHkpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIHRoaXMudHlwZSA9IHR5cGUgIT0gbnVsbCA/IHR5cGUgOiBcInJ1YnlcIjtcbiAgICB0aGlzLnNjYWxlc0hvcml6b250YWxseSA9IHNjYWxlc0hvcml6b250YWxseSAhPSBudWxsID8gc2NhbGVzSG9yaXpvbnRhbGx5IDogdHJ1ZTtcbiAgICB0aGlzLmdlbmVyYXRpb25Db3VudCA9IDE7XG4gICAgdGhpcy5zdGF0ZSA9ICdhY3RpdmUnO1xuICAgIHRoaXMuc2VydmVyU3BlY3NJZCA9IFwiYjNcIjtcbiAgICB0aGlzLmlkID0ga2luZCArIFwiLlwiICsgKCsrQXBwQ29tcG9uZW50LmFwcENvbXBvbmVudENvdW50KTtcbiAgICB0aGlzLm5hbWUgPSBraW5kICsgXCIgXCIgKyBBcHBDb21wb25lbnQuYXBwQ29tcG9uZW50Q291bnQ7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWRkR2VuZXJhdGlvbigpO1xuICB9XG5cbiAgQXBwQ29tcG9uZW50LnByb3RvdHlwZS5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT0gbnVsbCkge1xuICAgICAgc3RhdGUgPSAnYWN0aXZlJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGlvbnMucHVzaCh7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBpZDogdGhpcy5pZCArIFwiLmdlblwiICsgKHRoaXMuZ2VuZXJhdGlvbkNvdW50KyspXG4gICAgfSk7XG4gIH07XG5cbiAgQXBwQ29tcG9uZW50LnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2VuZXJhdGlvbnM6IHRoaXMuZ2VuZXJhdGlvbnMsXG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIHNlcnZlclNwZWNzSWQ6IHRoaXMuc2VydmVyU3BlY3NJZCxcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgc2VydmljZVR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHNjYWxlc0hvcml6OiB0aGlzLnNjYWxlc0hvcml6b250YWxseVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEFwcENvbXBvbmVudDtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIERhdGFDbHVzdGVyLCBIb3N0LCB4O1xuXG5BcHBDb21wb25lbnQgPSByZXF1aXJlKCcuL2FwcC1jb21wb25lbnQnKTtcblxuSG9zdCA9IHJlcXVpcmUoJy4vaG9zdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFDbHVzdGVyID0gKGZ1bmN0aW9uKCkge1xuICBEYXRhQ2x1c3Rlci5jbHVzdGVyQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIERhdGFDbHVzdGVyKCkge1xuICAgIHZhciBnZW5lcmF0aW9uLCBpLCBqLCBrLCBsZW4sIHJlZiwgcm9sZSwgcm9sZXMsIHRvdGFsR2VuZXJhdGlvbnM7XG4gICAgdG90YWxHZW5lcmF0aW9ucyA9IDE7XG4gICAgdGhpcy5pZCA9IFwiY2x1c3Rlci5cIiArIERhdGFDbHVzdGVyLmNsdXN0ZXJDb3VudDtcbiAgICB0aGlzLm5hbWUgPSBcIkN1c3RvbWVycyBEQlwiO1xuICAgIHRoaXMuc3RhdGUgPSBcImFjdGl2ZVwiO1xuICAgIHRoaXMuc2VydmljZVR5cGUgPSBcIm15c3FsLWRiXCI7XG4gICAgdGhpcy5zY2FsZXNIb3JpeiA9IGZhbHNlO1xuICAgIHRoaXMuc2NhbGVzUmVkdW5kID0gdHJ1ZTtcbiAgICB0aGlzLmdlbmVyYXRpb25zID0gW107XG4gICAgZm9yIChpID0gaiA9IDEsIHJlZiA9IHRvdGFsR2VuZXJhdGlvbnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBnZW5lcmF0aW9uID0ge1xuICAgICAgICBpZDogXCJkYi5tYWluLmdlblwiICsgaSxcbiAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgaW5zdGFuY2VzOiBbXVxuICAgICAgfTtcbiAgICAgIHJvbGVzID0gWydwcmltYXJ5JywgJ3NlY29uZGFyeScsICdhcmJpdGVyJ107XG4gICAgICBmb3IgKGkgPSBrID0gMCwgbGVuID0gcm9sZXMubGVuZ3RoOyBrIDwgbGVuOyBpID0gKytrKSB7XG4gICAgICAgIHJvbGUgPSByb2xlc1tpXTtcbiAgICAgICAgZ2VuZXJhdGlvbi5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgaG9zdElkOiBcImRvLlwiICsgaSxcbiAgICAgICAgICBob3N0TmFtZTogXCJkby5cIiArIGksXG4gICAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgc2VydmVyU3BlY3NJZDogXCJiMlwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIERhdGFDbHVzdGVyLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIHNjYWxlc0hvcml6OiB0aGlzLnNjYWxlc0hvcml6LFxuICAgICAgc2NhbGVzUmVkdW5kOiB0aGlzLnNjYWxlc1JlZHVuZCxcbiAgICAgIGdlbmVyYXRpb25zOiB0aGlzLmdlbmVyYXRpb25zLFxuICAgICAgc2VydmljZVR5cGU6IHRoaXMuc2VydmljZVR5cGVcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBEYXRhQ2x1c3RlcjtcblxufSkoKTtcblxueCA9IHtcbiAgXCJpZFwiOiBcIndlYi5tYWluXCIsXG4gIFwibmFtZVwiOiBcImphZGUtanVnXCIsXG4gIFwic3RhdGVcIjogXCJhY3RpdmVcIixcbiAgXCJzZXJ2aWNlVHlwZVwiOiBcImRlZmF1bHRcIixcbiAgXCJzY2FsZXNIb3JpelwiOiB0cnVlLFxuICBcInNjYWxlc1JlZHVuZFwiOiBmYWxzZSxcbiAgXCJnZW5lcmF0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJpZFwiOiBcIndlYi5tYWluLmdlbjJcIixcbiAgICAgIFwic3RhdGVcIjogXCJhY3RpdmVcIixcbiAgICAgIFwic3RhdHVzXCI6IFwib25saW5lXCIsXG4gICAgICBcImluc3RhbmNlc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImlkXCI6IDEsXG4gICAgICAgICAgXCJob3N0SWRcIjogXCJkby4yXCIsXG4gICAgICAgICAgXCJob3N0TmFtZVwiOiBcImRvLjJcIixcbiAgICAgICAgICBcInN0YXRlXCI6IFwiYWN0aXZlXCIsXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJvbmxpbmVcIixcbiAgICAgICAgICBcInJvbGVcIjogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgXCJzZXJ2ZXJTcGVjc0lkXCI6IFwiNTEybWJcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xuIiwidmFyIEFwcENvbXBvbmVudCwgQ2xvYmJlckJveERhdGFTaGltLCBEYXRhQ2x1c3RlciwgR2VuZXJhdGlvbiwgSG9yaXpDbHVzdGVyLCBIb3N0LCBQbGF0Zm9ybUNvbXBvbmVudDtcblxuQXBwQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9hcHAtY29tcG9uZW50Jyk7XG5cblBsYXRmb3JtQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9wbGF0Zm9ybS1jb21wb25lbnQnKTtcblxuSG9zdCA9IHJlcXVpcmUoJy4vaG9zdCcpO1xuXG5Ib3JpekNsdXN0ZXIgPSByZXF1aXJlKCcuL2hvcml6LWNsdXN0ZXInKTtcblxuRGF0YUNsdXN0ZXIgPSByZXF1aXJlKCcuL2RhdGEtY2x1c3RlcicpO1xuXG5HZW5lcmF0aW9uID0gcmVxdWlyZSgnLi9nZW5lcmF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvYmJlckJveERhdGFTaGltID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDbG9iYmVyQm94RGF0YVNoaW0oKSB7fVxuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0SG9zdCA9IGZ1bmN0aW9uKG1ha2VMb3RzT2ZDb21wb25lbnRzKSB7XG4gICAgaWYgKG1ha2VMb3RzT2ZDb21wb25lbnRzID09IG51bGwpIHtcbiAgICAgIG1ha2VMb3RzT2ZDb21wb25lbnRzID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSG9zdChtYWtlTG90c09mQ29tcG9uZW50cyk7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3JpekNsdXN0ZXIgPSBmdW5jdGlvbih0b3RhbE1lbWJlcnMpIHtcbiAgICByZXR1cm4gbmV3IEhvcml6Q2x1c3Rlcih0b3RhbE1lbWJlcnMpO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0RGF0YUNsdXN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGFDbHVzdGVyO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0QXBwQ29tcG9uZW50ID0gZnVuY3Rpb24oa2luZCwgdHlwZSwgc2NhbGVzSG9yaXpvbnRhbGx5KSB7XG4gICAgcmV0dXJuIG5ldyBBcHBDb21wb25lbnQoa2luZCwgdHlwZSwgc2NhbGVzSG9yaXpvbnRhbGx5KTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldFBsYXRmb3JtQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQsIGtpbmQpIHtcbiAgICByZXR1cm4gbmV3IFBsYXRmb3JtQ29tcG9uZW50KGlkLCBraW5kKTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEdlbmVyYXRpb24gPSBmdW5jdGlvbihwYXJlbnRJZCwgc3RhdGUpIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyYXRpb24ocGFyZW50SWQsIHN0YXRlKTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLnJlc2V0Q291bnRzID0gZnVuY3Rpb24oKSB7XG4gICAgSG9zdC5ob3N0Q291bnQgPSAwO1xuICAgIEFwcENvbXBvbmVudC5hcHBDb21wb25lbnRDb3VudCA9IDA7XG4gICAgSG9yaXpDbHVzdGVyLmNsdXN0ZXJDb3VudCA9IDA7XG4gICAgcmV0dXJuIERBdGFDbHVzdGVyLmNsdXN0ZXJDb3VudCA9IDA7XG4gIH07XG5cbiAgcmV0dXJuIENsb2JiZXJCb3hEYXRhU2hpbTtcblxufSkoKTtcbiIsInZhciBHZW5lcmF0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRpb24gPSAoZnVuY3Rpb24oKSB7XG4gIEdlbmVyYXRpb24uZ2VuZXJpY0dlbmVyYXRpb25Db3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gR2VuZXJhdGlvbihwYXJlbnRJZCwgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT0gbnVsbCkge1xuICAgICAgc3RhdGUgPSAnYWN0aXZlJztcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuaWQgPSBwYXJlbnRJZCArIFwiLmdlblwiICsgKEdlbmVyYXRpb24uZ2VuZXJpY0dlbmVyYXRpb25Db3VudCsrKTtcbiAgfVxuXG4gIEdlbmVyYXRpb24ucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIGlkOiB0aGlzLmlkXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gR2VuZXJhdGlvbjtcblxufSkoKTtcbiIsInZhciBBcHBDb21wb25lbnQsIEhvcml6Q2x1c3RlciwgSG9zdCwgeDtcblxuQXBwQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9hcHAtY29tcG9uZW50Jyk7XG5cbkhvc3QgPSByZXF1aXJlKCcuL2hvc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb3JpekNsdXN0ZXIgPSAoZnVuY3Rpb24oKSB7XG4gIEhvcml6Q2x1c3Rlci5jbHVzdGVyQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEhvcml6Q2x1c3Rlcih0b3RhbE1lbWJlcnMsIHRvdGFsR2VuZXJhdGlvbnMpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbiwgaSwgaiwgaywgcmVmLCByZWYxO1xuICAgIGlmICh0b3RhbE1lbWJlcnMgPT0gbnVsbCkge1xuICAgICAgdG90YWxNZW1iZXJzID0gNDtcbiAgICB9XG4gICAgaWYgKHRvdGFsR2VuZXJhdGlvbnMgPT0gbnVsbCkge1xuICAgICAgdG90YWxHZW5lcmF0aW9ucyA9IDE7XG4gICAgfVxuICAgIHRoaXMuaWQgPSBcImNsdXN0ZXIuXCIgKyBIb3JpekNsdXN0ZXIuY2x1c3RlckNvdW50O1xuICAgIHRoaXMubmFtZSA9IFwiTWFpbiBBcHBcIjtcbiAgICB0aGlzLnN0YXRlID0gXCJhY3RpdmVcIjtcbiAgICB0aGlzLnNlcnZpY2VUeXBlID0gXCJweXRob25cIjtcbiAgICB0aGlzLnNjYWxlc0hvcml6ID0gdHJ1ZTtcbiAgICB0aGlzLnNjYWxlc1JlZHVuZCA9IGZhbHNlO1xuICAgIHRoaXMuZ2VuZXJhdGlvbnMgPSBbXTtcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxHZW5lcmF0aW9uczsgMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmOyBpID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGdlbmVyYXRpb24gPSB7XG4gICAgICAgIGlkOiBcIndlYi5tYWluLmdlblwiICsgaSxcbiAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgaW5zdGFuY2VzOiBbXVxuICAgICAgfTtcbiAgICAgIGZvciAoaSA9IGsgPSAxLCByZWYxID0gdG90YWxNZW1iZXJzOyAxIDw9IHJlZjEgPyBrIDw9IHJlZjEgOiBrID49IHJlZjE7IGkgPSAxIDw9IHJlZjEgPyArK2sgOiAtLWspIHtcbiAgICAgICAgZ2VuZXJhdGlvbi5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgaG9zdElkOiBcImRvLlwiICsgaSxcbiAgICAgICAgICBob3N0TmFtZTogXCJkby5cIiArIGksXG4gICAgICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICAgICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgICAgICAgIHJvbGU6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgIHNlcnZlclNwZWNzSWQ6IFwiYjJcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGlvbnMucHVzaChnZW5lcmF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBIb3JpekNsdXN0ZXIucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgc2NhbGVzSG9yaXo6IHRoaXMuc2NhbGVzSG9yaXosXG4gICAgICBzY2FsZXNSZWR1bmQ6IHRoaXMuc2NhbGVzUmVkdW5kLFxuICAgICAgZ2VuZXJhdGlvbnM6IHRoaXMuZ2VuZXJhdGlvbnMsXG4gICAgICBzZXJ2aWNlVHlwZTogdGhpcy5zZXJ2aWNlVHlwZVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEhvcml6Q2x1c3RlcjtcblxufSkoKTtcblxueCA9IHtcbiAgXCJpZFwiOiBcIndlYi5tYWluXCIsXG4gIFwibmFtZVwiOiBcImphZGUtanVnXCIsXG4gIFwic3RhdGVcIjogXCJhY3RpdmVcIixcbiAgXCJzZXJ2aWNlVHlwZVwiOiBcImRlZmF1bHRcIixcbiAgXCJzY2FsZXNIb3JpelwiOiB0cnVlLFxuICBcInNjYWxlc1JlZHVuZFwiOiBmYWxzZSxcbiAgXCJnZW5lcmF0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJpZFwiOiBcIndlYi5tYWluLmdlbjJcIixcbiAgICAgIFwic3RhdGVcIjogXCJhY3RpdmVcIixcbiAgICAgIFwic3RhdHVzXCI6IFwib25saW5lXCIsXG4gICAgICBcImluc3RhbmNlc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImlkXCI6IDEsXG4gICAgICAgICAgXCJob3N0SWRcIjogXCJkby4yXCIsXG4gICAgICAgICAgXCJob3N0TmFtZVwiOiBcImRvLjJcIixcbiAgICAgICAgICBcInN0YXRlXCI6IFwiYWN0aXZlXCIsXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJvbmxpbmVcIixcbiAgICAgICAgICBcInJvbGVcIjogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgXCJzZXJ2ZXJTcGVjc0lkXCI6IFwiNTEybWJcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xuIiwidmFyIEFwcENvbXBvbmVudCwgSG9zdCwgUGxhdGZvcm1Db21wb25lbnQ7XG5cbkFwcENvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwLWNvbXBvbmVudCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcGxhdGZvcm0tY29tcG9uZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9zdCA9IChmdW5jdGlvbigpIHtcbiAgSG9zdC5ob3N0Q291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIEhvc3QobWFrZUxvdHNPZkNvbXBvbmVudHMpIHtcbiAgICBpZiAobWFrZUxvdHNPZkNvbXBvbmVudHMgPT0gbnVsbCkge1xuICAgICAgbWFrZUxvdHNPZkNvbXBvbmVudHMgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5pZCA9IFwiaG9zdC5cIiArICgrK0hvc3QuaG9zdENvdW50KTtcbiAgICB0aGlzLm5hbWUgPSBcImVjMi5cIiArIEhvc3QuaG9zdENvdW50O1xuICAgIHRoaXMuc2VydmVyU3BlY3NJZCA9IFwiYjFcIjtcbiAgICB0aGlzLmJ1bmtob3VzZUlkID0gXCJidW5raG91c2VcIjtcbiAgICB0aGlzLnBsYXRmb3JtQ29tcG9uZW50cyA9IFtuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJsYlwiLCBcIm1lc2hcIiksIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChcImxnXCIsIFwibG9nZ2VyXCIpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIm1vbml0b3JcIiksIG5ldyBQbGF0Zm9ybUNvbXBvbmVudChcIm1yXCIsIFwicHVzaGVyXCIpLCBuZXcgUGxhdGZvcm1Db21wb25lbnQoXCJnc1wiLCBcIndhcmVob3VzZVwiKV07XG4gICAgdGhpcy5hcHBDb21wb25lbnRzID0gW107XG4gICAgdGhpcy5jcmVhdGVDb21wb25lbnRzKG1ha2VMb3RzT2ZDb21wb25lbnRzKTtcbiAgfVxuXG4gIEhvc3QucHJvdG90eXBlLmNyZWF0ZUNvbXBvbmVudHMgPSBmdW5jdGlvbihtYWtlTG90c09mQ29tcG9uZW50cykge1xuICAgIGlmICghbWFrZUxvdHNPZkNvbXBvbmVudHMpIHtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCk7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJywgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdub2RlJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ21lbWNhY2hlZCcsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdweXRob24nLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCd3ZWInLCAnc3RvcmFnZScsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ3dlYicsICdqYXZhJywgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ3BocCcsIHRydWUpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ2NvdWNoLWRiJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ21hcmlhLWRiJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ3Bvc3RncmVzLWRiJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ3JlZGlzJywgZmFsc2UpO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoJ2RiJywgJ3BlcmNvbmEtZGInLCBmYWxzZSk7XG4gICAgICB0aGlzLmFkZENvbXBvbmVudCgnd2ViJywgJ2RlZmF1bHQnLCB0cnVlKTtcbiAgICAgIHJldHVybiB0aGlzLmFkZENvbXBvbmVudCgnZGInLCAnZGVmYXVsdC1kYicsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgSG9zdC5wcm90b3R5cGUuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oa2luZCwgdHlwZSwgaXNIb3Jpem9udGFsbHlTY2FsYWJsZSkge1xuICAgIHJldHVybiB0aGlzLmFwcENvbXBvbmVudHMucHVzaChuZXcgQXBwQ29tcG9uZW50KGtpbmQsIHR5cGUsIGlzSG9yaXpvbnRhbGx5U2NhbGFibGUpKTtcbiAgfTtcblxuICBIb3N0LnByb3RvdHlwZS5zZXJpYWxpemVDb21wb25lbnRzID0gZnVuY3Rpb24oY29tcG9uZW50cykge1xuICAgIHZhciBhciwgY29tcG9uZW50LCBpLCBsZW47XG4gICAgYXIgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjb21wb25lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnQgPSBjb21wb25lbnRzW2ldO1xuICAgICAgYXIucHVzaChjb21wb25lbnQuc2VyaWFsaXplKCkpO1xuICAgIH1cbiAgICByZXR1cm4gYXI7XG4gIH07XG5cbiAgSG9zdC5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiB0aGlzLnNlcnZlclNwZWNzSWQsXG4gICAgICBidW5raG91c2VJZDogdGhpcy5idW5raG91c2VJZCxcbiAgICAgIHBsYXRmb3JtQ29tcG9uZW50czogdGhpcy5zZXJpYWxpemVDb21wb25lbnRzKHRoaXMucGxhdGZvcm1Db21wb25lbnRzKSxcbiAgICAgIGFwcENvbXBvbmVudHM6IHRoaXMuc2VyaWFsaXplQ29tcG9uZW50cyh0aGlzLmFwcENvbXBvbmVudHMpXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gSG9zdDtcblxufSkoKTtcbiIsInZhciBQbGF0Zm9ybUNvbXBvbmVudDtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF0Zm9ybUNvbXBvbmVudCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUGxhdGZvcm1Db21wb25lbnQoaWQsIGtpbmQpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5raW5kID0ga2luZDtcbiAgICB0aGlzLmlzU3BsaXRhYmxlID0gTWF0aC5yYW5kb20oKSA+IDAuNTtcbiAgICB0aGlzLnN0YXRlID0gXCJhY3RpdmVcIjtcbiAgfVxuXG4gIFBsYXRmb3JtQ29tcG9uZW50LnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBraW5kOiB0aGlzLmtpbmQsXG4gICAgICBpc1NwbGl0YWJsZTogdGhpcy5pc1NwbGl0YWJsZSxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gUGxhdGZvcm1Db21wb25lbnQ7XG5cbn0pKCk7XG4iLCJ2YXIgJGhvbGRlciwgQ2xvYmJlckJveERhdGFTaGltLCBVSSwgYm94ZXM7XG5cblVJID0gcmVxdWlyZSgnLi90ZXN0LXVpL3VpJyk7XG5cbkNsb2JiZXJCb3hEYXRhU2hpbSA9IHJlcXVpcmUoJy4vc2hpbXMvZGF0YS1zaGltJyk7XG5cbndpbmRvdy5jbG9iYmVyQm94RGF0YVNoaW0gPSBuZXcgQ2xvYmJlckJveERhdGFTaGltKCk7XG5cbmJveGVzID0gW107XG5cbiRob2xkZXIgPSAkKFwiLmhvbGRlclwiKTtcblxud2luZG93LmluaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZGRFdmVudExpc3RlbmVycywgZ2V0Qm94LCBnZXRQYXJlbnRPZkNvbXBvbmVudCwgZ2V0UGFyZW50T2ZHZW5lcmF0aW9uLCByZW1vdmVCb3gsIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucywgdWk7XG4gICAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgICB1aSA9IG5ldyBVSSgkKCdib2R5JykpO1xuICAgIHdpbmRvdy5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oY29tcG9uZW50SWQsIHN0YXRlKSB7XG4gICAgICB2YXIgZ2VuRGF0YTtcbiAgICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlID0gJ3Byb3Zpc2lvbmluZyc7XG4gICAgICB9XG4gICAgICBnZW5EYXRhID0gY2xvYmJlckJveERhdGFTaGltLmdldEdlbmVyYXRpb24oY29tcG9uZW50SWQsIHN0YXRlKS5zZXJpYWxpemUoKTtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkNvbXBvbmVudChjb21wb25lbnRJZCkuYWRkR2VuZXJhdGlvbihjb21wb25lbnRJZCwgZ2VuRGF0YSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oaG9zdElkKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGhvc3RJZCkuYWRkQ29tcG9uZW50KGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRBcHBDb21wb25lbnQoKS5zZXJpYWxpemUoKSk7XG4gICAgfTtcbiAgICB3aW5kb3cucmVtb3ZlQ29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50SWQpIHtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkNvbXBvbmVudChjb21wb25lbnRJZCkucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudElkKTtcbiAgICB9O1xuICAgIHdpbmRvdy5yZW1vdmVHZW5lcmF0aW9uID0gZnVuY3Rpb24oZ2VuZXJhdGlvbklkKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZHZW5lcmF0aW9uKGdlbmVyYXRpb25JZCkucmVtb3ZlR2VuZXJhdGlvbihnZW5lcmF0aW9uSWQpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEhvc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBob3N0Qm94O1xuICAgICAgaG9zdEJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICAgIGhvc3RCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkhPU1QsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3N0KHRydWUpLnNlcmlhbGl6ZSgpKTtcbiAgICAgIHJldHVybiB1aS5ub3RlQ29tcG9uZW50cyhob3N0Qm94KTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRDbHVzdGVyID0gZnVuY3Rpb24oY2x1c3RlckRhdGEpIHtcbiAgICAgIHZhciBjbHVzdGVyQm94LCBkYXRhLCBnZW5lcmF0aW9uLCBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IGNsdXN0ZXJEYXRhLmdlbmVyYXRpb25zO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGdlbmVyYXRpb24gPSByZWZbal07XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgc2VydmljZUlkOiBjbHVzdGVyRGF0YS5pZCxcbiAgICAgICAgICBzZXJ2aWNlU3RhdGU6IGNsdXN0ZXJEYXRhLnN0YXRlLFxuICAgICAgICAgIG5hbWU6IGNsdXN0ZXJEYXRhLm5hbWUsXG4gICAgICAgICAgc2VydmljZVR5cGU6IGNsdXN0ZXJEYXRhLnNlcnZpY2VUeXBlLFxuICAgICAgICAgIHNjYWxlc0hvcml6OiBjbHVzdGVyRGF0YS5zY2FsZXNIb3JpeixcbiAgICAgICAgICBzY2FsZXNSZWR1bmQ6IGNsdXN0ZXJEYXRhLnNjYWxlc1JlZHVuZCxcbiAgICAgICAgICBpbnN0YW5jZXM6IGNsdXN0ZXJEYXRhLmluc3RhbmNlcyxcbiAgICAgICAgICBpZDogZ2VuZXJhdGlvbi5pZCxcbiAgICAgICAgICBnZW5lcmF0aW9uU3RhdGU6IGdlbmVyYXRpb24uc3RhdGUsXG4gICAgICAgICAgZ2VuZXJhdGlvblN0YXR1czogZ2VuZXJhdGlvbi5zdGF0dXMsXG4gICAgICAgICAgbWVtYmVyczogZ2VuZXJhdGlvbi5pbnN0YW5jZXMsXG4gICAgICAgICAgdG90YWxNZW1iZXJzOiBnZW5lcmF0aW9uLmluc3RhbmNlcy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgY2x1c3RlckJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGNsdXN0ZXJCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkNMVVNURVIsIGRhdGEpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG4gICAgd2luZG93LnNldFN0YXRlID0gZnVuY3Rpb24oaWQsIHN0YXRlKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGlkKS5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgfTtcbiAgICB3aW5kb3cuc2V0R2VuZXJhdGlvblN0YXRlID0gZnVuY3Rpb24oaWQsIHN0YXRlKSB7XG4gICAgICByZXR1cm4gZ2V0UGFyZW50T2ZHZW5lcmF0aW9uKGlkKS5zZXRHZW5lcmF0aW9uU3RhdGUoaWQsIHN0YXRlKTtcbiAgICB9O1xuICAgIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0NBTEUuR0VUX09QVElPTlMnLCBmdW5jdGlvbihtLCBjYikge1xuICAgICAgICByZXR1cm4gY2Ioc2NhbGVNYWNoaW5lVGVzdERhdGEuZ2V0SG9zdE9wdGlvbnMoKSk7XG4gICAgICB9KTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1JFR0lTVEVSJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgICByZXR1cm4gYm94ZXMucHVzaChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnVU5SRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgICAgcmV0dXJuIHJlbW92ZUJveChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0NBTEUuU0FWRScsIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXcgU2NhbGU6XCIpO1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTUExJVC5TQVZFJywgZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNwbGl0OlwiKTtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BUFBfQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnYXBwLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuUExBVEZPUk1fQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgncGxhdGZvcm0tY29tcG9uZW50cycsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5IT1NULUlOVEFOQ0VTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEJveChkYXRhLmlkKS5zd2l0Y2hTdWJDb250ZW50KCdob3N0LWluc3RhbmNlcycsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TQ0FMRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc2NhbGUtbWFjaGluZScsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TVEFUUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc3RhdHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQ09OU09MRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnY29uc29sZScsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TUExJVCcsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc3BsaXQnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkFETUlOJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEJveChkYXRhLmlkKS5zd2l0Y2hTdWJDb250ZW50KCdhZG1pbicsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG4gICAgZ2V0Qm94ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoaWQgPT09IGJveC5pZCkge1xuICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFBhcmVudE9mQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoYm94Lmhhc0NvbXBvbmVudFdpdGhJZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRQYXJlbnRPZkdlbmVyYXRpb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIGJveCwgaiwgbGVuO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gYm94ZXNbal07XG4gICAgICAgIGlmIChib3guaGFzR2VuZXJhdGlvbldpdGhJZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZW1vdmVCb3ggPSBmdW5jdGlvbihkb29tZWRCb3gpIHtcbiAgICAgIHZhciBib3gsIGksIGosIGxlbjtcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgYm94ID0gYm94ZXNbaV07XG4gICAgICAgIGlmIChib3guaWQgPT09IGRvb21lZEJveC5pZCkge1xuICAgICAgICAgIGJveGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucygpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgYWRkSG9zdCgpO1xuICAgIGFkZENsdXN0ZXIoY2xvYmJlckJveERhdGFTaGltLmdldEhvcml6Q2x1c3RlcigpLnNlcmlhbGl6ZSgpKTtcbiAgICByZXR1cm4gYWRkQ2x1c3RlcihjbG9iYmVyQm94RGF0YVNoaW0uZ2V0RGF0YUNsdXN0ZXIoKS5zZXJpYWxpemUoKSk7XG4gIH07XG59KSh0aGlzKTtcbiIsInZhciBVSTtcblxubW9kdWxlLmV4cG9ydHMgPSBVSSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVUkoKSB7XG4gICAgdGhpcy5pbml0U3RhdGVTZWxlY3RvcigkKFwiLnN0YXRlc1wiKSk7XG4gICAgdGhpcy5pbml0RXZlbnRzKCk7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdGVyQm94KGJveCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuXG4gIFVJLnByb3RvdHlwZS5yZWdpc3RlckJveCA9IGZ1bmN0aW9uKGJveCkge1xuICAgIGlmIChib3guZGF0YS5pZC5pbmNsdWRlcygnZ2VuJykpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnLmdlbmVyYXRpb25zJywgJy51aS1zaGltJyksIGJveCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnLmhvc3RzJywgJy51aS1zaGltJyksIGJveCk7XG4gICAgfVxuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5hZGRUb1NlbGVjdG9yID0gZnVuY3Rpb24oJHNlbGVjdG9yLCBib3gpIHtcbiAgICBpZiAoJChcIm9wdGlvblt2YWx1ZT0nXCIgKyBib3guZGF0YS5pZCArIFwiJ11cIiwgJHNlbGVjdG9yKS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuICRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGJveC5kYXRhLmlkICsgXCInPlwiICsgYm94LmRhdGEuaWQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgfTtcblxuICBVSS5wcm90b3R5cGUuaW5pdFN0YXRlU2VsZWN0b3IgPSBmdW5jdGlvbigkc2VsZWN0b3IpIHtcbiAgICB2YXIgaSwgbGVuLCByZXN1bHRzLCBzdGF0ZSwgc3RhdGVzO1xuICAgIHN0YXRlcyA9IFsnJywgJ2NyZWF0ZWQnLCAnaW5pdGlhbGl6ZWQnLCAnb3JkZXJlZCcsICdwcm92aXNpb25pbmcnLCAnZGVmdW5jdCcsICdhY3RpdmUnLCAnZGVjb21pc3Npb25pbmcnLCAnZGVzdHJveScsICdhcmNoaXZlZCddO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0YXRlID0gc3RhdGVzW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKCRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHN0YXRlICsgXCInPlwiICsgc3RhdGUgKyBcIjwvb3B0aW9uPlwiKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgJChcImJ1dHRvbiNob3N0c1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2hvc3RzLXN0YXRlLXNlbGVjdG9yXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjaG9zdC1zdGF0ZXNcIikudmFsKCk7XG4gICAgICAgIHJldHVybiBzZXRTdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNnZW5lcmF0aW9uc1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2dlbmVyYXRpb25zLXN0YXRlLXNlbGVjdG9yXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjZ2VuLXN0YXRlc1wiKS52YWwoKTtcbiAgICAgICAgcmV0dXJuIHNldEdlbmVyYXRpb25TdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNhZGQtZ2VuZXJhdGlvblwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFkZEdlbmVyYXRpb24oJChcInNlbGVjdCNhZGQtZ2VuZXJhdGlvbi1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNyZW1vdmUtZ2VuZXJhdGlvblwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUdlbmVyYXRpb24oJChcInNlbGVjdCNyZW1vdmUtZ2VuZXJhdGlvbi1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNhZGQtY29tcG9uZW50XCIpLm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWRkQ29tcG9uZW50KCQoXCJzZWxlY3QjYWRkLWNvbXBvbmVudC1zZWxlY3RcIikudmFsKCkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuICQoXCJidXR0b24jcmVtb3ZlLWNvbXBvbmVudFwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUNvbXBvbmVudCgkKFwic2VsZWN0I3JlbW92ZS1jb21wb25lbnQtc2VsZWN0XCIpLnZhbCgpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5ub3RlQ29tcG9uZW50cyA9IGZ1bmN0aW9uKGJveCkge1xuICAgIHZhciAkc2VsZWN0b3IsIGNvbXBvbmVudCwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgJHNlbGVjdG9yID0gJChcInNlbGVjdC5jb21wb25lbnRzXCIpO1xuICAgIHJlZiA9IGJveC5kYXRhLmFwcENvbXBvbmVudHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50ID0gcmVmW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKCRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGNvbXBvbmVudC5pZCArIFwiJz5cIiArIGNvbXBvbmVudC5pZCArIFwiPC9vcHRpb24+XCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgcmV0dXJuIFVJO1xuXG59KSgpO1xuIl19
