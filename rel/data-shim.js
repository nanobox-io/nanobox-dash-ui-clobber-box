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
      id: "ec2." + (++this.hostCount),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIENsb2JiZXJCb3hEYXRhU2hpbTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbG9iYmVyQm94RGF0YVNoaW0gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIENsb2JiZXJCb3hEYXRhU2hpbSgpIHtcbiAgICB0aGlzLmhvc3RDb3VudCA9IDA7XG4gICAgdGhpcy5hcHBDb21wb25lbnRDb3VudCA9IDA7XG4gICAgdGhpcy5kYkNvdW50ID0gMDtcbiAgICB0aGlzLmNsdXN0ZXJDb3VudCA9IDA7XG4gIH1cblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLnNlbmREdW1teVN0YXRzID0gZnVuY3Rpb24oY2xvYmJlckJveCkge1xuICAgIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlTGl2ZVN0YXRzKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUxpdmVTdGF0cygpKTtcbiAgICBjbG9iYmVyQm94LnN0YXRzLnVwZGF0ZUhpc3RvcmljU3RhdChcImRpc2tcIiwgc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVGYWtlSGlzdG9yaWNhbFN0YXRzKCkpO1xuICAgIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0KFwicmFtXCIsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgICBjbG9iYmVyQm94LnN0YXRzLnVwZGF0ZUhpc3RvcmljU3RhdChcImNwdVwiLCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSk7XG4gICAgcmV0dXJuIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0KFwic3dhcFwiLCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSk7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBcImVjMi5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgIG5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnQsXG4gICAgICBhcHBDb21wb25lbnRzOiBbdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJyldLFxuICAgICAgcGxhdGZvcm1Db21wb25lbnRzOiBbdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImxiXCIsIFwiTG9hZCBCYWxhbmNlclwiLCBcImxvYWQtYmFsYW5jZXJcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJsZ1wiLCBcIkxvZ2dlclwiLCBcImxvZ2dlclwiKSwgdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImhtXCIsIFwiSGVhbHRoIE1vbml0b3JcIiwgXCJoZWFsdGgtbW9uaXRvclwiKSwgdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcIm1yXCIsIFwiTWVzc2FnZSBSb3V0ZXJcIiwgXCJtZXNzYWdlLXJvdXRlclwiKSwgdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImdzXCIsIFwiQmxvYiBTdG9yYWdlXCIsIFwiZ2xvYi1zdG9yYWdlXCIpXVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRDbHVzdGVyID0gZnVuY3Rpb24odG90YWxNZW1iZXJzKSB7XG4gICAgdmFyIGRhdGEsIGksIGosIHJlZjtcbiAgICBpZiAodG90YWxNZW1iZXJzID09IG51bGwpIHtcbiAgICAgIHRvdGFsTWVtYmVycyA9IDQ7XG4gICAgfVxuICAgIGRhdGEgPSB7XG4gICAgICBpZDogXCJjbHVzdGVyLlwiICsgKCsrdGhpcy5jbHVzdGVyQ291bnQpLFxuICAgICAgbmFtZTogXCJ3ZWIgXCIgKyAoKyt0aGlzLmFwcENvbXBvbmVudENvdW50KSxcbiAgICAgIHNlcnZpY2VUeXBlOiBcInJ1YnlcIixcbiAgICAgIGluc3RhbmNlczogW11cbiAgICB9O1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbE1lbWJlcnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBkYXRhLmluc3RhbmNlcy5wdXNoKHtcbiAgICAgICAgaWQ6IFwid2ViLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCArIFwiLlwiICsgaSxcbiAgICAgICAgaG9zdElkOiBcImVjMi5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgICAgaG9zdE5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEFwcENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHR5cGUgPSBcInJ1YnlcIjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBraW5kICsgXCIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50LFxuICAgICAgbmFtZToga2luZCArIFwiIFwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIHNlcnZpY2VUeXBlOiB0eXBlXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldFBsYXRmb3JtQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQsIG5hbWUsIHNlcnZpY2VUeXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzUGxhdGZvcm1Db21wb25lbnQ6IHRydWUsXG4gICAgICBpZDogaWQsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgc2VydmljZVR5cGU6IHNlcnZpY2VUeXBlXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gQ2xvYmJlckJveERhdGFTaGltO1xuXG59KSgpO1xuIiwidmFyIENsb2JiZXJCb3hEYXRhU2hpbTtcblxuQ2xvYmJlckJveERhdGFTaGltID0gcmVxdWlyZSgnLi9zaGltcy9kYXRhLXNoaW0nKTtcblxud2luZG93LmNsb2JiZXJCb3hEYXRhU2hpbSA9IG5ldyBDbG9iYmVyQm94RGF0YVNoaW0oKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFwcENvbXBvbmVudCwgY2x1c3RlckJveCwgaG9zdEJveCwgcGxhdGZvcm1Db21wb25lbnQ7XG4gIGhvc3RCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gIGhvc3RCb3guYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5IT1NULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0SG9zdCgpKTtcbiAgY2xvYmJlckJveERhdGFTaGltLnNlbmREdW1teVN0YXRzKGhvc3RCb3gpO1xuICBjbHVzdGVyQm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICBjbHVzdGVyQm94LmJ1aWxkKCQoXCJib2R5XCIpLCBuYW5vYm94LkNsb2JiZXJCb3guQ0xVU1RFUiwgY2xvYmJlckJveERhdGFTaGltLmdldENsdXN0ZXIoKSk7XG4gIGNsb2JiZXJCb3hEYXRhU2hpbS5zZW5kRHVtbXlTdGF0cyhjbHVzdGVyQm94KTtcbiAgYXBwQ29tcG9uZW50ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICBhcHBDb21wb25lbnQuYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5BUFBfQ09NUE9ORU5ULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0QXBwQ29tcG9uZW50KCkpO1xuICBjbG9iYmVyQm94RGF0YVNoaW0uc2VuZER1bW15U3RhdHMoYXBwQ29tcG9uZW50KTtcbiAgcGxhdGZvcm1Db21wb25lbnQgPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gIHBsYXRmb3JtQ29tcG9uZW50LmJ1aWxkKCQoXCJib2R5XCIpLCBuYW5vYm94LkNsb2JiZXJCb3guUExBVEZPUk1fQ09NUE9ORU5ULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJsYlwiLCBcIkxvYWQgQmFsYW5jZXJcIiwgXCJsb2FkLWJhbGFuY2VyXCIpKTtcbiAgcmV0dXJuIGNsb2JiZXJCb3hEYXRhU2hpbS5zZW5kRHVtbXlTdGF0cyhwbGF0Zm9ybUNvbXBvbmVudCk7XG59O1xuIl19
