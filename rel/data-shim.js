(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ClobberBoxDataShim;

module.exports = ClobberBoxDataShim = (function() {
  function ClobberBoxDataShim() {
    this.hostCount = 0;
    this.appComponentCount = 0;
    this.dbCount = 0;
    this.clusterCount = 0;
  }

  ClobberBoxDataShim.prototype.getHost = function() {
    return {
      id: "host." + (++this.hostCount),
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
    data = {
      serverSpecsId: "b4",
      id: "cluster." + (++this.clusterCount),
      name: "web " + (++this.appComponentCount),
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
      serverSpecsId: "b3",
      id: kind + "." + this.appComponentCount,
      name: kind + " " + this.appComponentCount,
      serviceType: type
    };
  };

  ClobberBoxDataShim.prototype.getPlatformComponent = function(id, name, serviceType) {
    return {
      serverSpecsId: "b2",
      isPlatformComponent: true,
      id: id,
      name: name,
      serviceType: serviceType
    };
  };

  return ClobberBoxDataShim;

})();

},{}],2:[function(require,module,exports){
var $holder, ClobberBoxDataShim, addEventListeners, boxes, getBox, removeBox, subscribeToRegistrations;

ClobberBoxDataShim = require('./shims/data-shim');

window.clobberBoxDataShim = new ClobberBoxDataShim();

boxes = [];

$holder = $(".holder");

window.init = (function(_this) {
  return function() {
    var appComponent, clusterBox, hostBox, platformComponent;
    subscribeToRegistrations();
    addEventListeners();
    statsDataSimultor.createFakeStatDataProvider();
    hostBox = new nanobox.ClobberBox();
    hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost());
    clusterBox = new nanobox.ClobberBox();
    clusterBox.build($holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster());
    appComponent = new nanobox.ClobberBox();
    appComponent.build($holder, nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent());
    platformComponent = new nanobox.ClobberBox();
    return platformComponent.build($holder, nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("hm", "Health Monitor", "health-monitor"));
  };
})(this);

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
    return function(m, data) {};
  })(this));
  PubSub.subscribe('SHOW.ADMIN', (function(_this) {
    return function(m, data) {};
  })(this));
  return PubSub.subscribe('SHOW', (function(_this) {
    return function(m, data) {};
  })(this));
};

