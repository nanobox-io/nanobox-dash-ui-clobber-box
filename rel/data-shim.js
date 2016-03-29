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
      appComponents: [this.getAppComponent(), this.getAppComponent(), this.getAppComponent(), this.getAppComponent(), this.getAppComponent('db', 'mongo-db')],
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
var ClobberBoxDataShim, addButtonEvents, appComponent, clusterBox, hostBox, platformComponent;

ClobberBoxDataShim = require('./shims/data-shim');

window.clobberBoxDataShim = new ClobberBoxDataShim();

hostBox = clusterBox = appComponent = platformComponent = "";

window.init = (function(_this) {
  return function() {
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
    clobberBoxDataShim.sendDummyStats(platformComponent);
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
    return $("#show-app-components").trigger("click");
  };
})(this);

},{"./shims/data-shim":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ2xvYmJlckJveERhdGFTaGltO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2JiZXJCb3hEYXRhU2hpbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveERhdGFTaGltKCkge1xuICAgIHRoaXMuaG9zdENvdW50ID0gMDtcbiAgICB0aGlzLmFwcENvbXBvbmVudENvdW50ID0gMDtcbiAgICB0aGlzLmRiQ291bnQgPSAwO1xuICAgIHRoaXMuY2x1c3RlckNvdW50ID0gMDtcbiAgfVxuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuc2VuZER1bW15U3RhdHMgPSBmdW5jdGlvbihjbG9iYmVyQm94KSB7XG4gICAgY2xvYmJlckJveC5zdGF0cy51cGRhdGVMaXZlU3RhdHMoc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVGYWtlTGl2ZVN0YXRzKCkpO1xuICAgIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0KFwiZGlza1wiLCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSk7XG4gICAgY2xvYmJlckJveC5zdGF0cy51cGRhdGVIaXN0b3JpY1N0YXQoXCJyYW1cIiwgc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVGYWtlSGlzdG9yaWNhbFN0YXRzKCkpO1xuICAgIGNsb2JiZXJCb3guc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0KFwiY3B1XCIsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgICByZXR1cm4gY2xvYmJlckJveC5zdGF0cy51cGRhdGVIaXN0b3JpY1N0YXQoXCJzd2FwXCIsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEhvc3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IFwiaG9zdC5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgIG5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnQsXG4gICAgICBhcHBDb21wb25lbnRzOiBbdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJyldLFxuICAgICAgcGxhdGZvcm1Db21wb25lbnRzOiBbdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImxiXCIsIFwiTG9hZCBCYWxhbmNlclwiLCBcImxvYWQtYmFsYW5jZXJcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJsZ1wiLCBcIkxvZ2dlclwiLCBcImxvZ2dlclwiKSwgdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImhtXCIsIFwiSGVhbHRoIE1vbml0b3JcIiwgXCJoZWFsdGgtbW9uaXRvclwiKSwgdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcIm1yXCIsIFwiTWVzc2FnZSBSb3V0ZXJcIiwgXCJtZXNzYWdlLXJvdXRlclwiKSwgdGhpcy5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImdzXCIsIFwiQmxvYiBTdG9yYWdlXCIsIFwiZ2xvYi1zdG9yYWdlXCIpXVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRDbHVzdGVyID0gZnVuY3Rpb24odG90YWxNZW1iZXJzKSB7XG4gICAgdmFyIGRhdGEsIGksIGosIHJlZjtcbiAgICBpZiAodG90YWxNZW1iZXJzID09IG51bGwpIHtcbiAgICAgIHRvdGFsTWVtYmVycyA9IDQ7XG4gICAgfVxuICAgIGRhdGEgPSB7XG4gICAgICBpZDogXCJjbHVzdGVyLlwiICsgKCsrdGhpcy5jbHVzdGVyQ291bnQpLFxuICAgICAgbmFtZTogXCJ3ZWIgXCIgKyAoKyt0aGlzLmFwcENvbXBvbmVudENvdW50KSxcbiAgICAgIHNlcnZpY2VUeXBlOiBcInJ1YnlcIixcbiAgICAgIGluc3RhbmNlczogW11cbiAgICB9O1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbE1lbWJlcnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBkYXRhLmluc3RhbmNlcy5wdXNoKHtcbiAgICAgICAgaWQ6IFwid2ViLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCArIFwiLlwiICsgaSxcbiAgICAgICAgaG9zdElkOiBcImVjMi5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgICAgaG9zdE5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldEFwcENvbXBvbmVudCA9IGZ1bmN0aW9uKGtpbmQsIHR5cGUpIHtcbiAgICBpZiAoa2luZCA9PSBudWxsKSB7XG4gICAgICBraW5kID0gJ3dlYic7XG4gICAgfVxuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHR5cGUgPSBcInJ1YnlcIjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBraW5kICsgXCIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50LFxuICAgICAgbmFtZToga2luZCArIFwiIFwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIHNlcnZpY2VUeXBlOiB0eXBlXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldFBsYXRmb3JtQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQsIG5hbWUsIHNlcnZpY2VUeXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzUGxhdGZvcm1Db21wb25lbnQ6IHRydWUsXG4gICAgICBpZDogaWQsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgc2VydmljZVR5cGU6IHNlcnZpY2VUeXBlXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gQ2xvYmJlckJveERhdGFTaGltO1xuXG59KSgpO1xuIiwidmFyIENsb2JiZXJCb3hEYXRhU2hpbSwgYWRkQnV0dG9uRXZlbnRzLCBhcHBDb21wb25lbnQsIGNsdXN0ZXJCb3gsIGhvc3RCb3gsIHBsYXRmb3JtQ29tcG9uZW50O1xuXG5DbG9iYmVyQm94RGF0YVNoaW0gPSByZXF1aXJlKCcuL3NoaW1zL2RhdGEtc2hpbScpO1xuXG53aW5kb3cuY2xvYmJlckJveERhdGFTaGltID0gbmV3IENsb2JiZXJCb3hEYXRhU2hpbSgpO1xuXG5ob3N0Qm94ID0gY2x1c3RlckJveCA9IGFwcENvbXBvbmVudCA9IHBsYXRmb3JtQ29tcG9uZW50ID0gXCJcIjtcblxud2luZG93LmluaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGhvc3RCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgaG9zdEJveC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LkhPU1QsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3N0KCkpO1xuICAgIGNsb2JiZXJCb3hEYXRhU2hpbS5zZW5kRHVtbXlTdGF0cyhob3N0Qm94KTtcbiAgICBjbHVzdGVyQm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGNsdXN0ZXJCb3guYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5DTFVTVEVSLCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0Q2x1c3RlcigpKTtcbiAgICBjbG9iYmVyQm94RGF0YVNoaW0uc2VuZER1bW15U3RhdHMoY2x1c3RlckJveCk7XG4gICAgYXBwQ29tcG9uZW50ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGFwcENvbXBvbmVudC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LkFQUF9DT01QT05FTlQsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRBcHBDb21wb25lbnQoKSk7XG4gICAgY2xvYmJlckJveERhdGFTaGltLnNlbmREdW1teVN0YXRzKGFwcENvbXBvbmVudCk7XG4gICAgcGxhdGZvcm1Db21wb25lbnQgPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgcGxhdGZvcm1Db21wb25lbnQuYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5QTEFURk9STV9DT01QT05FTlQsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRQbGF0Zm9ybUNvbXBvbmVudChcImxiXCIsIFwiTG9hZCBCYWxhbmNlclwiLCBcImxvYWQtYmFsYW5jZXJcIikpO1xuICAgIGNsb2JiZXJCb3hEYXRhU2hpbS5zZW5kRHVtbXlTdGF0cyhwbGF0Zm9ybUNvbXBvbmVudCk7XG4gICAgcmV0dXJuIGFkZEJ1dHRvbkV2ZW50cygpO1xuICB9O1xufSkodGhpcyk7XG5cbmFkZEJ1dHRvbkV2ZW50cyA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgJChcIiNzaG93LXBsYXRmb3JtLWNvbXBvbmVudHNcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBob3N0Qm94LmJveC5zaG93UGxhdGZvcm1Db21wb25lbnRzKCk7XG4gICAgfSk7XG4gICAgJChcIiNzaG93LWFwcC1jb21wb25lbnRzXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaG9zdEJveC5ib3guc2hvd0FwcENvbXBvbmVudHMoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gJChcIiNzaG93LWFwcC1jb21wb25lbnRzXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgfTtcbn0pKHRoaXMpO1xuIl19
