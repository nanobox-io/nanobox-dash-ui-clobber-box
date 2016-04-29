(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TestData;

module.exports = TestData = (function() {
  TestData.prototype.services = ["web1", "db1", "cache1", "worker1", "storage1"];

  TestData.prototype.internals = ["platform", "system"];

  function TestData() {
    this.createFakeStatDataProvider();
  }

  TestData.prototype.createFakeStatDataProvider = function() {
    PubSub.subscribe('STATS.SUBSCRIBE.USAGE_BREAKDOWN', (function(_this) {
      return function(m, data) {
        return usageBreakdownDataSimulator.waitForData(data);
      };
    })(this));
    return PubSub.subscribe('STATS.UNSUBSCRIBE', (function(_this) {
      return function(m, data) {};
    })(this));
  };

  TestData.prototype.waitForData = function(data) {
    data.callback(usageBreakdownDataSimulator.generateUsageBreakdownNoData());
    return setInterval(function() {
      return data.callback(usageBreakdownDataSimulator.generateUsageBreakdownData());
    }, 5000);
  };

  TestData.prototype.generateUsageBreakdownNoData = function() {
    var data, i, j, len, len1, ref, ref1, service;
    data = [];
    ref = this.services;
    for (i = 0, len = ref.length; i < len; i++) {
      service = ref[i];
      data.push({
        type: "service",
        name: service,
        metrics: {
          ram: 0,
          cpu: 0
        }
      });
    }
    ref1 = this.internals;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      service = ref1[j];
      data.push({
        type: "internal",
        name: service,
        metrics: {
          ram: 0,
          cpu: 0
        }
      });
    }
    return data;
  };

  TestData.prototype.generateUsageBreakdownData = function() {
    var data, i, j, len, len1, n, ref, ref1, service;
    data = [];
    n = 1 / (this.services.length + this.internals.length + 1);
    ref = this.services;
    for (i = 0, len = ref.length; i < len; i++) {
      service = ref[i];
      data.push({
        type: "service",
        name: service,
        metrics: {
          ram: (Math.random() * n) + 0.05,
          cpu: (Math.random() * n) + 0.05
        }
      });
    }
    ref1 = this.internals;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      service = ref1[j];
      data.push({
        type: "internal",
        name: service,
        metrics: {
          ram: (Math.random() * n) + 0.05,
          cpu: (Math.random() * n) + 0.05
        }
      });
    }
    return data;
  };

  return TestData;

})();

},{}],2:[function(require,module,exports){
var TestData;

TestData = require('./shim/test-data');

window.usageBreakdownDataSimulator = new TestData();

window.init = function() {
  var usage;
  usage = new nanobox.UsageBreakdown($("body"));
  return usage.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdERhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIFRlc3REYXRhLnByb3RvdHlwZS5zZXJ2aWNlcyA9IFtcIndlYjFcIiwgXCJkYjFcIiwgXCJjYWNoZTFcIiwgXCJ3b3JrZXIxXCIsIFwic3RvcmFnZTFcIl07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmludGVybmFscyA9IFtcInBsYXRmb3JtXCIsIFwic3lzdGVtXCJdO1xuXG4gIGZ1bmN0aW9uIFRlc3REYXRhKCkge1xuICAgIHRoaXMuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgfVxuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5VU0FHRV9CUkVBS0RPV04nLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB1c2FnZUJyZWFrZG93bkRhdGFTaW11bGF0b3Iud2FpdEZvckRhdGEoZGF0YSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuVU5TVUJTQ1JJQkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLndhaXRGb3JEYXRhID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGRhdGEuY2FsbGJhY2sodXNhZ2VCcmVha2Rvd25EYXRhU2ltdWxhdG9yLmdlbmVyYXRlVXNhZ2VCcmVha2Rvd25Ob0RhdGEoKSk7XG4gICAgcmV0dXJuIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRhdGEuY2FsbGJhY2sodXNhZ2VCcmVha2Rvd25EYXRhU2ltdWxhdG9yLmdlbmVyYXRlVXNhZ2VCcmVha2Rvd25EYXRhKCkpO1xuICAgIH0sIDUwMDApO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZVVzYWdlQnJlYWtkb3duTm9EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEsIGksIGosIGxlbiwgbGVuMSwgcmVmLCByZWYxLCBzZXJ2aWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICByZWYgPSB0aGlzLnNlcnZpY2VzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VydmljZSA9IHJlZltpXTtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHR5cGU6IFwic2VydmljZVwiLFxuICAgICAgICBuYW1lOiBzZXJ2aWNlLFxuICAgICAgICBtZXRyaWNzOiB7XG4gICAgICAgICAgcmFtOiAwLFxuICAgICAgICAgIGNwdTogMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVmMSA9IHRoaXMuaW50ZXJuYWxzO1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgc2VydmljZSA9IHJlZjFbal07XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0eXBlOiBcImludGVybmFsXCIsXG4gICAgICAgIG5hbWU6IHNlcnZpY2UsXG4gICAgICAgIG1ldHJpY3M6IHtcbiAgICAgICAgICByYW06IDAsXG4gICAgICAgICAgY3B1OiAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVVc2FnZUJyZWFrZG93bkRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YSwgaSwgaiwgbGVuLCBsZW4xLCBuLCByZWYsIHJlZjEsIHNlcnZpY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIG4gPSAxIC8gKHRoaXMuc2VydmljZXMubGVuZ3RoICsgdGhpcy5pbnRlcm5hbHMubGVuZ3RoICsgMSk7XG4gICAgcmVmID0gdGhpcy5zZXJ2aWNlcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlcnZpY2UgPSByZWZbaV07XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0eXBlOiBcInNlcnZpY2VcIixcbiAgICAgICAgbmFtZTogc2VydmljZSxcbiAgICAgICAgbWV0cmljczoge1xuICAgICAgICAgIHJhbTogKE1hdGgucmFuZG9tKCkgKiBuKSArIDAuMDUsXG4gICAgICAgICAgY3B1OiAoTWF0aC5yYW5kb20oKSAqIG4pICsgMC4wNVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVmMSA9IHRoaXMuaW50ZXJuYWxzO1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgc2VydmljZSA9IHJlZjFbal07XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0eXBlOiBcImludGVybmFsXCIsXG4gICAgICAgIG5hbWU6IHNlcnZpY2UsXG4gICAgICAgIG1ldHJpY3M6IHtcbiAgICAgICAgICByYW06IChNYXRoLnJhbmRvbSgpICogbikgKyAwLjA1LFxuICAgICAgICAgIGNwdTogKE1hdGgucmFuZG9tKCkgKiBuKSArIDAuMDVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBUZXN0RGF0YTtcblxufSkoKTtcbiIsInZhciBUZXN0RGF0YTtcblxuVGVzdERhdGEgPSByZXF1aXJlKCcuL3NoaW0vdGVzdC1kYXRhJyk7XG5cbndpbmRvdy51c2FnZUJyZWFrZG93bkRhdGFTaW11bGF0b3IgPSBuZXcgVGVzdERhdGEoKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHVzYWdlO1xuICB1c2FnZSA9IG5ldyBuYW5vYm94LlVzYWdlQnJlYWtkb3duKCQoXCJib2R5XCIpKTtcbiAgcmV0dXJuIHVzYWdlLmJ1aWxkKCk7XG59O1xuIl19
