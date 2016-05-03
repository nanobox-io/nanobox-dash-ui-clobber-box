(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ClobberBoxDataShim;

module.exports = ClobberBoxDataShim = (function() {
  function ClobberBoxDataShim() {
    this.hostCount = 0;
    this.appComponentCount = 0;
    this.dbCount = 0;
    this.clusterCount = 0;
    this.genericGenerationCount = 0;
  }

  ClobberBoxDataShim.prototype.getHost = function(showBunchesOfComponents) {
    var data;
    if (showBunchesOfComponents == null) {
      showBunchesOfComponents = true;
    }
    this.hostCount++;
    data = {
      state: "active",
      id: "host." + this.hostCount,
      name: "ec2." + this.hostCount,
      serverSpecsId: "b1",
      platformComponents: [
        {
          id: "lb",
          kind: "load-balancer"
        }, {
          id: "lg",
          kind: "logger"
        }, {
          id: "hm",
          kind: "health-monitor"
        }, {
          id: "mr",
          kind: "router"
        }, {
          id: "gs",
          kind: "glob-storage"
        }
      ]
    };
    if (!showBunchesOfComponents) {
      data.appComponents = [this.getAppComponent(), this.getAppComponent('db', 'mongo-db', false)];
    } else {
      data.appComponents = [this.getAppComponent(), this.getAppComponent('db', 'mongo-db', false), this.getAppComponent('web', 'node', true), this.getAppComponent('web', 'memcached', true), this.getAppComponent('web', 'python', true), this.getAppComponent('web', 'storage', true), this.getAppComponent('web', 'java', true), this.getAppComponent('web', 'php', true), this.getAppComponent('db', 'couch-db', false), this.getAppComponent('db', 'maria-db', false), this.getAppComponent('db', 'postgres-db', false), this.getAppComponent('db', 'redis', false), this.getAppComponent('db', 'percona-db', false), this.getAppComponent('web', 'default', true), this.getAppComponent('db', 'default-db', false)];
    }
    return data;
  };

  ClobberBoxDataShim.prototype.getCluster = function(totalMembers) {
    var data, i, j, ref;
    if (totalMembers == null) {
      totalMembers = 4;
    }
    this.clusterCount++;
    data = {
      serverSpecsId: "b4",
      id: "cluster." + this.clusterCount,
      name: "web " + (++this.appComponentCount),
      appComponents: [this.getAppComponent()],
      serviceType: "ruby",
      instances: []
    };
    for (i = j = 1, ref = totalMembers; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      data.instances.push({
        id: "web." + this.appComponentCount + "." + i,
        hostId: "ec2." + (++this.hostCount),
        hostName: "ec2." + this.hostCount
      });
    }
    return data;
  };

  ClobberBoxDataShim.prototype.getAppComponent = function(kind, type, scalesHorizontally) {
    if (kind == null) {
      kind = 'web';
    }
    if (type == null) {
      type = "ruby";
    }
    if (scalesHorizontally == null) {
      scalesHorizontally = true;
    }
    return {
      generations: [this.getGeneration(kind + "." + this.appComponentCount)],
      state: 'active',
      serverSpecsId: "b3",
      id: kind + "." + this.appComponentCount,
      name: kind + " " + this.appComponentCount,
      serviceType: type,
      scalesHoriz: scalesHorizontally
    };
  };

  ClobberBoxDataShim.prototype.getPlatformComponent = function(id, name, serviceType) {
    return {
      state: "active",
      serverSpecsId: "b2",
      isPlatformComponent: true,
      id: id,
      name: name,
      serviceType: serviceType
    };
  };

  ClobberBoxDataShim.prototype.getGeneration = function(parentId, state) {
    if (state == null) {
      state = 'active';
    }
    return {
      state: state,
      id: parentId + ".gen" + (this.genericGenerationCount++)
    };
  };

  return ClobberBoxDataShim;

})();

},{}],2:[function(require,module,exports){
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
      genData = clobberBoxDataShim.getGeneration(componentId, state);
      return getParentOfComponent(componentId).addGeneration(componentId, genData);
    };
    window.addComponent = function(hostId) {
      return getBox(hostId).addComponent(clobberBoxDataShim.getAppComponent());
    };
    window.addHost = function() {
      var hostBox;
      hostBox = new nanobox.ClobberBox();
      hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost(false));
      return ui.noteComponents(hostBox);
    };
    window.addCluster = function() {
      var clusterBox;
      clusterBox = new nanobox.ClobberBox();
      return clusterBox.build($holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster());
    };
    window.setState = function(id, state) {
      return getBox(id).setState(state);
    };
    window.setGenerationState = function(id, state) {
      return getParentOfGeneration(id).setGenerationState(id, state);
    };
    subscribeToRegistrations = function() {
      PubSub.subscribe('STATS.GET_OPTIONS', function(m, cb) {
        return cb(scaleMachineTestData.getHostOptions());
      });
      PubSub.subscribe('REGISTER', (function(_this) {
        return function(m, box) {
          return boxes.push(box);
        };
      })(this));
      return PubSub.subscribe('UNREGISTER', (function(_this) {
        return function(m, box) {
          return removeBox(box);
        };
      })(this));
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
      PubSub.subscribe('SHOW.INSTANCES', (function(_this) {
        return function(m, data) {};
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
    return addCluster();
  };
})(this);

},{"./shims/data-shim":1,"./test-ui/ui":3}],3:[function(require,module,exports){
var UI;

module.exports = UI = (function() {
  function UI() {
    this.initStateSelector($("#host-states"));
    this.initStateSelector($("#gen-states"));
    this.initEvents();
    PubSub.subscribe('REGISTER', (function(_this) {
      return function(m, box) {
        return _this.registerBox(box);
      };
    })(this));
  }

  UI.prototype.registerBox = function(box) {
    if (box.data.id.includes('gen')) {
      return this.addToSelector($('#generation'), box);
    } else {
      return this.addToSelector($('#hosts'), box);
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
        id = $("select#hosts").val();
        state = $("select#host-states").val();
        return setState(id, state);
      };
    })(this));
    $("button#generations").on('click', (function(_this) {
      return function() {
        var id, state;
        id = $("select#generation").val();
        state = $("select#gen-states").val();
        return setGenerationState(id, state);
      };
    })(this));
    return $("button#add-generation").on('click', (function(_this) {
      return function() {
        var id;
        id = $("select#components").val();
        return addGeneration(id);
      };
    })(this));
  };

  UI.prototype.noteComponents = function(box) {
    var $selector, component, i, len, ref, results;
    $selector = $("select#components");
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSIsInRlc3QtdWkvdWkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ2xvYmJlckJveERhdGFTaGltO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2JiZXJCb3hEYXRhU2hpbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveERhdGFTaGltKCkge1xuICAgIHRoaXMuaG9zdENvdW50ID0gMDtcbiAgICB0aGlzLmFwcENvbXBvbmVudENvdW50ID0gMDtcbiAgICB0aGlzLmRiQ291bnQgPSAwO1xuICAgIHRoaXMuY2x1c3RlckNvdW50ID0gMDtcbiAgICB0aGlzLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQgPSAwO1xuICB9XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24oc2hvd0J1bmNoZXNPZkNvbXBvbmVudHMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBpZiAoc2hvd0J1bmNoZXNPZkNvbXBvbmVudHMgPT0gbnVsbCkge1xuICAgICAgc2hvd0J1bmNoZXNPZkNvbXBvbmVudHMgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmhvc3RDb3VudCsrO1xuICAgIGRhdGEgPSB7XG4gICAgICBzdGF0ZTogXCJhY3RpdmVcIixcbiAgICAgIGlkOiBcImhvc3QuXCIgKyB0aGlzLmhvc3RDb3VudCxcbiAgICAgIG5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnQsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiBcImIxXCIsXG4gICAgICBwbGF0Zm9ybUNvbXBvbmVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBcImxiXCIsXG4gICAgICAgICAga2luZDogXCJsb2FkLWJhbGFuY2VyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImxnXCIsXG4gICAgICAgICAga2luZDogXCJsb2dnZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwiaG1cIixcbiAgICAgICAgICBraW5kOiBcImhlYWx0aC1tb25pdG9yXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcIm1yXCIsXG4gICAgICAgICAga2luZDogXCJyb3V0ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwiZ3NcIixcbiAgICAgICAgICBraW5kOiBcImdsb2Itc3RvcmFnZVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICAgIGlmICghc2hvd0J1bmNoZXNPZkNvbXBvbmVudHMpIHtcbiAgICAgIGRhdGEuYXBwQ29tcG9uZW50cyA9IFt0aGlzLmdldEFwcENvbXBvbmVudCgpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnZGInLCAnbW9uZ28tZGInLCBmYWxzZSldO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmFwcENvbXBvbmVudHMgPSBbdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJywgZmFsc2UpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnd2ViJywgJ25vZGUnLCB0cnVlKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ3dlYicsICdtZW1jYWNoZWQnLCB0cnVlKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ3dlYicsICdweXRob24nLCB0cnVlKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ3dlYicsICdzdG9yYWdlJywgdHJ1ZSksIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCd3ZWInLCAnamF2YScsIHRydWUpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnd2ViJywgJ3BocCcsIHRydWUpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnZGInLCAnY291Y2gtZGInLCBmYWxzZSksIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCdkYicsICdtYXJpYS1kYicsIGZhbHNlKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ3Bvc3RncmVzLWRiJywgZmFsc2UpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnZGInLCAncmVkaXMnLCBmYWxzZSksIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCdkYicsICdwZXJjb25hLWRiJywgZmFsc2UpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnd2ViJywgJ2RlZmF1bHQnLCB0cnVlKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ2RlZmF1bHQtZGInLCBmYWxzZSldO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldENsdXN0ZXIgPSBmdW5jdGlvbih0b3RhbE1lbWJlcnMpIHtcbiAgICB2YXIgZGF0YSwgaSwgaiwgcmVmO1xuICAgIGlmICh0b3RhbE1lbWJlcnMgPT0gbnVsbCkge1xuICAgICAgdG90YWxNZW1iZXJzID0gNDtcbiAgICB9XG4gICAgdGhpcy5jbHVzdGVyQ291bnQrKztcbiAgICBkYXRhID0ge1xuICAgICAgc2VydmVyU3BlY3NJZDogXCJiNFwiLFxuICAgICAgaWQ6IFwiY2x1c3Rlci5cIiArIHRoaXMuY2x1c3RlckNvdW50LFxuICAgICAgbmFtZTogXCJ3ZWIgXCIgKyAoKyt0aGlzLmFwcENvbXBvbmVudENvdW50KSxcbiAgICAgIGFwcENvbXBvbmVudHM6IFt0aGlzLmdldEFwcENvbXBvbmVudCgpXSxcbiAgICAgIHNlcnZpY2VUeXBlOiBcInJ1YnlcIixcbiAgICAgIGluc3RhbmNlczogW11cbiAgICB9O1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbE1lbWJlcnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBkYXRhLmluc3RhbmNlcy5wdXNoKHtcbiAgICAgICAgaWQ6IFwid2ViLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCArIFwiLlwiICsgaSxcbiAgICAgICAgaG9zdElkOiBcImVjMi5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgICAgaG9zdE5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEFwcENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUsIHNjYWxlc0hvcml6b250YWxseSkge1xuICAgIGlmIChraW5kID09IG51bGwpIHtcbiAgICAgIGtpbmQgPSAnd2ViJztcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgICAgdHlwZSA9IFwicnVieVwiO1xuICAgIH1cbiAgICBpZiAoc2NhbGVzSG9yaXpvbnRhbGx5ID09IG51bGwpIHtcbiAgICAgIHNjYWxlc0hvcml6b250YWxseSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBnZW5lcmF0aW9uczogW3RoaXMuZ2V0R2VuZXJhdGlvbihraW5kICsgXCIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50KV0sXG4gICAgICBzdGF0ZTogJ2FjdGl2ZScsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiBcImIzXCIsXG4gICAgICBpZDoga2luZCArIFwiLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIG5hbWU6IGtpbmQgKyBcIiBcIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQsXG4gICAgICBzZXJ2aWNlVHlwZTogdHlwZSxcbiAgICAgIHNjYWxlc0hvcml6OiBzY2FsZXNIb3Jpem9udGFsbHlcbiAgICB9O1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0UGxhdGZvcm1Db21wb25lbnQgPSBmdW5jdGlvbihpZCwgbmFtZSwgc2VydmljZVR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IFwiYWN0aXZlXCIsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiBcImIyXCIsXG4gICAgICBpc1BsYXRmb3JtQ29tcG9uZW50OiB0cnVlLFxuICAgICAgaWQ6IGlkLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHNlcnZpY2VUeXBlOiBzZXJ2aWNlVHlwZVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRHZW5lcmF0aW9uID0gZnVuY3Rpb24ocGFyZW50SWQsIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09IG51bGwpIHtcbiAgICAgIHN0YXRlID0gJ2FjdGl2ZSc7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBpZDogcGFyZW50SWQgKyBcIi5nZW5cIiArICh0aGlzLmdlbmVyaWNHZW5lcmF0aW9uQ291bnQrKylcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBDbG9iYmVyQm94RGF0YVNoaW07XG5cbn0pKCk7XG4iLCJ2YXIgJGhvbGRlciwgQ2xvYmJlckJveERhdGFTaGltLCBVSSwgYm94ZXM7XG5cblVJID0gcmVxdWlyZSgnLi90ZXN0LXVpL3VpJyk7XG5cbkNsb2JiZXJCb3hEYXRhU2hpbSA9IHJlcXVpcmUoJy4vc2hpbXMvZGF0YS1zaGltJyk7XG5cbndpbmRvdy5jbG9iYmVyQm94RGF0YVNoaW0gPSBuZXcgQ2xvYmJlckJveERhdGFTaGltKCk7XG5cbmJveGVzID0gW107XG5cbiRob2xkZXIgPSAkKFwiLmhvbGRlclwiKTtcblxud2luZG93LmluaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZGRFdmVudExpc3RlbmVycywgZ2V0Qm94LCBnZXRQYXJlbnRPZkNvbXBvbmVudCwgZ2V0UGFyZW50T2ZHZW5lcmF0aW9uLCByZW1vdmVCb3gsIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucywgdWk7XG4gICAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgICB1aSA9IG5ldyBVSSgkKCdib2R5JykpO1xuICAgIHdpbmRvdy5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oY29tcG9uZW50SWQsIHN0YXRlKSB7XG4gICAgICB2YXIgZ2VuRGF0YTtcbiAgICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlID0gJ3Byb3Zpc2lvbmluZyc7XG4gICAgICB9XG4gICAgICBnZW5EYXRhID0gY2xvYmJlckJveERhdGFTaGltLmdldEdlbmVyYXRpb24oY29tcG9uZW50SWQsIHN0YXRlKTtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkNvbXBvbmVudChjb21wb25lbnRJZCkuYWRkR2VuZXJhdGlvbihjb21wb25lbnRJZCwgZ2VuRGF0YSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oaG9zdElkKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGhvc3RJZCkuYWRkQ29tcG9uZW50KGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRBcHBDb21wb25lbnQoKSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkSG9zdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhvc3RCb3g7XG4gICAgICBob3N0Qm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgICAgaG9zdEJveC5idWlsZCgkaG9sZGVyLCBuYW5vYm94LkNsb2JiZXJCb3guSE9TVCwgY2xvYmJlckJveERhdGFTaGltLmdldEhvc3QoZmFsc2UpKTtcbiAgICAgIHJldHVybiB1aS5ub3RlQ29tcG9uZW50cyhob3N0Qm94KTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRDbHVzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2x1c3RlckJveDtcbiAgICAgIGNsdXN0ZXJCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgICByZXR1cm4gY2x1c3RlckJveC5idWlsZCgkaG9sZGVyLCBuYW5vYm94LkNsb2JiZXJCb3guQ0xVU1RFUiwgY2xvYmJlckJveERhdGFTaGltLmdldENsdXN0ZXIoKSk7XG4gICAgfTtcbiAgICB3aW5kb3cuc2V0U3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICAgIHJldHVybiBnZXRCb3goaWQpLnNldFN0YXRlKHN0YXRlKTtcbiAgICB9O1xuICAgIHdpbmRvdy5zZXRHZW5lcmF0aW9uU3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkdlbmVyYXRpb24oaWQpLnNldEdlbmVyYXRpb25TdGF0ZShpZCwgc3RhdGUpO1xuICAgIH07XG4gICAgc3Vic2NyaWJlVG9SZWdpc3RyYXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5HRVRfT1BUSU9OUycsIGZ1bmN0aW9uKG0sIGNiKSB7XG4gICAgICAgIHJldHVybiBjYihzY2FsZU1hY2hpbmVUZXN0RGF0YS5nZXRIb3N0T3B0aW9ucygpKTtcbiAgICAgIH0pO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGJveCkge1xuICAgICAgICAgIHJldHVybiBib3hlcy5wdXNoKGJveCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnVU5SRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgICAgcmV0dXJuIHJlbW92ZUJveChib3gpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQVBQX0NPTVBPTkVOVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ2FwcC1jb21wb25lbnRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlBMQVRGT1JNX0NPTVBPTkVOVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3BsYXRmb3JtLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuSU5TVEFOQ0VTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU0NBTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3NjYWxlLW1hY2hpbmUnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1RBVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3N0YXRzJywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkNPTlNPTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ2NvbnNvbGUnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1BMSVQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3NwbGl0JywgZGF0YS5lbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BRE1JTicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnYWRtaW4nLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuICAgIGdldEJveCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW47XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBib3ggPSBib3hlc1tqXTtcbiAgICAgICAgaWYgKGlkID09PSBib3guaWQpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRQYXJlbnRPZkNvbXBvbmVudCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW47XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBib3ggPSBib3hlc1tqXTtcbiAgICAgICAgaWYgKGJveC5oYXNDb21wb25lbnRXaXRoSWQoaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0UGFyZW50T2ZHZW5lcmF0aW9uID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoYm94Lmhhc0dlbmVyYXRpb25XaXRoSWQoaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmVtb3ZlQm94ID0gZnVuY3Rpb24oZG9vbWVkQm94KSB7XG4gICAgICB2YXIgYm94LCBpLCBqLCBsZW47XG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2ldO1xuICAgICAgICBpZiAoYm94LmlkID09PSBkb29tZWRCb3guaWQpIHtcbiAgICAgICAgICBib3hlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMoKTtcbiAgICBhZGRFdmVudExpc3RlbmVycygpO1xuICAgIGFkZEhvc3QoKTtcbiAgICByZXR1cm4gYWRkQ2x1c3RlcigpO1xuICB9O1xufSkodGhpcyk7XG4iLCJ2YXIgVUk7XG5cbm1vZHVsZS5leHBvcnRzID0gVUkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFVJKCkge1xuICAgIHRoaXMuaW5pdFN0YXRlU2VsZWN0b3IoJChcIiNob3N0LXN0YXRlc1wiKSk7XG4gICAgdGhpcy5pbml0U3RhdGVTZWxlY3RvcigkKFwiI2dlbi1zdGF0ZXNcIikpO1xuICAgIHRoaXMuaW5pdEV2ZW50cygpO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1JFR0lTVEVSJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RlckJveChib3gpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cblxuICBVSS5wcm90b3R5cGUucmVnaXN0ZXJCb3ggPSBmdW5jdGlvbihib3gpIHtcbiAgICBpZiAoYm94LmRhdGEuaWQuaW5jbHVkZXMoJ2dlbicpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRUb1NlbGVjdG9yKCQoJyNnZW5lcmF0aW9uJyksIGJveCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvU2VsZWN0b3IoJCgnI2hvc3RzJyksIGJveCk7XG4gICAgfVxuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5hZGRUb1NlbGVjdG9yID0gZnVuY3Rpb24oJHNlbGVjdG9yLCBib3gpIHtcbiAgICBpZiAoJChcIm9wdGlvblt2YWx1ZT0nXCIgKyBib3guZGF0YS5pZCArIFwiJ11cIiwgJHNlbGVjdG9yKS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuICRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGJveC5kYXRhLmlkICsgXCInPlwiICsgYm94LmRhdGEuaWQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgfTtcblxuICBVSS5wcm90b3R5cGUuaW5pdFN0YXRlU2VsZWN0b3IgPSBmdW5jdGlvbigkc2VsZWN0b3IpIHtcbiAgICB2YXIgaSwgbGVuLCByZXN1bHRzLCBzdGF0ZSwgc3RhdGVzO1xuICAgIHN0YXRlcyA9IFsnJywgJ2NyZWF0ZWQnLCAnaW5pdGlhbGl6ZWQnLCAnb3JkZXJlZCcsICdwcm92aXNpb25pbmcnLCAnZGVmdW5jdCcsICdhY3RpdmUnLCAnZGVjb21pc3Npb25pbmcnLCAnZGVzdHJveScsICdhcmNoaXZlZCddO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0YXRlID0gc3RhdGVzW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKCRzZWxlY3Rvci5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHN0YXRlICsgXCInPlwiICsgc3RhdGUgKyBcIjwvb3B0aW9uPlwiKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIFVJLnByb3RvdHlwZS5pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgJChcImJ1dHRvbiNob3N0c1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2hvc3RzXCIpLnZhbCgpO1xuICAgICAgICBzdGF0ZSA9ICQoXCJzZWxlY3QjaG9zdC1zdGF0ZXNcIikudmFsKCk7XG4gICAgICAgIHJldHVybiBzZXRTdGF0ZShpZCwgc3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgJChcImJ1dHRvbiNnZW5lcmF0aW9uc1wiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBzdGF0ZTtcbiAgICAgICAgaWQgPSAkKFwic2VsZWN0I2dlbmVyYXRpb25cIikudmFsKCk7XG4gICAgICAgIHN0YXRlID0gJChcInNlbGVjdCNnZW4tc3RhdGVzXCIpLnZhbCgpO1xuICAgICAgICByZXR1cm4gc2V0R2VuZXJhdGlvblN0YXRlKGlkLCBzdGF0ZSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gJChcImJ1dHRvbiNhZGQtZ2VuZXJhdGlvblwiKS5vbignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlkO1xuICAgICAgICBpZCA9ICQoXCJzZWxlY3QjY29tcG9uZW50c1wiKS52YWwoKTtcbiAgICAgICAgcmV0dXJuIGFkZEdlbmVyYXRpb24oaWQpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVUkucHJvdG90eXBlLm5vdGVDb21wb25lbnRzID0gZnVuY3Rpb24oYm94KSB7XG4gICAgdmFyICRzZWxlY3RvciwgY29tcG9uZW50LCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAkc2VsZWN0b3IgPSAkKFwic2VsZWN0I2NvbXBvbmVudHNcIik7XG4gICAgcmVmID0gYm94LmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnQgPSByZWZbaV07XG4gICAgICByZXN1bHRzLnB1c2goJHNlbGVjdG9yLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgY29tcG9uZW50LmlkICsgXCInPlwiICsgY29tcG9uZW50LmlkICsgXCI8L29wdGlvbj5cIikpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICByZXR1cm4gVUk7XG5cbn0pKCk7XG4iXX0=
