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
      state: "active",
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
      state: "active",
      serverSpecsId: "b4",
      id: "cluster." + (++this.clusterCount),
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
      state: "active",
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
    var clusterBox, hostBox;
    subscribeToRegistrations();
    addEventListeners();
    statsDataSimultor.createFakeStatDataProvider();
    hostBox = new nanobox.ClobberBox();
    hostBox.build($holder, nanobox.ClobberBox.HOST, clobberBoxDataShim.getHost());
    clusterBox = new nanobox.ClobberBox();
    return clusterBox.build($holder, nanobox.ClobberBox.CLUSTER, clobberBoxDataShim.getCluster());
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

window.setState = function(id, state) {
  return getBox(id).setState(state);
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
  PubSub.subscribe('SHOW.ADMIN', (function(_this) {
    return function(m, data) {
      return getBox(data.id).switchSubContent('admin', data.el);
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbXMvZGF0YS1zaGltLmNvZmZlZSIsInN0YWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDbG9iYmVyQm94RGF0YVNoaW07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvYmJlckJveERhdGFTaGltID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDbG9iYmVyQm94RGF0YVNoaW0oKSB7XG4gICAgdGhpcy5ob3N0Q291bnQgPSAwO1xuICAgIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgPSAwO1xuICAgIHRoaXMuZGJDb3VudCA9IDA7XG4gICAgdGhpcy5jbHVzdGVyQ291bnQgPSAwO1xuICB9XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgaWQ6IFwiaG9zdC5cIiArICgrK3RoaXMuaG9zdENvdW50KSxcbiAgICAgIG5hbWU6IFwiZWMyLlwiICsgdGhpcy5ob3N0Q291bnQsXG4gICAgICBzZXJ2ZXJTcGVjc0lkOiBcImIxXCIsXG4gICAgICBhcHBDb21wb25lbnRzOiBbdGhpcy5nZXRBcHBDb21wb25lbnQoKSwgdGhpcy5nZXRBcHBDb21wb25lbnQoJ2RiJywgJ21vbmdvLWRiJyldLFxuICAgICAgcGxhdGZvcm1Db21wb25lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogXCJsYlwiLFxuICAgICAgICAgIGtpbmQ6IFwibG9hZC1iYWxhbmNlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJsZ1wiLFxuICAgICAgICAgIGtpbmQ6IFwibG9nZ2VyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImhtXCIsXG4gICAgICAgICAga2luZDogXCJoZWFsdGgtbW9uaXRvclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJtclwiLFxuICAgICAgICAgIGtpbmQ6IFwicm91dGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImdzXCIsXG4gICAgICAgICAga2luZDogXCJnbG9iLXN0b3JhZ2VcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldENsdXN0ZXIgPSBmdW5jdGlvbih0b3RhbE1lbWJlcnMpIHtcbiAgICB2YXIgZGF0YSwgaSwgaiwgcmVmO1xuICAgIGlmICh0b3RhbE1lbWJlcnMgPT0gbnVsbCkge1xuICAgICAgdG90YWxNZW1iZXJzID0gNDtcbiAgICB9XG4gICAgZGF0YSA9IHtcbiAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgc2VydmVyU3BlY3NJZDogXCJiNFwiLFxuICAgICAgaWQ6IFwiY2x1c3Rlci5cIiArICgrK3RoaXMuY2x1c3RlckNvdW50KSxcbiAgICAgIG5hbWU6IFwid2ViIFwiICsgKCsrdGhpcy5hcHBDb21wb25lbnRDb3VudCksXG4gICAgICBhcHBDb21wb25lbnRzOiBbdGhpcy5nZXRBcHBDb21wb25lbnQoKV0sXG4gICAgICBzZXJ2aWNlVHlwZTogXCJydWJ5XCIsXG4gICAgICBpbnN0YW5jZXM6IFtdXG4gICAgfTtcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxNZW1iZXJzOyAxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWY7IGkgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgZGF0YS5pbnN0YW5jZXMucHVzaCh7XG4gICAgICAgIGlkOiBcIndlYi5cIiArIHRoaXMuYXBwQ29tcG9uZW50Q291bnQgKyBcIi5cIiArIGksXG4gICAgICAgIGhvc3RJZDogXCJlYzIuXCIgKyAoKyt0aGlzLmhvc3RDb3VudCksXG4gICAgICAgIGhvc3ROYW1lOiBcImVjMi5cIiArIHRoaXMuaG9zdENvdW50XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgQ2xvYmJlckJveERhdGFTaGltLnByb3RvdHlwZS5nZXRBcHBDb21wb25lbnQgPSBmdW5jdGlvbihraW5kLCB0eXBlKSB7XG4gICAgaWYgKGtpbmQgPT0gbnVsbCkge1xuICAgICAga2luZCA9ICd3ZWInO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICB0eXBlID0gXCJydWJ5XCI7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZTogXCJhY3RpdmVcIixcbiAgICAgIHNlcnZlclNwZWNzSWQ6IFwiYjNcIixcbiAgICAgIGlkOiBraW5kICsgXCIuXCIgKyB0aGlzLmFwcENvbXBvbmVudENvdW50LFxuICAgICAgbmFtZToga2luZCArIFwiIFwiICsgdGhpcy5hcHBDb21wb25lbnRDb3VudCxcbiAgICAgIHNlcnZpY2VUeXBlOiB0eXBlXG4gICAgfTtcbiAgfTtcblxuICBDbG9iYmVyQm94RGF0YVNoaW0ucHJvdG90eXBlLmdldFBsYXRmb3JtQ29tcG9uZW50ID0gZnVuY3Rpb24oaWQsIG5hbWUsIHNlcnZpY2VUeXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlOiBcImFjdGl2ZVwiLFxuICAgICAgc2VydmVyU3BlY3NJZDogXCJiMlwiLFxuICAgICAgaXNQbGF0Zm9ybUNvbXBvbmVudDogdHJ1ZSxcbiAgICAgIGlkOiBpZCxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBzZXJ2aWNlVHlwZTogc2VydmljZVR5cGVcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBDbG9iYmVyQm94RGF0YVNoaW07XG5cbn0pKCk7XG4iLCJ2YXIgJGhvbGRlciwgQ2xvYmJlckJveERhdGFTaGltLCBhZGRFdmVudExpc3RlbmVycywgYm94ZXMsIGdldEJveCwgcmVtb3ZlQm94LCBzdWJzY3JpYmVUb1JlZ2lzdHJhdGlvbnM7XG5cbkNsb2JiZXJCb3hEYXRhU2hpbSA9IHJlcXVpcmUoJy4vc2hpbXMvZGF0YS1zaGltJyk7XG5cbndpbmRvdy5jbG9iYmVyQm94RGF0YVNoaW0gPSBuZXcgQ2xvYmJlckJveERhdGFTaGltKCk7XG5cbmJveGVzID0gW107XG5cbiRob2xkZXIgPSAkKFwiLmhvbGRlclwiKTtcblxud2luZG93LmluaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbHVzdGVyQm94LCBob3N0Qm94O1xuICAgIHN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucygpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgICBob3N0Qm94ID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGhvc3RCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkhPU1QsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRIb3N0KCkpO1xuICAgIGNsdXN0ZXJCb3ggPSBuZXcgbmFub2JveC5DbG9iYmVyQm94KCk7XG4gICAgcmV0dXJuIGNsdXN0ZXJCb3guYnVpbGQoJGhvbGRlciwgbmFub2JveC5DbG9iYmVyQm94LkNMVVNURVIsIGNsb2JiZXJCb3hEYXRhU2hpbS5nZXRDbHVzdGVyKCkpO1xuICB9O1xufSkodGhpcyk7XG5cbnN1YnNjcmliZVRvUmVnaXN0cmF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5HRVRfT1BUSU9OUycsIGZ1bmN0aW9uKG0sIGNiKSB7XG4gICAgcmV0dXJuIGNiKHNjYWxlTWFjaGluZVRlc3REYXRhLmdldEhvc3RPcHRpb25zKCkpO1xuICB9KTtcbiAgUHViU3ViLnN1YnNjcmliZSgnUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICByZXR1cm4gYm94ZXMucHVzaChib3gpO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1VOUkVHSVNURVInLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgYm94KSB7XG4gICAgICByZXR1cm4gcmVtb3ZlQm94KGJveCk7XG4gICAgfTtcbiAgfSkodGhpcykpO1xufTtcblxud2luZG93LnNldFN0YXRlID0gZnVuY3Rpb24oaWQsIHN0YXRlKSB7XG4gIHJldHVybiBnZXRCb3goaWQpLnNldFN0YXRlKHN0YXRlKTtcbn07XG5cbmFkZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuQVBQX0NPTVBPTkVOVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgcmV0dXJuIGdldEJveChkYXRhLmlkKS5zd2l0Y2hTdWJDb250ZW50KCdhcHAtY29tcG9uZW50cycsIGRhdGEuZWwpO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5QTEFURk9STV9DT01QT05FTlRTJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgncGxhdGZvcm0tY29tcG9uZW50cycsIGRhdGEuZWwpO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5JTlNUQU5DRVMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TQ0FMRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3NjYWxlLW1hY2hpbmUnLCBkYXRhLmVsKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ1NIT1cuU1RBVFMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgcmV0dXJuIGdldEJveChkYXRhLmlkKS5zd2l0Y2hTdWJDb250ZW50KCdzdGF0cycsIGRhdGEuZWwpO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5DT05TT0xFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnY29uc29sZScsIGRhdGEuZWwpO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU0hPVy5TUExJVCcsIChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICByZXR1cm4gZ2V0Qm94KGRhdGEuaWQpLnN3aXRjaFN1YkNvbnRlbnQoJ3NwbGl0JywgZGF0YS5lbCk7XG4gICAgfTtcbiAgfSkodGhpcykpO1xuICBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XLkFETUlOJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHJldHVybiBnZXRCb3goZGF0YS5pZCkuc3dpdGNoU3ViQ29udGVudCgnYWRtaW4nLCBkYXRhLmVsKTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG4gIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTSE9XJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHt9O1xuICB9KSh0aGlzKSk7XG59O1xuXG5nZXRCb3ggPSBmdW5jdGlvbihrZXkpIHtcbiAgdmFyIGJveCwgaiwgbGVuO1xuICBmb3IgKGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgIGJveCA9IGJveGVzW2pdO1xuICAgIGlmIChrZXkgPT09IGJveC5pZCkge1xuICAgICAgcmV0dXJuIGJveDtcbiAgICB9XG4gIH1cbn07XG5cbnJlbW92ZUJveCA9IGZ1bmN0aW9uKGRvb21lZEJveCkge1xuICB2YXIgYm94LCBpLCBqLCBsZW47XG4gIGZvciAoaSA9IGogPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICBib3ggPSBib3hlc1tpXTtcbiAgICBpZiAoYm94LmlkID09PSBkb29tZWRCb3guaWQpIHtcbiAgICAgIGJveGVzLnNwbGljZShpLCAxKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn07XG4iXX0=
