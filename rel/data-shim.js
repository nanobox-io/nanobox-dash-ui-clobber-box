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

  ClobberBoxDataShim.prototype.getHost = function() {
    this.hostCount++;
    return {
      state: "active",
      id: "host." + this.hostCount,
      name: "ec2." + this.hostCount,
      serverSpecsId: "b1",
      appComponents: [this.getAppComponent(), this.getAppComponent('db', 'mongo-db')],
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

  ClobberBoxDataShim.prototype.getAppComponent = function(kind, type) {
    if (kind == null) {
      kind = 'web';
    }
    if (type == null) {
      type = "ruby";
    }
    return {
      generations: [this.getGeneration(kind + "." + this.appComponentCount)],
      state: 'active',
      serverSpecsId: "b3",
      id: kind + "." + this.appComponentCount,
      name: kind + " " + this.appComponentCount,
      serviceType: type
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
var $holder, ClobberBoxDataShim, boxes;

ClobberBoxDataShim = require('./shims/data-shim');

window.clobberBoxDataShim = new ClobberBoxDataShim();

boxes = [];

$holder = $(".holder");

window.init = (function(_this) {
  return function() {
    var addEventListeners, getBox, getParentOfComponent, getParentOfGeneration, removeBox, subscribeToRegistrations;
    statsDataSimultor.createFakeStatDataProvider();
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
      return hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost());
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

},{"./shims/data-shim":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDbG9iYmVyQm94RGF0YVNoaW07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvYmJlckJveERhdGFTaGltID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDbG9iYmVyQm94RGF0YVNoaW0oKSB7XG4gICAgdGhpcy5ob3N0Q291bnQgPSAwO1xuICAgIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuICAgIHRoaXMuZGJDb3VudCA9IDA7XG4gICAgdGhpcy5jbHVzdGVyQ291bnQgPSAwO1xuICAgIHRoaXMuZ2VuZXJpY0dlbmVyYXRpb25Db3VudCA9IDA7XG4gIH1cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEhvc3QgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhvc3RDb3VudCsrO1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZTogXCJhY3RpdmVcIixcbiAgICAgIGlkOiBcImhvc3QuXCIgKyB0aGlzLmhvc3RDb3VudCxcbiAgICAgIG5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnQsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiBcImIxXCIsXG4gICAgICBhcHBDb21wb25lbnRzOiBbdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJyldLFxuICAgICAgcGxhdGZvcm1Db21wb25lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogXCJsYlwiLFxuICAgICAgICAgIGtpbmQ6IFwibG9hZC1iYWxhbmNlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJsZ1wiLFxuICAgICAgICAgIGtpbmQ6IFwibG9nZ2VyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImhtXCIsXG4gICAgICAgICAga2luZDogXCJoZWFsdGgtbW9uaXRvclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJtclwiLFxuICAgICAgICAgIGtpbmQ6IFwicm91dGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImdzXCIsXG4gICAgICAgICAga2luZDogXCJnbG9iLXN0b3JhZ2VcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldENsdXN0ZXIgPSBmdW5jdGlvbih0b3RhbE1lbWJlcnMpIHtcbiAgICB2YXIgZGF0YSwgaSwgaiwgcmVmO1xuICAgIGlmICh0b3RhbE1lbWJlcnMgPT0gbnVsbCkge1xuICAgICAgdG90YWxNZW1iZXJzID0gNDtcbiAgICB9XG4gICAgdGhpcy5jbHVzdGVyQ291bnQrKztcbiAgICBkYXRhID0ge1xuICAgICAgc2VydmVyU3BlY3NJZDogXCJiNFwiLFxuICAgICAgaWQ6IFwiY2x1c3Rlci5cIiArIHRoaXMuY2x1c3RlckNvdW50LFxuICAgICAgbmFtZTogXCJ3ZWIgXCIgKyAoKyt0aGlzLmFwcENvbXBvbmVudENvdW50KSxcbiAgICAgIGFwcENvbXBvbmVudHM6IFt0aGlzLmdldEFwcENvbXBvbmVudCgpXSxcbiAgICAgIHNlcnZpY2VUeXBlOiBcInJ1YnlcIixcbiAgICAgIGluc3RhbmNlczogW11cbiAgICB9O1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbE1lbWJlcnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBkYXRhLmluc3RhbmNlcy5wdXNoKHtcbiAgICAgICAgaWQ6IFwid2ViLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCArIFwiLlwiICsgaSxcbiAgICAgICAgaG9zdElkOiBcImVjMi5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgICAgaG9zdE5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEFwcENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHR5cGUgPSBcInJ1YnlcIjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGdlbmVyYXRpb25zOiBbdGhpcy5nZXRHZW5lcmF0aW9uKGtpbmQgKyBcIi5cIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQpXSxcbiAgICAgIHN0YXRlOiAnYWN0aXZlJyxcbiAgICAgIHNlcnZlclNwZWNzSWQ6IFwiYjNcIixcbiAgICAgIGlkOiBraW5kICsgXCIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50LFxuICAgICAgbmFtZToga2luZCArIFwiIFwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIHNlcnZpY2VUeXBlOiB0eXBlXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldFBsYXRmb3JtQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQsIG5hbWUsIHNlcnZpY2VUeXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgc2VydmVyU3BlY3NJZDogXCJiMlwiLFxuICAgICAgaXNQbGF0Zm9ybUNvbXBvbmVudDogdHJ1ZSxcbiAgICAgIGlkOiBpZCxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBzZXJ2aWNlVHlwZTogc2VydmljZVR5cGVcbiAgICB9O1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0R2VuZXJhdGlvbiA9IGZ1bmN0aW9uKHBhcmVudElkLCBzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICBzdGF0ZSA9ICdhY3RpdmUnO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgaWQ6IHBhcmVudElkICsgXCIuZ2VuXCIgKyAodGhpcy5nZW5lcmljR2VuZXJhdGlvbkNvdW50KyspXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gQ2xvYmJlckJveERhdGFTaGltO1xuXG59KSgpO1xuIiwidmFyICRob2xkZXIsIENsb2JiZXJCb3hEYXRhU2hpbSwgYm94ZXM7XG5cbkNsb2JiZXJCb3hEYXRhU2hpbSA9IHJlcXVpcmUoJy4vc2hpbXMvZGF0YS1zaGltJyk7XG5cbndpbmRvdy5jbG9iYmVyQm94RGF0YVNoaW0gPSBuZXcgQ2xvYmJlckJveERhdGFTaGltKCk7XG5cbmJveGVzID0gW107XG5cbiRob2xkZXIgPSAkKFwiLmhvbGRlclwiKTtcblxud2luZG93LmluaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZGRFdmVudExpc3RlbmVycywgZ2V0Qm94LCBnZXRQYXJlbnRPZkNvbXBvbmVudCwgZ2V0UGFyZW50T2ZHZW5lcmF0aW9uLCByZW1vdmVCb3gsIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucztcbiAgICBzdGF0c0RhdGFTaW11bHRvci5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlcigpO1xuICAgIHdpbmRvdy5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oY29tcG9uZW50SWQsIHN0YXRlKSB7XG4gICAgICB2YXIgZ2VuRGF0YTtcbiAgICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlID0gJ3Byb3Zpc2lvbmluZyc7XG4gICAgICB9XG4gICAgICBnZW5EYXRhID0gY2xvYmJlckJveERhdGFTaGltLmdldEdlbmVyYXRpb24oY29tcG9uZW50SWQsIHN0YXRlKTtcbiAgICAgIHJldHVybiBnZXRQYXJlbnRPZkNvbXBvbmVudChjb21wb25lbnRJZCkuYWRkR2VuZXJhdGlvbihjb21wb25lbnRJZCwgZ2VuRGF0YSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oaG9zdElkKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGhvc3RJZCkuYWRkQ29tcG9uZW50KGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRBcHBDb21wb25lbnQoKSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkSG9zdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhvc3RCb3g7XG4gICAgICBob3N0Qm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgICAgcmV0dXJuIGhvc3RCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkhPU1QsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3N0KCkpO1xuICAgIH07XG4gICAgd2luZG93LmFkZENsdXN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjbHVzdGVyQm94O1xuICAgICAgY2x1c3RlckJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICAgIHJldHVybiBjbHVzdGVyQm94LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5DTFVTVEVSLCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0Q2x1c3RlcigpKTtcbiAgICB9O1xuICAgIHdpbmRvdy5zZXRTdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgICAgcmV0dXJuIGdldEJveChpZCkuc2V0U3RhdGUoc3RhdGUpO1xuICAgIH07XG4gICAgd2luZG93LnNldEdlbmVyYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgICAgcmV0dXJuIGdldFBhcmVudE9mR2VuZXJhdGlvbihpZCkuc2V0R2VuZXJhdGlvblN0YXRlKGlkLCBzdGF0ZSk7XG4gICAgfTtcbiAgICBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLkdFVF9PUFRJT05TJywgZnVuY3Rpb24obSwgY2IpIHtcbiAgICAgICAgcmV0dXJuIGNiKHNjYWxlTWFjaGluZVRlc3REYXRhLmdldEhvc3RPcHRpb25zKCkpO1xuICAgICAgfSk7XG4gICAgICBQdWJTdWIuc3Vic2NyaWJlKCdSRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICAgICAgcmV0dXJuIGJveGVzLnB1c2goYm94KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdVTlJFR0lTVEVSJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgICAgICByZXR1cm4gcmVtb3ZlQm94KGJveCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BUFBfQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnYXBwLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuUExBVEZPUk1fQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgncGxhdGZvcm0tY29tcG9uZW50cycsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5JTlNUQU5DRVMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHt9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TQ0FMRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc2NhbGUtbWFjaGluZScsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TVEFUUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc3RhdHMnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQ09OU09MRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnY29uc29sZScsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TUExJVCcsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc3BsaXQnLCBkYXRhLmVsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkFETUlOJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEJveChkYXRhLmlkKS5zd2l0Y2hTdWJDb250ZW50KCdhZG1pbicsIGRhdGEuZWwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG4gICAgZ2V0Qm94ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoaWQgPT09IGJveC5pZCkge1xuICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFBhcmVudE9mQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGJveCA9IGJveGVzW2pdO1xuICAgICAgICBpZiAoYm94Lmhhc0NvbXBvbmVudFdpdGhJZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRQYXJlbnRPZkdlbmVyYXRpb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIGJveCwgaiwgbGVuO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gYm94ZXNbal07XG4gICAgICAgIGlmIChib3guaGFzR2VuZXJhdGlvbldpdGhJZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZW1vdmVCb3ggPSBmdW5jdGlvbihkb29tZWRCb3gpIHtcbiAgICAgIHZhciBib3gsIGksIGosIGxlbjtcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgYm94ID0gYm94ZXNbaV07XG4gICAgICAgIGlmIChib3guaWQgPT09IGRvb21lZEJveC5pZCkge1xuICAgICAgICAgIGJveGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucygpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgYWRkSG9zdCgpO1xuICAgIHJldHVybiBhZGRDbHVzdGVyKCk7XG4gIH07XG59KSh0aGlzKTtcbiJdfQ==
