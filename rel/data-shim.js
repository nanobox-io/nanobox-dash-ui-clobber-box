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
    return $("#show-platform-components").trigger("click");
  };
})(this);

},{"./shims/data-shim":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDbG9iYmVyQm94RGF0YVNoaW07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvYmJlckJveERhdGFTaGltID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDbG9iYmVyQm94RGF0YVNoaW0oKSB7XG4gICAgdGhpcy5ob3N0Q291bnQgPSAwO1xuICAgIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuICAgIHRoaXMuZGJDb3VudCA9IDA7XG4gICAgdGhpcy5jbHVzdGVyQ291bnQgPSAwO1xuICB9XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBcImhvc3QuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICBuYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50LFxuICAgICAgYXBwQ29tcG9uZW50czogW3RoaXMuZ2V0QXBwQ29tcG9uZW50KCksIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCdkYicsICdtb25nby1kYicpXSxcbiAgICAgIHBsYXRmb3JtQ29tcG9uZW50czogW3RoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJsYlwiLCBcIkxvYWQgQmFsYW5jZXJcIiwgXCJsb2FkLWJhbGFuY2VyXCIpLCB0aGlzLmdldFBsYXRmb3JtQ29tcG9uZW50KFwibGdcIiwgXCJMb2dnZXJcIiwgXCJsb2dnZXJcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIkhlYWx0aCBNb25pdG9yXCIsIFwiaGVhbHRoLW1vbml0b3JcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJtclwiLCBcIk1lc3NhZ2UgUm91dGVyXCIsIFwibWVzc2FnZS1yb3V0ZXJcIiksIHRoaXMuZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJnc1wiLCBcIkJsb2IgU3RvcmFnZVwiLCBcImdsb2Itc3RvcmFnZVwiKV1cbiAgICB9O1xuICB9O1xuXG4gIENsb2JiZXJCb3hEYXRhU2hpbS5wcm90b3R5cGUuZ2V0Q2x1c3RlciA9IGZ1bmN0aW9uKHRvdGFsTWVtYmVycykge1xuICAgIHZhciBkYXRhLCBpLCBqLCByZWY7XG4gICAgaWYgKHRvdGFsTWVtYmVycyA9PSBudWxsKSB7XG4gICAgICB0b3RhbE1lbWJlcnMgPSA0O1xuICAgIH1cbiAgICBkYXRhID0ge1xuICAgICAgaWQ6IFwiY2x1c3Rlci5cIiArICgrK3RoaXMuY2x1c3RlckNvdW50KSxcbiAgICAgIG5hbWU6IFwid2ViIFwiICsgKCsrdGhpcy5hcHBDb21wb25lbnRDb3VudCksXG4gICAgICBzZXJ2aWNlVHlwZTogXCJydWJ5XCIsXG4gICAgICBpbnN0YW5jZXM6IFtdXG4gICAgfTtcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxNZW1iZXJzOyAxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWY7IGkgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgZGF0YS5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgIGlkOiBcIndlYi5cIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgKyBcIi5cIiArIGksXG4gICAgICAgIGhvc3RJZDogXCJlYzIuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICAgIGhvc3ROYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRBcHBDb21wb25lbnQgPSBmdW5jdGlvbihraW5kLCB0eXBlKSB7XG4gICAgaWYgKGtpbmQgPT0gbnVsbCkge1xuICAgICAga2luZCA9ICd3ZWInO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICB0eXBlID0gXCJydWJ5XCI7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpZDoga2luZCArIFwiLlwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIG5hbWU6IGtpbmQgKyBcIiBcIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQsXG4gICAgICBzZXJ2aWNlVHlwZTogdHlwZVxuICAgIH07XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRQbGF0Zm9ybUNvbXBvbmVudCA9IGZ1bmN0aW9uKGlkLCBuYW1lLCBzZXJ2aWNlVHlwZSkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1BsYXRmb3JtQ29tcG9uZW50OiB0cnVlLFxuICAgICAgaWQ6IGlkLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHNlcnZpY2VUeXBlOiBzZXJ2aWNlVHlwZVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIENsb2JiZXJCb3hEYXRhU2hpbTtcblxufSkoKTtcbiIsInZhciBDbG9iYmVyQm94RGF0YVNoaW0sIGFkZEJ1dHRvbkV2ZW50cywgYXBwQ29tcG9uZW50LCBjbHVzdGVyQm94LCBob3N0Qm94LCBwbGF0Zm9ybUNvbXBvbmVudDtcblxuQ2xvYmJlckJveERhdGFTaGltID0gcmVxdWlyZSgnLi9zaGltcy9kYXRhLXNoaW0nKTtcblxud2luZG93LmNsb2JiZXJCb3hEYXRhU2hpbSA9IG5ldyBDbG9iYmVyQm94RGF0YVNoaW0oKTtcblxuaG9zdEJveCA9IGNsdXN0ZXJCb3ggPSBhcHBDb21wb25lbnQgPSBwbGF0Zm9ybUNvbXBvbmVudCA9IFwiXCI7XG5cbndpbmRvdy5pbml0ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBzdGF0c0RhdGFTaW11bHRvci5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlcigpO1xuICAgIGhvc3RCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgaG9zdEJveC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LkhPU1QsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3N0KCkpO1xuICAgIGNsdXN0ZXJCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgY2x1c3RlckJveC5idWlsZCgkKFwiYm9keVwiKSwgbmFub2JveC5DbG9iYmVyQm94LkNMVVNURVIsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRDbHVzdGVyKCkpO1xuICAgIGFwcENvbXBvbmVudCA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICBhcHBDb21wb25lbnQuYnVpbGQoJChcImJvZHlcIiksIG5hbm9ib3guQ2xvYmJlckJveC5BUFBfQ09NUE9ORU5ULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0QXBwQ29tcG9uZW50KCkpO1xuICAgIHBsYXRmb3JtQ29tcG9uZW50ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIHBsYXRmb3JtQ29tcG9uZW50LmJ1aWxkKCQoXCJib2R5XCIpLCBuYW5vYm94LkNsb2JiZXJCb3guUExBVEZPUk1fQ09NUE9ORU5ULCBjbG9iYmVyQm94RGF0YVNoaW0uZ2V0UGxhdGZvcm1Db21wb25lbnQoXCJobVwiLCBcIkhlYWx0aCBNb25pdG9yXCIsIFwiaGVhbHRoLW1vbml0b3JcIikpO1xuICAgIHJldHVybiBhZGRCdXR0b25FdmVudHMoKTtcbiAgfTtcbn0pKHRoaXMpO1xuXG5hZGRCdXR0b25FdmVudHMgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICQoXCIjc2hvdy1wbGF0Zm9ybS1jb21wb25lbnRzXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaG9zdEJveC5ib3guc2hvd1BsYXRmb3JtQ29tcG9uZW50cygpO1xuICAgIH0pO1xuICAgICQoXCIjc2hvdy1hcHAtY29tcG9uZW50c1wiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGhvc3RCb3guYm94LnNob3dBcHBDb21wb25lbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuICQoXCIjc2hvdy1wbGF0Zm9ybS1jb21wb25lbnRzXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgfTtcbn0pKHRoaXMpO1xuIl19