getBox = function(key) {
  var box, j, len;
  for (j = 0, len = boxes.length; j < len; j++) {
    box = boxes[j];
    if (key === box.id) {
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

},{"./shims/data-shim":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDbG9iYmVyQm94RGF0YVNoaW07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvYmJlckJveERhdGFTaGltID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDbG9iYmVyQm94RGF0YVNoaW0oKSB7XG4gICAgdGhpcy5ob3N0Q291bnQgPSAwO1xuICAgIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuICAgIHRoaXMuZGJDb3VudCA9IDA7XG4gICAgdGhpcy5jbHVzdGVyQ291bnQgPSAwO1xuICB9XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBcImhvc3QuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICBuYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50LFxuICAgICAgc2VydmVyU3BlY3NJZDogXCJiMVwiLFxuICAgICAgYXBwQ29tcG9uZW50czogW3RoaXMuZ2V0QXBwQ29tcG9uZW50KCksIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCdkYicsICdtb25nby1kYicpXSxcbiAgICAgIHBsYXRmb3JtQ29tcG9uZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IFwibGJcIixcbiAgICAgICAgICBraW5kOiBcImxvYWQtYmFsYW5jZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwibGdcIixcbiAgICAgICAgICBraW5kOiBcImxvZ2dlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJobVwiLFxuICAgICAgICAgIGtpbmQ6IFwiaGVhbHRoLW1vbml0b3JcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwibXJcIixcbiAgICAgICAgICBraW5kOiBcInJvdXRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJnc1wiLFxuICAgICAgICAgIGtpbmQ6IFwiZ2xvYi1zdG9yYWdlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRDbHVzdGVyID0gZnVuY3Rpb24odG90YWxNZW1iZXJzKSB7XG4gICAgdmFyIGRhdGEsIGksIGosIHJlZjtcbiAgICBpZiAodG90YWxNZW1iZXJzID09IG51bGwpIHtcbiAgICAgIHRvdGFsTWVtYmVycyA9IDQ7XG4gICAgfVxuICAgIGRhdGEgPSB7XG4gICAgICBzZXJ2ZXJTcGVjc0lkOiBcImI0XCIsXG4gICAgICBpZDogXCJjbHVzdGVyLlwiICsgKCsrdGhpcy5jbHVzdGVyQ291bnQpLFxuICAgICAgbmFtZTogXCJ3ZWIgXCIgKyAoKyt0aGlzLmFwcENvbXBvbmVudENvdW50KSxcbiAgICAgIHNlcnZpY2VUeXBlOiBcInJ1YnlcIixcbiAgICAgIGluc3RhbmNlczogW11cbiAgICB9O1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbE1lbWJlcnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBkYXRhLmluc3RhbmNlcy5wdXNoKHtcbiAgICAgICAgaWQ6IFwid2ViLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCArIFwiLlwiICsgaSxcbiAgICAgICAgaG9zdElkOiBcImVjMi5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgICAgaG9zdE5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEFwcENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHR5cGUgPSBcInJ1YnlcIjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlcnZlclNwZWNzSWQ6IFwiYjNcIixcbiAgICAgIGlkOiBraW5kICsgXCIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50LFxuICAgICAgbmFtZToga2luZCArIFwiIFwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIHNlcnZpY2VUeXBlOiB0eXBlXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldFBsYXRmb3JtQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQsIG5hbWUsIHNlcnZpY2VUeXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlcnZlclNwZWNzSWQ6IFwiYjJcIixcbiAgICAgIGlzUGxhdGZvcm1Db21wb25lbnQ6IHRydWUsXG4gICAgICBpZDogaWQsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgc2VydmljZVR5cGU6IHNlcnZpY2VUeXBlXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gQ2xvYmJlckJveERhdGFTaGltO1xuXG59KSgpO1xuIiwidmFyICRob2xkZXIsIENsb2JiZXJCb3hEYXRhU2hpbSwgYWRkRXZlbnRMaXN0ZW5lcnMsIGJveGVzLCBnZXRCb3gsIHJlbW92ZUJveCwgc3Vic2NyaWJlVG9SZWdpc3RyYXRpb25zO1xuXG5DbG9iYmVyQm94RGF0YVNoaW0gPSByZXF1aXJlKCcuL3NoaW1zL2RhdGEtc2hpbScpO1xuXG53aW5kb3cuY2xvYmJlckJveERhdGFTaGltID0gbmV3IENsb2JiZXJCb3hEYXRhU2hpbSgpO1xuXG5ib3hlcyA9IFtdO1xuXG4kaG9sZGVyID0gJChcIi5ob2xkZXJcIik7XG5cbndpbmRvdy5pbml0ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXBwQ29tcG9uZW50LCBjbHVzdGVyQm94LCBob3N0Qm94LCBwbGF0Zm9ybUNvbXBvbmVudDtcbiAgICBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnMoKTtcbiAgICBhZGRFdmVudExpc3RlbmVycygpO1xuICAgIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gICAgaG9zdEJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICBob3N0Qm94LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5IT1NULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0SG9zdCgpKTtcbiAgICBjbHVzdGVyQm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGNsdXN0ZXJCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkNMVVNURVIsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRDbHVzdGVyKCkpO1xuICAgIGFwcENvbXBvbmVudCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICBhcHBDb21wb25lbnQuYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkFQUF9DT01QT05FTlQsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRBcHBDb21wb25lbnQoKSk7XG4gICAgcGxhdGZvcm1Db21wb25lbnQgPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgcmV0dXJuIHBsYXRmb3JtQ29tcG9uZW50LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5QTEFURk9STV9DT01QT05FTlQsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImhtXCIsIFwiSGVhbHRoIE1vbml0b3JcIiwgXCJoZWFsdGgtbW9uaXRvclwiKSk7XG4gIH07XG59KSh0aGlzKTtcblxuc3Vic2NyaWJlVG9SZWdpc3RyYXRpb25zID0gZnVuY3Rpb24oKSB7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLkdFVF9PUFRJT05TJywgZnVuY3Rpb24obSwgY2IpIHtcbiAgICByZXR1cm4gY2Ioc2NhbGVNYWNoaW5lVGVzdERhdGEuZ2V0SG9zdE9wdGlvbnMoKSk7XG4gIH0pO1xuICBQdWJTdWIuc3Vic2NyaWJlKCdSRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgIHJldHVybiBib3hlcy5wdXNoKGJveCk7XG4gICAgfTtcbiAgfSkodGhpcykpO1xuICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnVU5SRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgIHJldHVybiByZW1vdmVCb3goYm94KTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG59O1xuXG5hZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkFQUF9DT01QT05FTlRTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnYXBwLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuUExBVEZPUk1fQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3BsYXRmb3JtLWNvbXBvbmVudHMnLCBkYXRhLmVsKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuSU5TVEFOQ0VTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHt9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU0NBTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgcmV0dXJuIGdldEJveChkYXRhLmlkKS5zd2l0Y2hTdWJDb250ZW50KCdzY2FsZS1tYWNoaW5lJywgZGF0YS5lbCk7XG4gICAgfTtcbiAgfSkodGhpcykpO1xuICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlNUQVRTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnc3RhdHMnLCBkYXRhLmVsKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQ09OU09MRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ2NvbnNvbGUnLCBkYXRhLmVsKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1BMSVQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BRE1JTicsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgfSkodGhpcykpO1xuICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU0hPVycsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgfSkodGhpcykpO1xufTtcblxuZ2V0Qm94ID0gZnVuY3Rpb24oa2V5KSB7XG4gIHZhciBib3gsIGosIGxlbjtcbiAgZm9yIChqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBib3ggPSBib3hlc1tqXTtcbiAgICBpZiAoa2V5ID09PSBib3guaWQpIHtcbiAgICAgIHJldHVybiBib3g7XG4gICAgfVxuICB9XG59O1xuXG5yZW1vdmVCb3ggPSBmdW5jdGlvbihkb29tZWRCb3gpIHtcbiAgdmFyIGJveCwgaSwgaiwgbGVuO1xuICBmb3IgKGkgPSBqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgYm94ID0gYm94ZXNbaV07XG4gICAgaWYgKGJveC5pZCA9PT0gZG9vbWVkQm94LmlkKSB7XG4gICAgICBib3hlcy5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59O1xuIl19
