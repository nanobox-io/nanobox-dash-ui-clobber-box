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
      id: kind + "." + this.appComponentCount,
      name: kind + " " + this.appComponentCount,
      serviceType: type
    };
  };

  ClobberBoxDataShim.prototype.getPlatformComponent = function(id, name, serviceType) {
    return {
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
      return getBox(data).switchSubContent('app-components');
    };
  })(this));
  PubSub.subscribe('SHOW.PLATFORM_COMPONENTS', (function(_this) {
    return function(m, data) {
      return getBox(data).switchSubContent('platform-components');
    };
  })(this));
  PubSub.subscribe('SHOW.INSTANCES', (function(_this) {
    return function(m, data) {};
  })(this));
  PubSub.subscribe('SHOW.SCALE', (function(_this) {
    return function(m, data) {
      return getBox(data).switchSubContent('scale-machine');
    };
  })(this));
  PubSub.subscribe('SHOW.STATS', (function(_this) {
    return function(m, data) {
      return getBox(data).switchSubContent('stats');
    };
  })(this));
  PubSub.subscribe('SHOW.CONSOLE', (function(_this) {
    return function(m, data) {
      return getBox(data).switchSubContent('console');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ2xvYmJlckJveERhdGFTaGltO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2JiZXJCb3hEYXRhU2hpbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveERhdGFTaGltKCkge1xuICAgIHRoaXMuaG9zdENvdW50ID0gMDtcbiAgICB0aGlzLmFwcENvbXBvbmVudENvdW50ID0gMDtcbiAgICB0aGlzLmRiQ291bnQgPSAwO1xuICAgIHRoaXMuY2x1c3RlckNvdW50ID0gMDtcbiAgfVxuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0SG9zdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogXCJob3N0LlwiICsgKCsrdGhpcy5ob3N0Q291bnQpLFxuICAgICAgbmFtZTogXCJlYzIuXCIgKyB0aGlzLmhvc3RDb3VudCxcbiAgICAgIGFwcENvbXBvbmVudHM6IFt0aGlzLmdldEFwcENvbXBvbmVudCgpLCB0aGlzLmdldEFwcENvbXBvbmVudCgnZGInLCAnbW9uZ28tZGInKV0sXG4gICAgICBwbGF0Zm9ybUNvbXBvbmVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBcImxiXCIsXG4gICAgICAgICAga2luZDogXCJsb2FkLWJhbGFuY2VyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImxnXCIsXG4gICAgICAgICAga2luZDogXCJsb2dnZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwiaG1cIixcbiAgICAgICAgICBraW5kOiBcImhlYWx0aC1tb25pdG9yXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcIm1yXCIsXG4gICAgICAgICAga2luZDogXCJyb3V0ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwiZ3NcIixcbiAgICAgICAgICBraW5kOiBcImdsb2Itc3RvcmFnZVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0Q2x1c3RlciA9IGZ1bmN0aW9uKHRvdGFsTWVtYmVycykge1xuICAgIHZhciBkYXRhLCBpLCBqLCByZWY7XG4gICAgaWYgKHRvdGFsTWVtYmVycyA9PSBudWxsKSB7XG4gICAgICB0b3RhbE1lbWJlcnMgPSA0O1xuICAgIH1cbiAgICBkYXRhID0ge1xuICAgICAgaWQ6IFwiY2x1c3Rlci5cIiArICgrK3RoaXMuY2x1c3RlckNvdW50KSxcbiAgICAgIG5hbWU6IFwid2ViIFwiICsgKCsrdGhpcy5hcHBDb21wb25lbnRDb3VudCksXG4gICAgICBzZXJ2aWNlVHlwZTogXCJydWJ5XCIsXG4gICAgICBpbnN0YW5jZXM6IFtdXG4gICAgfTtcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxNZW1iZXJzOyAxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWY7IGkgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgZGF0YS5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgIGlkOiBcIndlYi5cIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgKyBcIi5cIiArIGksXG4gICAgICAgIGhvc3RJZDogXCJlYzIuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICAgIGhvc3ROYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRBcHBDb21wb25lbnQgPSBmdW5jdGlvbihraW5kLCB0eXBlKSB7XG4gICAgaWYgKGtpbmQgPT0gbnVsbCkge1xuICAgICAga2luZCA9ICd3ZWInO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICB0eXBlID0gXCJydWJ5XCI7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpZDoga2luZCArIFwiLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIG5hbWU6IGtpbmQgKyBcIiBcIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQsXG4gICAgICBzZXJ2aWNlVHlwZTogdHlwZVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRQbGF0Zm9ybUNvbXBvbmVudCA9IGZ1bmN0aW9uKGlkLCBuYW1lLCBzZXJ2aWNlVHlwZSkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1BsYXRmb3JtQ29tcG9uZW50OiB0cnVlLFxuICAgICAgaWQ6IGlkLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHNlcnZpY2VUeXBlOiBzZXJ2aWNlVHlwZVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIENsb2JiZXJCb3hEYXRhU2hpbTtcblxufSkoKTtcbiIsInZhciAkaG9sZGVyLCBDbG9iYmVyQm94RGF0YVNoaW0sIGFkZEV2ZW50TGlzdGVuZXJzLCBib3hlcywgZ2V0Qm94LCByZW1vdmVCb3gsIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucztcblxuQ2xvYmJlckJveERhdGFTaGltID0gcmVxdWlyZSgnLi9zaGltcy9kYXRhLXNoaW0nKTtcblxud2luZG93LmNsb2JiZXJCb3hEYXRhU2hpbSA9IG5ldyBDbG9iYmVyQm94RGF0YVNoaW0oKTtcblxuYm94ZXMgPSBbXTtcblxuJGhvbGRlciA9ICQoXCIuaG9sZGVyXCIpO1xuXG53aW5kb3cuaW5pdCA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcENvbXBvbmVudCwgY2x1c3RlckJveCwgaG9zdEJveCwgcGxhdGZvcm1Db21wb25lbnQ7XG4gICAgc3Vic2NyaWJlVG9SZWdpc3RyYXRpb25zKCk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBzdGF0c0RhdGFTaW11bHRvci5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlcigpO1xuICAgIGhvc3RCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgaG9zdEJveC5idWlsZCgkaG9sZGVyLCBuYW5vYm94LkNsb2JiZXJCb3guSE9TVCwgY2xvYmJlckJveERhdGFTaGltLmdldEhvc3QoKSk7XG4gICAgY2x1c3RlckJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICBjbHVzdGVyQm94LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5DTFVTVEVSLCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0Q2x1c3RlcigpKTtcbiAgICBhcHBDb21wb25lbnQgPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgYXBwQ29tcG9uZW50LmJ1aWxkKCRob2xkZXIsIG5hbm9ib3guQ2xvYmJlckJveC5BUFBfQ09NUE9ORU5ULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0QXBwQ29tcG9uZW50KCkpO1xuICAgIHBsYXRmb3JtQ29tcG9uZW50ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIHJldHVybiBwbGF0Zm9ybUNvbXBvbmVudC5idWlsZCgkaG9sZGVyLCBuYW5vYm94LkNsb2JiZXJCb3guUExBVEZPUk1fQ09NUE9ORU5ULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIkhlYWx0aCBNb25pdG9yXCIsIFwiaGVhbHRoLW1vbml0b3JcIikpO1xuICB9O1xufSkodGhpcyk7XG5cbnN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICBQdWJTdWIuc3Vic2NyaWJlKCdSRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgIHJldHVybiBib3hlcy5wdXNoKGJveCk7XG4gICAgfTtcbiAgfSkodGhpcykpO1xuICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnVU5SRUdJU1RFUicsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBib3gpIHtcbiAgICAgIHJldHVybiByZW1vdmVCb3goYm94KTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG59O1xuXG5hZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkFQUF9DT01QT05FTlRTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YSkuc3dpdGNoU3ViQ29udGVudCgnYXBwLWNvbXBvbmVudHMnKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuUExBVEZPUk1fQ09NUE9ORU5UUycsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGRhdGEpLnN3aXRjaFN1YkNvbnRlbnQoJ3BsYXRmb3JtLWNvbXBvbmVudHMnKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuSU5TVEFOQ0VTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHt9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU0NBTEUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgcmV0dXJuIGdldEJveChkYXRhKS5zd2l0Y2hTdWJDb250ZW50KCdzY2FsZS1tYWNoaW5lJyk7XG4gICAgfTtcbiAgfSkodGhpcykpO1xuICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLlNUQVRTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YSkuc3dpdGNoU3ViQ29udGVudCgnc3RhdHMnKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQ09OU09MRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGRhdGEpLnN3aXRjaFN1YkNvbnRlbnQoJ2NvbnNvbGUnKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1BMSVQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5BRE1JTicsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgfSkodGhpcykpO1xuICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU0hPVycsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgfSkodGhpcykpO1xufTtcblxuZ2V0Qm94ID0gZnVuY3Rpb24oa2V5KSB7XG4gIHZhciBib3gsIGosIGxlbjtcbiAgZm9yIChqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBib3ggPSBib3hlc1tqXTtcbiAgICBpZiAoa2V5ID09PSBib3guaWQpIHtcbiAgICAgIHJldHVybiBib3g7XG4gICAgfVxuICB9XG59O1xuXG5yZW1vdmVCb3ggPSBmdW5jdGlvbihkb29tZWRCb3gpIHtcbiAgdmFyIGJveCwgaSwgaiwgbGVuO1xuICBmb3IgKGkgPSBqID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgYm94ID0gYm94ZXNbaV07XG4gICAgaWYgKGJveC5pZCA9PT0gZG9vbWVkQm94LmlkKSB7XG4gICAgICBib3hlcy5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59O1xuIl19
