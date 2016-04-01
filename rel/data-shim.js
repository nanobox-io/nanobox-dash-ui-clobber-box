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
var ClobberBoxDataShim, addButtonEvents, appComponent, clusterBox, hostBox, platformComponent;

ClobberBoxDataShim = require('./shims/data-shim');

window.clobberBoxDataShim = new ClobberBoxDataShim();

hostBox = clusterBox = appComponent = platformComponent = "";

window.init = (function(_this) {
  return function() {
    statsDataSimultor.createFakeStatDataProvider();
    hostBox = new nanobox.ClobberBox();
    hostBox.build($("body"), nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost());
    clusterBox = new nanobox.ClobberBox();
    clusterBox.build($("body"), nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster());
    appComponent = new nanobox.ClobberBox();
    appComponent.build($("body"), nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent());
    platformComponent = new nanobox.ClobberBox();
    platformComponent.build($("body"), nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("hm", "Health Monitor", "health-monitor"));
    return addButtonEvents();
  };
})(this);

addButtonEvents = (function(_this) {
  return function() {
    $("#show-platform-components").on("click", function() {
      return hostBox.box.showPlatformComponents();
    });
    $("#show-app-components").on("click", function() {
      return hostBox.box.showAppComponents();
    });
    return $("#show-scale").on("click", function() {
      return hostBox.box.showScaleMachine();
    });
  };
})(this);

},{"./shims/data-shim":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIENsb2JiZXJCb3hEYXRhU2hpbTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbG9iYmVyQm94RGF0YVNoaW0gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIENsb2JiZXJCb3hEYXRhU2hpbSgpIHtcbiAgICB0aGlzLmhvc3RDb3VudCA9IDA7XG4gICAgdGhpcy5hcHBDb21wb25lbnRDb3VudCA9IDA7XG4gICAgdGhpcy5kYkNvdW50ID0gMDtcbiAgICB0aGlzLmNsdXN0ZXJDb3VudCA9IDA7XG4gIH1cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEhvc3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IFwiaG9zdC5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgIG5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnQsXG4gICAgICBhcHBDb21wb25lbnRzOiBbdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJyldLFxuICAgICAgcGxhdGZvcm1Db21wb25lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogXCJsYlwiLFxuICAgICAgICAgIGtpbmQ6IFwibG9hZC1iYWxhbmNlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJsZ1wiLFxuICAgICAgICAgIGtpbmQ6IFwibG9nZ2VyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImhtXCIsXG4gICAgICAgICAga2luZDogXCJoZWFsdGgtbW9uaXRvclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJtclwiLFxuICAgICAgICAgIGtpbmQ6IFwicm91dGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImdzXCIsXG4gICAgICAgICAga2luZDogXCJnbG9iLXN0b3JhZ2VcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldENsdXN0ZXIgPSBmdW5jdGlvbih0b3RhbE1lbWJlcnMpIHtcbiAgICB2YXIgZGF0YSwgaSwgaiwgcmVmO1xuICAgIGlmICh0b3RhbE1lbWJlcnMgPT0gbnVsbCkge1xuICAgICAgdG90YWxNZW1iZXJzID0gNDtcbiAgICB9XG4gICAgZGF0YSA9IHtcbiAgICAgIGlkOiBcImNsdXN0ZXIuXCIgKyAoKyt0aGlzLmNsdXN0ZXJDb3VudCksXG4gICAgICBuYW1lOiBcIndlYiBcIiArICgrK3RoaXMuYXBwQ29tcG9uZW50Q291bnQpLFxuICAgICAgc2VydmljZVR5cGU6IFwicnVieVwiLFxuICAgICAgaW5zdGFuY2VzOiBbXVxuICAgIH07XG4gICAgZm9yIChpID0gaiA9IDEsIHJlZiA9IHRvdGFsTWVtYmVyczsgMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmOyBpID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGRhdGEuaW5zdGFuY2VzLnB1c2goe1xuICAgICAgICBpZDogXCJ3ZWIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50ICsgXCIuXCIgKyBpLFxuICAgICAgICBob3N0SWQ6IFwiZWMyLlwiICsgKCsrdGhpcy5ob3N0Q291bnQpLFxuICAgICAgICBob3N0TmFtZTogXCJlYzIuXCIgKyB0aGlzLmhvc3RDb3VudFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0QXBwQ29tcG9uZW50ID0gZnVuY3Rpb24oa2luZCwgdHlwZSkge1xuICAgIGlmIChraW5kID09IG51bGwpIHtcbiAgICAgIGtpbmQgPSAnd2ViJztcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgICAgdHlwZSA9IFwicnVieVwiO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGtpbmQgKyBcIi5cIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQsXG4gICAgICBuYW1lOiBraW5kICsgXCIgXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50LFxuICAgICAgc2VydmljZVR5cGU6IHR5cGVcbiAgICB9O1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0UGxhdGZvcm1Db21wb25lbnQgPSBmdW5jdGlvbihpZCwgbmFtZSwgc2VydmljZVR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNQbGF0Zm9ybUNvbXBvbmVudDogdHJ1ZSxcbiAgICAgIGlkOiBpZCxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBzZXJ2aWNlVHlwZTogc2VydmljZVR5cGVcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBDbG9iYmVyQm94RGF0YVNoaW07XG5cbn0pKCk7XG4iLCJ2YXIgQ2xvYmJlckJveERhdGFTaGltLCBhZGRCdXR0b25FdmVudHMsIGFwcENvbXBvbmVudCwgY2x1c3RlckJveCwgaG9zdEJveCwgcGxhdGZvcm1Db21wb25lbnQ7XG5cbkNsb2JiZXJCb3hEYXRhU2hpbSA9IHJlcXVpcmUoJy4vc2hpbXMvZGF0YS1zaGltJyk7XG5cbndpbmRvdy5jbG9iYmVyQm94RGF0YVNoaW0gPSBuZXcgQ2xvYmJlckJveERhdGFTaGltKCk7XG5cbmhvc3RCb3ggPSBjbHVzdGVyQm94ID0gYXBwQ29tcG9uZW50ID0gcGxhdGZvcm1Db21wb25lbnQgPSBcIlwiO1xuXG53aW5kb3cuaW5pdCA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgICBob3N0Qm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGhvc3RCb3guYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5IT1NULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0SG9zdCgpKTtcbiAgICBjbHVzdGVyQm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGNsdXN0ZXJCb3guYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5DTFVTVEVSLCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0Q2x1c3RlcigpKTtcbiAgICBhcHBDb21wb25lbnQgPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgYXBwQ29tcG9uZW50LmJ1aWxkKCQoXCJib2R5XCIpLCBuYW5vYm94LkNsb2JiZXJCb3guQVBQX0NPTVBPTkVOVCwgY2xvYmJlckJveERhdGFTaGltLmdldEFwcENvbXBvbmVudCgpKTtcbiAgICBwbGF0Zm9ybUNvbXBvbmVudCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICBwbGF0Zm9ybUNvbXBvbmVudC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LlBMQVRGT1JNX0NPTVBPTkVOVCwgY2xvYmJlckJveERhdGFTaGltLmdldFBsYXRmb3JtQ29tcG9uZW50KFwiaG1cIiwgXCJIZWFsdGggTW9uaXRvclwiLCBcImhlYWx0aC1tb25pdG9yXCIpKTtcbiAgICByZXR1cm4gYWRkQnV0dG9uRXZlbnRzKCk7XG4gIH07XG59KSh0aGlzKTtcblxuYWRkQnV0dG9uRXZlbnRzID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAkKFwiI3Nob3ctcGxhdGZvcm0tY29tcG9uZW50c1wiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGhvc3RCb3guYm94LnNob3dQbGF0Zm9ybUNvbXBvbmVudHMoKTtcbiAgICB9KTtcbiAgICAkKFwiI3Nob3ctYXBwLWNvbXBvbmVudHNcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBob3N0Qm94LmJveC5zaG93QXBwQ29tcG9uZW50cygpO1xuICAgIH0pO1xuICAgIHJldHVybiAkKFwiI3Nob3ctc2NhbGVcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBob3N0Qm94LmJveC5zaG93U2NhbGVNYWNoaW5lKCk7XG4gICAgfSk7XG4gIH07XG59KSh0aGlzKTtcbiJdfQ==
