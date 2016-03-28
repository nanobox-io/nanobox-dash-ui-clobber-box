(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ClobberBoxDataShim;

module.exports = ClobberBoxDataShim = (function() {
  function ClobberBoxDataShim() {
    this.hostCount = 0;
    this.appComponentCount = 0;
    this.dbCount = 0;
    this.clusterCount = 0;
  }

  ClobberBoxDataShim.prototype.sendDummyStats = function(clobberBox) {
    clobberBox.stats.updateLiveStats(statsDataSimultor.generateFakeLiveStats());
    clobberBox.stats.updateHistoricStat("disk", statsDataSimultor.generateFakeHistoricalStats());
    clobberBox.stats.updateHistoricStat("ram", statsDataSimultor.generateFakeHistoricalStats());
    clobberBox.stats.updateHistoricStat("cpu", statsDataSimultor.generateFakeHistoricalStats());
    return clobberBox.stats.updateHistoricStat("swap", statsDataSimultor.generateFakeHistoricalStats());
  };

  ClobberBoxDataShim.prototype.getHost = function() {
    return {
      id: "host." + (++this.hostCount),
      name: "ec2." + this.hostCount,
      appComponents: [this.getAppComponent(), this.getAppComponent('db', 'mongo-db')],
      platformComponents: [this.getPlatformComponent("lb", "Load Balancer", "load-balancer"), this.getPlatformComponent("lg", "Logger", "logger"), this.getPlatformComponent("hm", "Health Monitor", "health-monitor"), this.getPlatformComponent("mr", "Message Router", "message-router"), this.getPlatformComponent("gs", "Blob Storage", "glob-storage")]
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
var ClobberBoxDataShim;

ClobberBoxDataShim = require('./shims/data-shim');

window.clobberBoxDataShim = new ClobberBoxDataShim();

window.init = function() {
  var appComponent, clusterBox, hostBox, platformComponent;
  hostBox = new nanobox.ClobberBox();
  hostBox.build($("body"), nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost());
  clobberBoxDataShim.sendDummyStats(hostBox);
  clusterBox = new nanobox.ClobberBox();
  clusterBox.build($("body"), nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster());
  clobberBoxDataShim.sendDummyStats(clusterBox);
  appComponent = new nanobox.ClobberBox();
  appComponent.build($("body"), nanobox.ClobberBox.APP_COMPONENT, clobberBoxDataShim.getAppComponent());
  clobberBoxDataShim.sendDummyStats(appComponent);
  platformComponent = new nanobox.ClobberBox();
  platformComponent.build($("body"), nanobox.ClobberBox.PLATFORM_COMPONENT, clobberBoxDataShim.getPlatformComponent("lb", "Load Balancer", "load-balancer"));
  return clobberBoxDataShim.sendDummyStats(platformComponent);
};

},{"./shims/data-shim":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIENsb2JiZXJCb3hEYXRhU2hpbTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbG9iYmVyQm94RGF0YVNoaW0gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIENsb2JiZXJCb3hEYXRhU2hpbSgpIHtcbiAgICB0aGlzLmhvc3RDb3VudCA9IDA7XG4gICAgdGhpcy5hcHBDb21wb25lbnRDb3VudCA9IDA7XG4gICAgdGhpcy5kYkNvdW50ID0gMDtcbiAgICB0aGlzLmNsdXN0ZXJDb3VudCA9IDA7XG4gIH1cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLnNlbmREdW1teVN0YXRzID0gZnVuY3Rpb24oY2xvYmJlckJveCkge1xuICAgIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlTGl2ZVN0YXRzKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUxpdmVTdGF0cygpKTtcbiAgICBjbG9iYmVyQm94LnN0YXRzLnVwZGF0ZUhpc3RvcmljU3RhdChcImRpc2tcIiwgc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVGYWtlSGlzdG9yaWNhbFN0YXRzKCkpO1xuICAgIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0KFwicmFtXCIsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgICBjbG9iYmVyQm94LnN0YXRzLnVwZGF0ZUhpc3RvcmljU3RhdChcImNwdVwiLCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSk7XG4gICAgcmV0dXJuIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0KFwic3dhcFwiLCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSk7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBcImhvc3QuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICBuYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50LFxuICAgICAgYXBwQ29tcG9uZW50czogW3RoaXMuZ2V0QXBwQ29tcG9uZW50KCksIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCdkYicsICdtb25nby1kYicpXSxcbiAgICAgIHBsYXRmb3JtQ29tcG9uZW50czogW3RoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJsYlwiLCBcIkxvYWQgQmFsYW5jZXJcIiwgXCJsb2FkLWJhbGFuY2VyXCIpLCB0aGlzLmdldFBsYXRmb3JtQ29tcG9uZW50KFwibGdcIiwgXCJMb2dnZXJcIiwgXCJsb2dnZXJcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIkhlYWx0aCBNb25pdG9yXCIsIFwiaGVhbHRoLW1vbml0b3JcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJtclwiLCBcIk1lc3NhZ2UgUm91dGVyXCIsIFwibWVzc2FnZS1yb3V0ZXJcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJnc1wiLCBcIkJsb2IgU3RvcmFnZVwiLCBcImdsb2Itc3RvcmFnZVwiKV1cbiAgICB9O1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0Q2x1c3RlciA9IGZ1bmN0aW9uKHRvdGFsTWVtYmVycykge1xuICAgIHZhciBkYXRhLCBpLCBqLCByZWY7XG4gICAgaWYgKHRvdGFsTWVtYmVycyA9PSBudWxsKSB7XG4gICAgICB0b3RhbE1lbWJlcnMgPSA0O1xuICAgIH1cbiAgICBkYXRhID0ge1xuICAgICAgaWQ6IFwiY2x1c3Rlci5cIiArICgrK3RoaXMuY2x1c3RlckNvdW50KSxcbiAgICAgIG5hbWU6IFwid2ViIFwiICsgKCsrdGhpcy5hcHBDb21wb25lbnRDb3VudCksXG4gICAgICBzZXJ2aWNlVHlwZTogXCJydWJ5XCIsXG4gICAgICBpbnN0YW5jZXM6IFtdXG4gICAgfTtcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxNZW1iZXJzOyAxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWY7IGkgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgZGF0YS5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgIGlkOiBcIndlYi5cIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgKyBcIi5cIiArIGksXG4gICAgICAgIGhvc3RJZDogXCJlYzIuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICAgIGhvc3ROYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRBcHBDb21wb25lbnQgPSBmdW5jdGlvbihraW5kLCB0eXBlKSB7XG4gICAgaWYgKGtpbmQgPT0gbnVsbCkge1xuICAgICAga2luZCA9ICd3ZWInO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICB0eXBlID0gXCJydWJ5XCI7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpZDoga2luZCArIFwiLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIG5hbWU6IGtpbmQgKyBcIiBcIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQsXG4gICAgICBzZXJ2aWNlVHlwZTogdHlwZVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRQbGF0Zm9ybUNvbXBvbmVudCA9IGZ1bmN0aW9uKGlkLCBuYW1lLCBzZXJ2aWNlVHlwZSkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1BsYXRmb3JtQ29tcG9uZW50OiB0cnVlLFxuICAgICAgaWQ6IGlkLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHNlcnZpY2VUeXBlOiBzZXJ2aWNlVHlwZVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIENsb2JiZXJCb3hEYXRhU2hpbTtcblxufSkoKTtcbiIsInZhciBDbG9iYmVyQm94RGF0YVNoaW07XG5cbkNsb2JiZXJCb3hEYXRhU2hpbSA9IHJlcXVpcmUoJy4vc2hpbXMvZGF0YS1zaGltJyk7XG5cbndpbmRvdy5jbG9iYmVyQm94RGF0YVNoaW0gPSBuZXcgQ2xvYmJlckJveERhdGFTaGltKCk7XG5cbndpbmRvdy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcHBDb21wb25lbnQsIGNsdXN0ZXJCb3gsIGhvc3RCb3gsIHBsYXRmb3JtQ29tcG9uZW50O1xuICBob3N0Qm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICBob3N0Qm94LmJ1aWxkKCQoXCJib2R5XCIpLCBuYW5vYm94LkNsb2JiZXJCb3guSE9TVCwgY2xvYmJlckJveERhdGFTaGltLmdldEhvc3QoKSk7XG4gIGNsb2JiZXJCb3hEYXRhU2hpbS5zZW5kRHVtbXlTdGF0cyhob3N0Qm94KTtcbiAgY2x1c3RlckJveCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgY2x1c3RlckJveC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LkNMVVNURVIsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRDbHVzdGVyKCkpO1xuICBjbG9iYmVyQm94RGF0YVNoaW0uc2VuZER1bW15U3RhdHMoY2x1c3RlckJveCk7XG4gIGFwcENvbXBvbmVudCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgYXBwQ29tcG9uZW50LmJ1aWxkKCQoXCJib2R5XCIpLCBuYW5vYm94LkNsb2JiZXJCb3guQVBQX0NPTVBPTkVOVCwgY2xvYmJlckJveERhdGFTaGltLmdldEFwcENvbXBvbmVudCgpKTtcbiAgY2xvYmJlckJveERhdGFTaGltLnNlbmREdW1teVN0YXRzKGFwcENvbXBvbmVudCk7XG4gIHBsYXRmb3JtQ29tcG9uZW50ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICBwbGF0Zm9ybUNvbXBvbmVudC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LlBMQVRGT1JNX0NPTVBPTkVOVCwgY2xvYmJlckJveERhdGFTaGltLmdldFBsYXRmb3JtQ29tcG9uZW50KFwibGJcIiwgXCJMb2FkIEJhbGFuY2VyXCIsIFwibG9hZC1iYWxhbmNlclwiKSk7XG4gIHJldHVybiBjbG9iYmVyQm94RGF0YVNoaW0uc2VuZER1bW15U3RhdHMocGxhdGZvcm1Db21wb25lbnQpO1xufTtcbiJdfQ==
