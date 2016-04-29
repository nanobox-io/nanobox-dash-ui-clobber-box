(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BoxNav, boxNav;

boxNav = require('jade/box-nav');

module.exports = BoxNav = (function() {
  function BoxNav($el, navItems, id) {
    var $node;
    this.id = id;
    $node = $(boxNav({
      nav: navItems
    }));
    $el.append($node);
    $(".nav-item", $node).on("click", (function(_this) {
      return function(e) {
        return _this.onClick(e.currentTarget.getAttribute("data-event"), e.currentTarget);
      };
    })(this));
  }

  BoxNav.prototype.onClick = function(event, el) {
    return PubSub.publish(event, {
      id: this.id,
      el: el
    });
  };

  return BoxNav;

})();

},{"jade/box-nav":20}],2:[function(require,module,exports){
var AdminManager, AppComponents, Box, ConsoleManager, LineAnimator, PlatformComponents, ScaleManager, SplitManager, StatsManager,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

StatsManager = require('managers/stats-manager');

ConsoleManager = require('managers/console-manager');

PlatformComponents = require('managers/platform-components');

AppComponents = require('managers/app-components');

ScaleManager = require('managers/scale-manager');

AdminManager = require('managers/admin-manager');

SplitManager = require('managers/split-manager');

LineAnimator = require('misc/line-animator');

module.exports = Box = (function() {
  function Box($node, data1) {
    this.$node = $node;
    this.data = data1;
    this.closeSubContent = bind(this.closeSubContent, this);
    this.resizeSubContent = bind(this.resizeSubContent, this);
    this.hideCurrentSubContent = bind(this.hideCurrentSubContent, this);
    Eventify.extend(this);
    this.id = this.data.id;
    castShadows(this.$node);
    this.$subContent = $(".sub-content", this.$node);
    this.$sub = $(".sub", this.$node);
    this.fadeOutDuration = 300;
    this.animateDuration = 250;
    this.setState(this.data.state);
  }

  Box.prototype.addAppComponent = function() {
    return console.log("This is not a host, and cannot add app components");
  };

  Box.prototype.hasComponentWithId = function() {
    return false;
  };

  Box.prototype.hasGenerationWithId = function() {
    return false;
  };

  Box.prototype.switchSubContent = function(newSubState, clickedNavBtn) {
    this.clickedNavBtn = clickedNavBtn;
    if (this.subState === newSubState) {
      this.closeSubContent();
      return;
    }
    this.subState = newSubState;
    window.sub = this.$subContent[0];
    return this.hideCurrentSubContent((function(_this) {
      return function() {
        switch (_this.subState) {
          case 'stats':
            _this.subManager = new StatsManager(_this.$subContent, _this.kind);
            break;
          case 'console':
            _this.subManager = new ConsoleManager(_this.$subContent, _this.kind);
            break;
          case 'platform-components':
            _this.subManager = new PlatformComponents(_this.$subContent, _this.data.platformComponents, _this.hideCurrentSubContent, _this.resizeSubContent);
            break;
          case 'scale-machine':
            _this.subManager = new ScaleManager(_this.$subContent, _this.data.serverSpecsId, _this.totalMembers);
            break;
          case 'app-components':
            _this.subManager = new AppComponents(_this.$subContent, _this.data.appComponents, _this.resizeSubContent);
            break;
          case 'admin':
            _this.subManager = new AdminManager(_this.$subContent, _this.data.appComponents, _this.resizeSubContent);
            break;
          case 'split':
            _this.subManager = new SplitManager(_this.$subContent, _this.componentData.scalesHoriz, _this.closeSubContent);
        }
        _this.positionArrow(_this.clickedNavBtn, _this.subState);
        return _this.resizeSubContent(_this.subState);
      };
    })(this));
  };

  Box.prototype.hasGenerationWithId = function(id) {
    var componentData, generation, i, j, len, len1, ref, ref1;
    ref = this.data.appComponents;
    for (i = 0, len = ref.length; i < len; i++) {
      componentData = ref[i];
      ref1 = componentData.generations;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        generation = ref1[j];
        if (generation.id === id) {
          return true;
        }
      }
    }
    return false;
  };

  Box.prototype.setGenerationState = function(id, state) {
    var componentData, generation, i, len, ref, results;
    ref = this.data.appComponents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      componentData = ref[i];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = componentData.generations;
        results1 = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          generation = ref1[j];
          if (id === generation.id) {
            generation.state = state;
            if (this.subState === 'app-components') {
              results1.push(this.subManager.updateGenerationState(id, state));
            } else {
              results1.push(void 0);
            }
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Box.prototype.hideCurrentSubContent = function(cb, doDestroyCurrentContent, doCallResizeBeforeCb) {
    var me;
    if (doDestroyCurrentContent == null) {
      doDestroyCurrentContent = true;
    }
    if (doCallResizeBeforeCb == null) {
      doCallResizeBeforeCb = false;
    }
    this.setHeightToContent();
    if (this.subManager == null) {
      cb();
      return;
    }
    me = this;
    this.$subContent.css({
      opacity: 0
    });
    return setTimeout(function() {
      if (doDestroyCurrentContent) {
        me.destroySubItem();
      }
      if (doCallResizeBeforeCb) {
        return me.resizeSubContent(null, cb);
      } else {
        return cb();
      }
    }, this.fadeOutDuration);
  };

  Box.prototype.resizeSubContent = function(cssClass, cb) {
    PubSub.publish('SCROLL_TO', this.$node);
    if (cssClass != null) {
      this.$subContent.addClass(cssClass);
    }
    this.setHeightToContent();
    this.$sub.addClass("has-content");
    setTimeout((function(_this) {
      return function() {
        _this.$sub.css({
          height: 'initial'
        });
        _this.$subContent.css({
          opacity: 1
        });
        if (cb != null) {
          return cb();
        }
      };
    })(this), this.animateDuration);
    return this.fire("resize", this);
  };

  Box.prototype.closeSubContent = function() {
    this.setHeightToContent();
    this.$subContent.css({
      opacity: 0
    });
    this.$sub.removeClass("has-content");
    setTimeout((function(_this) {
      return function() {
        _this.subState = "";
        return _this.destroySubItem();
      };
    })(this), this.animateDuration);
    return setTimeout((function(_this) {
      return function() {
        return _this.$sub.css({
          height: 0
        });
      };
    })(this), 20);
  };

  Box.prototype.destroySubItem = function() {
    if (this.subManager == null) {
      return;
    }
    this.subManager.destroy();
    this.$subContent.empty();
    this.$subContent.attr('class', "sub-content");
    return this.subManager = null;
  };

  Box.prototype.removeSubContentAnimations = function() {
    return this.$sub.addClass("no-transition");
  };

  Box.prototype.setState = function(state, status, messageCode) {
    if (state === this.state) {
      return;
    }
    this.state = state;
    switch (this.state) {
      case 'created':
      case 'initialized':
      case 'ordered':
      case 'provisioning':
      case 'defunct':
        return this.animatingState('build', this.getStateMessage(this.state));
      case 'active':
        return this.activeState();
      case 'decomissioning':
        return this.animatingState('destroy', this.getStateMessage(this.state));
      case 'archived':
        return this.destroy();
    }
  };

  Box.prototype.animatingState = function(animationKind, message) {
    if (this.animationKind === animationKind) {
      $('.animation .title', this.$node).text(message);
    } else {
      this.animationKind = animationKind;
      this.closeSubContent();
      return this.fadeOutMainContent((function(_this) {
        return function() {
          var xtra;
          xtra = _this.$node.is(':last-child') ? 15 : 0;
          _this.$node.css({
            height: _this.$node.height() + xtra
          });
          _this.destroyAnyAnimation();
          $('.animation .title', _this.$node).text(message);
          _this.lineAnimation = new LineAnimator($('.animation .svg-holder', _this.$node), _this.kind, _this.animationKind);
          return _this.setStateClassAndFadeIn('animating');
        };
      })(this));
    }
  };

  Box.prototype.activeState = function() {
    this.animationKind = null;
    return this.fadeOutMainContent((function(_this) {
      return function() {
        _this.$node.css({
          height: "initial"
        });
        _this.destroyAnyAnimation();
        return _this.setStateClassAndFadeIn('active');
      };
    })(this));
  };

  Box.prototype.erroredState = function() {
    return this.switchMainViewState('errored');
  };

  Box.prototype.setStateClassAndFadeIn = function(cssClass) {
    this.hasContent = true;
    this.$node.removeClass('building active errored animating');
    this.$node.addClass(cssClass);
    return $(".main-content", this.$node).css({
      opacity: 1
    });
  };

  Box.prototype.destroyAnyAnimation = function() {
    if (this.lineAnimation != null) {
      this.lineAnimation.destroy();
      return this.lineAnimation = null;
    }
  };

  Box.prototype.fadeOutMainContent = function(cb) {
    if (!this.hasContent) {
      cb();
      return;
    }
    $(".main-content", this.$node).css({
      opacity: 0
    });
    return setTimeout(function() {
      return cb();
    }, 250);
  };

  Box.prototype.setHeightToContent = function() {
    return this.$sub.css({
      height: this.$subContent[0].offsetHeight
    });
  };

  Box.prototype.positionArrow = function(el, cssClass) {
    var $arrowPointer, $el;
    $el = $(el);
    $arrowPointer = $("<div class='arrow-pointer'/>");
    this.$subContent.append($arrowPointer);
    $arrowPointer.css({
      left: $el.offset().left + $(".text", el).width() / 2 - 1
    });
    if (cssClass != null) {
      return $arrowPointer.addClass(cssClass);
    }
  };

  Box.prototype.getStateMessage = function(state) {
    switch (state) {
      case 'created':
        return this.id + " : Creating";
      case 'initialized':
        return this.id + " : Initializing";
      case 'ordered':
        return this.id + " : Ordering";
      case 'provisioning':
        return this.id + " : Provisioning";
      case 'defunct':
        return this.id + " : Defunct";
      case 'decomissioning':
        return this.id + " : Decomissioning";
    }
  };

  Box.prototype.buildStats = function($el) {
    var statTypes;
    this.stats = new nanobox.HourlyStats('standard', $el);
    statTypes = [
      {
        id: "cpu_used",
        nickname: "CPU",
        name: "CPU Used"
      }, {
        id: "ram_used",
        nickname: "RAM",
        name: "RAM Used"
      }, {
        id: "swap_used",
        nickname: "SWAP",
        name: "Swap Used"
      }, {
        id: "disk_used",
        nickname: "DISK",
        name: "Disk Used"
      }
    ];
    return this.stats.build();
  };

  Box.prototype.updateLiveStats = function(data) {
    return this.stats.updateLiveStats(data);
  };

  Box.prototype.updateHistoricStats = function(data) {
    return this.stats.updateHistoricStats(data);
  };

  Box.prototype.destroy = function() {
    var me;
    this.$node.css({
      height: this.$node.height()
    });
    me = this;
    this.$node.addClass('faded');
    setTimeout(function() {
      return me.$node.addClass('archived');
    }, 300);
    return setTimeout((function(_this) {
      return function() {
        return _this.$node.remove();
      };
    })(this), 750);
  };

  return Box;

})();

},{"managers/admin-manager":8,"managers/app-components":9,"managers/console-manager":10,"managers/platform-components":12,"managers/scale-manager":13,"managers/split-manager":14,"managers/stats-manager":15,"misc/line-animator":16}],3:[function(require,module,exports){
var Box, BoxNav, ClusterBox, clusterBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = require('boxes/box');

BoxNav = require('box-nav');

clusterBox = require('jade/cluster-box');

module.exports = ClusterBox = (function(superClass) {
  extend(ClusterBox, superClass);

  function ClusterBox($el, data) {
    var $node;
    this.data = data;
    this.kind = "cluster";
    this.data.clusterName = this.makeClusterName(this.data.instances);
    this.totalMembers = this.data.totalMembers = this.data.instances.length;
    $node = $(clusterBox(this.data));
    $el.append($node);
    this.buildNav($node);
    ClusterBox.__super__.constructor.call(this, $node, this.data);
    PubSub.publish('REGISTER.CLUSTER', this);
    this.buildStats($(".stats", $node));
  }

  ClusterBox.prototype.buildNav = function($node) {
    var navItems;
    navItems = [
      {
        txt: "App Component",
        icon: 'app-component',
        event: 'SHOW.APP_COMPONENTS'
      }, {
        txt: "Scale",
        icon: 'scale',
        event: 'SHOW.SCALE'
      }, {
        txt: "Stats",
        icon: 'stats',
        event: 'SHOW.STATS'
      }
    ];
    return this.nav = new BoxNav($('.nav-holder', $node), navItems, this.data.id);
  };

  ClusterBox.prototype.makeClusterName = function(instances) {
    return instances[0].hostName + " - " + instances[instances.length - 1].hostName;
  };

  ClusterBox.prototype.destroy = function() {
    PubSub.publish('UNREGISTER.CLUSTER', this);
    return ClusterBox.__super__.destroy.call(this);
  };

  return ClusterBox;

})(Box);

},{"box-nav":1,"boxes/box":2,"jade/cluster-box":21}],4:[function(require,module,exports){
var Box, BoxNav, ComponentGenerationBox, componentBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = require('boxes/box');

BoxNav = require('box-nav');

componentBox = require('jade/component-box');

module.exports = ComponentGenerationBox = (function(superClass) {
  extend(ComponentGenerationBox, superClass);

  function ComponentGenerationBox($el, data) {
    var $node, compiledData;
    this.kind = "component";
    this.componentData = data.componentData;
    this.generationData = data.generationData;
    this.data = this.componentData;
    compiledData = {
      id: this.generationData.id,
      state: this.generationData.state
    };
    $node = $(componentBox(this.componentData));
    $el.append($node);
    this.buildAppComponentNav($node);
    PubSub.publish('REGISTER.APP_COMPONENT', this);
    ComponentGenerationBox.__super__.constructor.call(this, $node, compiledData);
    this.buildStats($(".stats", $node));
  }

  ComponentGenerationBox.prototype.buildAppComponentNav = function($node) {
    var navItems;
    navItems = [
      {
        txt: "Console",
        icon: 'console',
        event: 'SHOW.CONSOLE'
      }, {
        txt: "Split",
        icon: 'split',
        event: 'SHOW.SPLIT'
      }, {
        txt: "Admin",
        icon: 'admin',
        event: 'SHOW.ADMIN'
      }, {
        txt: "Stats",
        icon: 'stats',
        event: 'SHOW.STATS'
      }
    ];
    return this.nav = new BoxNav($('.nav-holder', $node), navItems, this.generationData.id);
  };

  ComponentGenerationBox.prototype.destroy = function() {
    PubSub.publish('UNREGISTER.APP_COMPONENT', this);
    return ComponentGenerationBox.__super__.destroy.call(this);
  };

  return ComponentGenerationBox;

})(Box);

},{"box-nav":1,"boxes/box":2,"jade/component-box":22}],5:[function(require,module,exports){
var Box, BoxNav, HostBox, hostBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = require('boxes/box');

BoxNav = require('box-nav');

hostBox = require('jade/host-box');

module.exports = HostBox = (function(superClass) {
  extend(HostBox, superClass);

  function HostBox($el, data) {
    this.data = data;
    this.kind = "host";
    this.$node = $(hostBox(this.data));
    $el.append(this.$node);
    this.buildNav(this.$node);
    HostBox.__super__.constructor.call(this, this.$node, this.data);
    PubSub.publish('REGISTER.HOST', this);
    this.buildStats($(".stats", this.$node));
  }

  HostBox.prototype.buildNav = function($node) {
    var navItems;
    navItems = [
      {
        txt: "Platform Components",
        icon: 'platform-component',
        event: 'SHOW.PLATFORM_COMPONENTS'
      }, {
        txt: "App Components",
        icon: 'app-component',
        event: 'SHOW.APP_COMPONENTS'
      }, {
        txt: "Scale",
        icon: 'scale',
        event: 'SHOW.SCALE'
      }, {
        txt: "Stats",
        icon: 'stats',
        event: 'SHOW.STATS'
      }
    ];
    return this.nav = new BoxNav($('.nav-holder', $node), navItems, this.data.id);
  };

  HostBox.prototype.addComponent = function(componentData) {
    this.data.appComponents.push(componentData);
    if (this.subState === 'app-components') {
      return this.subManager.addComponent(componentData);
    }
  };

  HostBox.prototype.addGeneration = function(componentId, generationData) {
    var componentData, i, len, ref, results;
    ref = this.data.appComponents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      componentData = ref[i];
      if (componentData.id === componentId) {
        componentData.generations.push(generationData);
        if (this.subState === 'app-components') {
          results.push(this.subManager.addGeneration(componentData, generationData));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  HostBox.prototype.setGenerationState = function(id, state) {
    var componentData, generation, i, len, ref, results;
    ref = this.data.appComponents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      componentData = ref[i];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = componentData.generations;
        results1 = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          generation = ref1[j];
          if (id === generation.id) {
            generation.state = state;
            if (this.subState === 'app-components') {
              results1.push(this.subManager.updateGenerationState(id, state));
            } else {
              results1.push(void 0);
            }
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  HostBox.prototype.hasGenerationWithId = function(id) {
    var componentData, generation, i, j, len, len1, ref, ref1;
    ref = this.data.appComponents;
    for (i = 0, len = ref.length; i < len; i++) {
      componentData = ref[i];
      ref1 = componentData.generations;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        generation = ref1[j];
        if (generation.id === id) {
          return true;
        }
      }
    }
    return false;
  };

  HostBox.prototype.hasComponentWithId = function(id) {
    var componentData, i, len, ref;
    ref = this.data.appComponents;
    for (i = 0, len = ref.length; i < len; i++) {
      componentData = ref[i];
      if (componentData.id === id) {
        return true;
      }
    }
    return false;
  };

  HostBox.prototype.destroy = function() {
    PubSub.publish('UNREGISTER.HOST', this);
    return HostBox.__super__.destroy.call(this);
  };

  return HostBox;

})(Box);

},{"box-nav":1,"boxes/box":2,"jade/host-box":23}],6:[function(require,module,exports){
var Box, BoxNav, PlatformComponentBox, componentBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = require('boxes/box');

BoxNav = require('box-nav');

componentBox = require('jade/component-box');

module.exports = PlatformComponentBox = (function(superClass) {
  extend(PlatformComponentBox, superClass);

  function PlatformComponentBox($el, data) {
    var $node;
    this.data = data;
    this.kind = "component";
    $node = $(componentBox(this.data));
    $el.append($node);
    this.buildPlatformComponentNav($node);
    PubSub.publish('REGISTER.PLATFORM_COMPONENT', this);
    PlatformComponentBox.__super__.constructor.call(this, $node, this.data);
    this.buildStats($(".stats", $node));
  }

  PlatformComponentBox.prototype.buildPlatformComponentNav = function($node) {
    var navItems;
    navItems = [
      {
        txt: "Console",
        icon: 'console',
        event: 'SHOW.CONSOLE'
      }, {
        txt: "Stats",
        icon: 'stats',
        event: 'SHOW.STATS'
      }
    ];
    return this.nav = new BoxNav($('.nav-holder', $node), navItems, this.data.id);
  };

  PlatformComponentBox.prototype.destroy = function() {
    PubSub.publish('UNREGISTER.PLATFORM_COMPONENT', this);
    return PlatformComponentBox.__super__.destroy.call(this);
  };

  return PlatformComponentBox;

})(Box);

},{"box-nav":1,"boxes/box":2,"jade/component-box":22}],7:[function(require,module,exports){
var ClobberBox, ClusterBox, ComponentGenerationBox, HostBox, PlatformComponent, WindowScroller;

HostBox = require('boxes/host-box');

ClusterBox = require('boxes/cluster-box');

ComponentGenerationBox = require('boxes/component-generation-box');

PlatformComponent = require('boxes/platform-component-box');

WindowScroller = require('misc/window-scroller');

ClobberBox = (function() {
  function ClobberBox() {
    new WindowScroller();
  }

  ClobberBox.prototype.build = function($el, kind, data) {
    this.data = data;
    switch (kind) {
      case ClobberBox.HOST:
        this.box = new HostBox($el, this.data);
        break;
      case ClobberBox.CLUSTER:
        this.box = new ClusterBox($el, this.data);
        break;
      case ClobberBox.APP_COMPONENT_GENERATION:
        this.box = new ComponentGenerationBox($el, this.data);
        break;
      case ClobberBox.PLATFORM_COMPONENT:
        this.box = new PlatformComponent($el, this.data);
    }
    return this.stats = this.box.stats;
  };

  ClobberBox.prototype.setState = function(state) {
    return this.box.setState(state);
  };

  ClobberBox.prototype.dontAnimateTransition = function() {
    return this.box.removeSubContentAnimations();
  };

  ClobberBox.prototype.destroy = function() {
    return this.box.destroy();
  };

  ClobberBox.CLUSTER = 'cluster';

  ClobberBox.HOST = 'host';

  ClobberBox.PLATFORM_COMPONENT = 'platform-component';

  ClobberBox.APP_COMPONENT_GENERATION = 'app-component-generation';

  return ClobberBox;

})();

window.nanobox || (window.nanobox = {});

nanobox.ClobberBox = ClobberBox;

},{"boxes/cluster-box":3,"boxes/component-generation-box":4,"boxes/host-box":5,"boxes/platform-component-box":6,"misc/window-scroller":17}],8:[function(require,module,exports){
var AdminManager, Manager, admin,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

admin = require('jade/admin');

module.exports = AdminManager = (function(superClass) {
  extend(AdminManager, superClass);

  function AdminManager($el) {
    var $node;
    $node = $(admin({}));
    $el.append($node);
    castShadows(this.$node);
    AdminManager.__super__.constructor.call(this);
  }

  return AdminManager;

})(Manager);

},{"jade/admin":19,"managers/manager":11}],9:[function(require,module,exports){
var AppComponents, Manager,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

module.exports = AppComponents = (function(superClass) {
  extend(AppComponents, superClass);

  function AppComponents($el, components, resizeCb) {
    var componentData, i, len;
    this.$el = $el;
    this.resizeCb = resizeCb;
    AppComponents.__super__.constructor.call(this);
    this.generations = [];
    for (i = 0, len = components.length; i < len; i++) {
      componentData = components[i];
      this.addComponent(componentData);
    }
  }

  AppComponents.prototype.addComponent = function(componentData) {
    var generationData, i, len, ref, results;
    ref = componentData.generations;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      generationData = ref[i];
      if (generationData.state !== "archived") {
        results.push(this.addGeneration(componentData, generationData));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  AppComponents.prototype.addGeneration = function(componentData, generationData) {
    var generation;
    generation = new nanobox.ClobberBox();
    generation.build(this.$el, nanobox.ClobberBox.APP_COMPONENT_GENERATION, {
      componentData: componentData,
      generationData: generationData
    });
    return this.generations.push(generation);
  };

  AppComponents.prototype.updateGenerationState = function(id, state) {
    var generation, i, len, ref, results;
    ref = this.generations;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      generation = ref[i];
      if (id === generation.box.id) {
        results.push(generation.box.setState(state));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  AppComponents.prototype.destroy = function() {
    var generation, i, len, ref;
    ref = this.generations;
    for (i = 0, len = ref.length; i < len; i++) {
      generation = ref[i];
      generation.box.off();
      generation.destroy();
    }
    return AppComponents.__super__.destroy.call(this);
  };

  return AppComponents;

})(Manager);

},{"managers/manager":11}],10:[function(require,module,exports){
var ConsoleManager, Manager,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

module.exports = ConsoleManager = (function(superClass) {
  extend(ConsoleManager, superClass);

  function ConsoleManager($el) {
    var app;
    ConsoleManager.__super__.constructor.call(this);
    app = new nanobox.Console($el);
  }

  return ConsoleManager;

})(Manager);

},{"managers/manager":11}],11:[function(require,module,exports){
var Manager;

module.exports = Manager = (function() {
  function Manager() {}

  Manager.prototype.destroy = function() {};

  return Manager;

})();

},{}],12:[function(require,module,exports){
var Manager, PlatformComponents,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

module.exports = PlatformComponents = (function(superClass) {
  extend(PlatformComponents, superClass);

  function PlatformComponents($el, platformComponents, fadeParentMethod, resizeCb) {
    this.fadeParentMethod = fadeParentMethod;
    this.resizeCb = resizeCb;
    this.resetView = bind(this.resetView, this);
    this.showComponentAdmin = bind(this.showComponentAdmin, this);
    PlatformComponents.__super__.constructor.call(this);
    this.createComponents($el, platformComponents);
  }

  PlatformComponents.prototype.createComponents = function($el, platformComponents) {
    var component, componentData, i, len, results;
    this.components = [];
    results = [];
    for (i = 0, len = platformComponents.length; i < len; i++) {
      componentData = platformComponents[i];
      component = new nanobox.PlatformComponent($el, componentData.kind, componentData.id);
      component.setState("mini");
      component.on("show-admin", this.showComponentAdmin);
      component.on("close-detail-view", this.resetView);
      results.push(this.components.push(component));
    }
    return results;
  };

  PlatformComponents.prototype.showComponentAdmin = function(e, id) {
    if (this.components == null) {
      return;
    }
    return this.fadeParentMethod((function(_this) {
      return function() {
        var component, i, len, ref;
        ref = _this.components;
        for (i = 0, len = ref.length; i < len; i++) {
          component = ref[i];
          if (id === component.componentId) {
            component.setState("full");
          } else {
            component.setState("hidden");
          }
        }
        return _this.resizeCb();
      };
    })(this), false, false);
  };

  PlatformComponents.prototype.resetView = function() {
    if (this.components == null) {
      return;
    }
    return this.fadeParentMethod((function(_this) {
      return function() {
        var component, i, len, ref, results;
        ref = _this.components;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          component = ref[i];
          component.setState("mini");
          results.push(_this.resizeCb());
        }
        return results;
      };
    })(this), false, false);
  };

  PlatformComponents.prototype.destroy = function() {
    var component, i, len, ref;
    ref = this.components;
    for (i = 0, len = ref.length; i < len; i++) {
      component = ref[i];
      component.destroy();
    }
    PlatformComponents.__super__.destroy.call(this);
    return this.components = null;
  };

  return PlatformComponents;

})(Manager);

},{"managers/manager":11}],13:[function(require,module,exports){
var Manager, Saver, ScaleManager,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

Saver = require('saver');

module.exports = ScaleManager = (function(superClass) {
  extend(ScaleManager, superClass);

  function ScaleManager($el, serverSpecsId, currentTotal) {
    this.$el = $el;
    this.onCancel = bind(this.onCancel, this);
    this.onSave = bind(this.onSave, this);
    this.onInstanceTotalChange = bind(this.onInstanceTotalChange, this);
    this.onSelectionChange = bind(this.onSelectionChange, this);
    if (currentTotal != null) {
      this.scaleMachine = new nanobox.ScaleMachine(this.$el, serverSpecsId, this.onSelectionChange, this.onInstanceTotalChange, currentTotal);
    } else {
      this.scaleMachine = new nanobox.ScaleMachine(this.$el, serverSpecsId, this.onSelectionChange);
    }
    ScaleManager.__super__.constructor.call(this);
  }

  ScaleManager.prototype.showSaver = function($el) {
    var saver;
    this.$el = $el;
    if (this.saveVisible) {
      return;
    }
    this.saveVisible = true;
    return saver = new Saver(this.$el, this.onSave, this.onCancel);
  };

  ScaleManager.prototype.onSelectionChange = function(selection) {
    console.log(selection);
    return this.showSaver(this.$el);
  };

  ScaleManager.prototype.onInstanceTotalChange = function(instances) {
    console.log("" + instances);
    return this.showSaver(this.$el);
  };

  ScaleManager.prototype.onSave = function() {
    return console.log("save it!");
  };

  ScaleManager.prototype.onCancel = function() {
    this.saveVisible = false;
    return console.log("cancel it!");
  };

  return ScaleManager;

})(Manager);

},{"managers/manager":11,"saver":18}],14:[function(require,module,exports){
var Manager, SplitManager, split,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

split = require('jade/split');

module.exports = SplitManager = (function(superClass) {
  extend(SplitManager, superClass);

  function SplitManager($el, isHorizontal, hideCb) {
    var app, bunkHouses;
    this.hideCb = hideCb;
    this.onCancel = bind(this.onCancel, this);
    bunkHouses = [
      {
        id: "a",
        name: "EC2 1",
        current: true
      }, {
        id: "b",
        name: "EC2 2"
      }, {
        id: "c",
        name: "EC2 3"
      }
    ];
    app = new nanobox.Splitter($el, isHorizontal, bunkHouses, this.onSubmit, this.onCancel);
    SplitManager.__super__.constructor.call(this);
  }

  SplitManager.prototype.onSubmit = function() {};

  SplitManager.prototype.onCancel = function() {
    return this.hideCb();
  };

  return SplitManager;

})(Manager);

},{"jade/split":25,"managers/manager":11}],15:[function(require,module,exports){
var Manager, StatsManager, statsWrapper,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Manager = require('managers/manager');

statsWrapper = require('jade/stats-wrapper');

module.exports = StatsManager = (function(superClass) {
  extend(StatsManager, superClass);

  function StatsManager($el, kind) {
    var $breakdown, $hourlyAverage, $hourlyStats, $statsWrapper, expanded, hourly;
    this.kind = kind;
    $statsWrapper = $(statsWrapper({
      kind: this.kind
    }));
    $el.append($statsWrapper);
    $hourlyAverage = $(".hourly-avgs-wrap", $statsWrapper);
    $hourlyStats = $(".hourly-stats-wrap", $statsWrapper);
    $breakdown = $(".breakdown-wrap", $statsWrapper);
    hourly = new nanobox.HourlyAverage($hourlyAverage);
    hourly.build();
    expanded = new nanobox.HourlyStats("expanded", $hourlyStats);
    expanded.build();
  }

  return StatsManager;

})(Manager);

},{"jade/stats-wrapper":26,"managers/manager":11}],16:[function(require,module,exports){
var LineAnimator,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = LineAnimator = (function() {
  function LineAnimator($el, componentKind, animationKind, message) {
    var $svg, svgId;
    this.$el = $el;
    this.destroyTick = bind(this.destroyTick, this);
    this.buildTick = bind(this.buildTick, this);
    this.setCrossPlatform();
    svgId = this.getSvgId(componentKind);
    $svg = $("<img class='shadow-icon' data-src='" + svgId + "' />");
    this.$el.append($svg);
    castShadows(this.$el);
    this.path = $('path', this.$el)[0];
    this.path.style['stroke-dashoffset'] = 3000;
    this.startAnimation(animationKind);
  }

  LineAnimator.prototype.buildTick = function() {
    var i, inc, item, j, len, ref;
    if (this.dashArray[1] > 80) {
      ref = this.dashArray;
      for (i = j = 0, len = ref.length; j < len; i = j += 2) {
        item = ref[i];
        if (this.dashArray[i + 1] > 80) {
          inc = Math.random() / 2;
          this.dashArray[i] += inc;
          this.dashArray[i + 1] -= inc;
        }
      }
    }
    this.path.style['stroke-dasharray'] = this.dashArray;
    this.path.style['stroke-dashoffset'] = this.offset += this.speed;
    return this.tickId = requestAnimationFrame(this.buildTick);
  };

  LineAnimator.prototype.destroyTick = function() {
    var i, inc, item, j, len, ref;
    if (this.dashArray[0] > 11) {
      ref = this.dashArray;
      for (i = j = 0, len = ref.length; j < len; i = j += 2) {
        item = ref[i];
        if (this.dashArray[i + 1] > 80) {
          inc = Math.random() / 3;
          this.dashArray[i] -= inc;
          this.dashArray[i + 1] += inc;
        }
      }
    }
    this.path.style['stroke-dasharray'] = this.dashArray;
    this.path.style['stroke-dashoffset'] = this.offset += this.speed;
    return this.tickId = requestAnimationFrame(this.destroyTick);
  };

  LineAnimator.prototype.destroy = function() {
    cancelAnimationFrame(this.tickId);
    this.path = null;
    return this.$el.empty();
  };

  LineAnimator.prototype.startAnimation = function(animationKind) {
    if (animationKind === 'build') {
      this.dashArray = [2, 800, 2, 600, 2, 400];
      this.path.style['stroke-dasharray'] = this.dashArray;
      this.speed = 8;
      this.offset = 0;
      return this.buildTick();
    } else if (animationKind === 'destroy') {
      this.dashArray = [160, 100];
      this.path.style['stroke-dasharray'] = this.dashArray;
      this.path.style['stroke'] = '#D2D2D2';
      this.speed = 6;
      this.offset = 0;
      return this.destroyTick();
    }
  };

  LineAnimator.prototype.getSvgId = function(componentKind) {
    console.log(componentKind);
    switch (componentKind) {
      case 'host':
      case 'cluster':
        return 'host-silvering';
      case 'component':
        return 'component-silvering';
    }
  };

  LineAnimator.prototype.setCrossPlatform = function() {
    var j, len, ref, results, vendor;
    if (window.crossPlatformAlreadySet) {
      return;
    }
    window.crossPlatformAlreadySet = true;
    ref = ['ms', 'moz', 'webkit', 'o'];
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      vendor = ref[j];
      window.requestAnimationFrame = window.requestAnimationFrame || window[vendor + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window.cancelAnimationFrame || window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
      if (window.requestAnimationFrame != null) {
        break;
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return LineAnimator;

})();

},{}],17:[function(require,module,exports){
var WindowScroller;

module.exports = WindowScroller = (function() {
  function WindowScroller() {
    if (window.__wind_scroller != null) {
      return null;
    }
    window.__wind_scroller = this;
    PubSub.subscribe('SCROLL_TO', (function(_this) {
      return function(m, data) {
        return _this.scrollWindowTo(data, 480, 600, 20);
      };
    })(this));
  }

  WindowScroller.prototype.scrollWindowTo = function($el, delay, duration, topPadding) {
    var top;
    if (delay == null) {
      delay = 0;
    }
    if (duration == null) {
      duration = 500;
    }
    if (topPadding == null) {
      topPadding = 0;
    }
    top = $el.offset().top - topPadding;
    if ($('body').height() - top < top) {
      top = $('body').height() - top;
    }
    if (top !== topPadding) {
      return $('html,body').velocity('scroll', {
        delay: delay,
        duration: duration,
        offset: top,
        easing: 'easeInOutQuint'
      });
    }
  };

  WindowScroller.prototype.scrollWindowtoFutureSize = function($el, delay, duration, topPadding, projectedHeight) {
    var bodyHeight, top, windowHeight;
    if (delay == null) {
      delay = 0;
    }
    if (duration == null) {
      duration = 500;
    }
    if (projectedHeight == null) {
      projectedHeight = 0;
    }
    top = $el.offset().top - topPadding;
    bodyHeight = $('body').height() + projectedHeight;
    windowHeight = $(window).height();
    if (bodyHeight - top < windowHeight) {
      top = bodyHeight - windowHeight;
    }
    if (bodyHeight > windowHeight) {
      return $('html,body').delay(delay).velocity({
        scrollTop: top
      }, {
        duration: duration,
        easing: "easeInOutQuint"
      });
    }
  };

  return WindowScroller;

})();

},{}],18:[function(require,module,exports){
var Saver, saver;

saver = require('jade/saver');

module.exports = Saver = (function() {
  function Saver($el, onSaveCb, onCancelCb) {
    var $node;
    this.onCancelCb = onCancelCb;
    $node = $(saver({}));
    $el.append($node);
    $(".save-btn", $node).on('click', onSaveCb);
    setTimeout(function() {
      return $node.addClass('open');
    }, 200);
  }

  return Saver;

})();

},{"jade/saver":24}],19:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"admin\"><img data-src=\"admin-octopus\" class=\"shadow-icon\"/><div class=\"info\"><div class=\"title\">Admin</div><div class=\"txt\">Connection Credentials, Renaming, etc..</div><a href=\"#\">Admin this Component</a></div></div>");;return buf.join("");
}
},{}],20:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (nav, undefined) {
buf.push("<div class=\"box-nav\">");
// iterate nav
;(function(){
  var $$obj = nav;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var item = $$obj[$index];

buf.push("<div" + (jade.attr("data-event", "" + (item.event) + "", true, false)) + " class=\"nav-item\"><div class=\"icon\"><img" + (jade.attr("data-src", "nav-" + (item.icon) + "", true, false)) + " xtra=\"2\" class=\"shadow-icon\"/></div><div class=\"text\">" + (jade.escape(null == (jade_interp = item.txt) ? "" : jade_interp)) + "</div></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var item = $$obj[$index];

buf.push("<div" + (jade.attr("data-event", "" + (item.event) + "", true, false)) + " class=\"nav-item\"><div class=\"icon\"><img" + (jade.attr("data-src", "nav-" + (item.icon) + "", true, false)) + " xtra=\"2\" class=\"shadow-icon\"/></div><div class=\"text\">" + (jade.escape(null == (jade_interp = item.txt) ? "" : jade_interp)) + "</div></div>");
    }

  }
}).call(this);

buf.push("</div>");}.call(this,"nav" in locals_for_with?locals_for_with.nav:typeof nav!=="undefined"?nav:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}
},{}],21:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (clusterName, serviceType, totalMembers) {
buf.push("<div class=\"box cluster-box\"><div class=\"main-content\"><div class=\"animation\"><div class=\"svg-holder\"></div><div class=\"title\"></div></div><div class=\"white-box\"><div class=\"id\"><div class=\"name\">" + (jade.escape(null == (jade_interp = clusterName) ? "" : jade_interp)) + "</div><div class=\"service-name\">" + (jade.escape(null == (jade_interp = serviceType) ? "" : jade_interp)) + "</div></div><div class=\"component\"><div" + (jade.cls(['service-icon',"" + (serviceType) + ""], [null,true])) + "><img" + (jade.attr("data-src", "hex-" + (serviceType) + "", true, false)) + " scalable=\"true\" xtra=\"2\" class=\"shadow-icon\"/></div><div class=\"total\">" + (jade.escape(null == (jade_interp = totalMembers) ? "" : jade_interp)) + "</div></div><div class=\"stats\"></div></div></div><div class=\"nav-holder\"></div><div class=\"sub\"><div class=\"sub-content\"></div></div></div>");}.call(this,"clusterName" in locals_for_with?locals_for_with.clusterName:typeof clusterName!=="undefined"?clusterName:undefined,"serviceType" in locals_for_with?locals_for_with.serviceType:typeof serviceType!=="undefined"?serviceType:undefined,"totalMembers" in locals_for_with?locals_for_with.totalMembers:typeof totalMembers!=="undefined"?totalMembers:undefined));;return buf.join("");
}
},{}],22:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (name, serviceType) {
buf.push("<div class=\"box component-box\"><div class=\"main-content\"><div class=\"animation\"><div class=\"svg-holder\"></div><div class=\"title\"></div></div><div class=\"white-box\"><div class=\"corner-box\"><img data-src=\"corner-bg\" class=\"shadow-icon\"/></div><div class=\"id\"><div class=\"name\">" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "</div><div class=\"service-name\">" + (jade.escape(null == (jade_interp = serviceType) ? "" : jade_interp)) + "</div></div><div class=\"stats\"></div></div></div><div class=\"service-bug\"> <div class=\"bg-hex\"></div><img" + (jade.attr("data-src", "hex-" + (serviceType) + "", true, false)) + " class=\"shadow-icon\"/></div><div class=\"nav-holder\"></div><div class=\"sub\"><div class=\"sub-content\"></div></div></div>");}.call(this,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"serviceType" in locals_for_with?locals_for_with.serviceType:typeof serviceType!=="undefined"?serviceType:undefined));;return buf.join("");
}
},{}],23:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (appComponents, name, undefined) {
buf.push("<div class=\"box host-box\"><div class=\"main-content\"><div class=\"animation\"><div class=\"svg-holder\"></div><div class=\"title\"></div></div><div class=\"white-box\"><div class=\"name\">" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "</div><div class=\"service-icons\">");
// iterate appComponents
;(function(){
  var $$obj = appComponents;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var service = $$obj[$index];

buf.push("<div" + (jade.cls(['service-icon',"" + (service.serviceType) + ""], [null,true])) + "><img" + (jade.attr("data-src", "hex-" + (service.serviceType) + "", true, false)) + " scalable=\"true\" xtra=\"2\" class=\"shadow-icon\"/></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var service = $$obj[$index];

buf.push("<div" + (jade.cls(['service-icon',"" + (service.serviceType) + ""], [null,true])) + "><img" + (jade.attr("data-src", "hex-" + (service.serviceType) + "", true, false)) + " scalable=\"true\" xtra=\"2\" class=\"shadow-icon\"/></div>");
    }

  }
}).call(this);

buf.push("</div><div class=\"stats\"></div></div></div><div class=\"nav-holder\"></div><div class=\"sub\"><div class=\"sub-content\"></div></div></div>");}.call(this,"appComponents" in locals_for_with?locals_for_with.appComponents:typeof appComponents!=="undefined"?appComponents:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}
},{}],24:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"saver\"><div class=\"save-btn\">Save</div></div>");;return buf.join("");
}
},{}],25:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"split-holder\"><div class=\"temp\">The process of splitting a component onto a different host will go here.</div></div>");;return buf.join("");
}
},{}],26:[function(require,module,exports){
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (kind) {
buf.push("<div class=\"stats-wrapper\"><div class=\"hourly\"><div class=\"hourly-avgs-wrap\"></div><div class=\"hourly-stats-wrap\"></div></div>");
if ( kind == "host")
{
buf.push("<div class=\"breakdown-wrap\"></div>");
}
buf.push("</div>");}.call(this,"kind" in locals_for_with?locals_for_with.kind:typeof kind!=="undefined"?kind:undefined));;return buf.join("");
}
},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYm94LW5hdi5jb2ZmZWUiLCJib3hlcy9ib3guY29mZmVlIiwiYm94ZXMvY2x1c3Rlci1ib3guY29mZmVlIiwiYm94ZXMvY29tcG9uZW50LWdlbmVyYXRpb24tYm94LmNvZmZlZSIsImJveGVzL2hvc3QtYm94LmNvZmZlZSIsImJveGVzL3BsYXRmb3JtLWNvbXBvbmVudC1ib3guY29mZmVlIiwibWFpbi5jb2ZmZWUiLCJtYW5hZ2Vycy9hZG1pbi1tYW5hZ2VyLmNvZmZlZSIsIm1hbmFnZXJzL2FwcC1jb21wb25lbnRzLmNvZmZlZSIsIm1hbmFnZXJzL2NvbnNvbGUtbWFuYWdlci5jb2ZmZWUiLCJtYW5hZ2Vycy9tYW5hZ2VyLmNvZmZlZSIsIm1hbmFnZXJzL3BsYXRmb3JtLWNvbXBvbmVudHMuY29mZmVlIiwibWFuYWdlcnMvc2NhbGUtbWFuYWdlci5jb2ZmZWUiLCJtYW5hZ2Vycy9zcGxpdC1tYW5hZ2VyLmNvZmZlZSIsIm1hbmFnZXJzL3N0YXRzLW1hbmFnZXIuY29mZmVlIiwibWlzYy9saW5lLWFuaW1hdG9yLmNvZmZlZSIsIm1pc2Mvd2luZG93LXNjcm9sbGVyLmNvZmZlZSIsInNhdmVyLmNvZmZlZSIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL2FkbWluLmpzIiwiLi4vLi4vc2VydmVyL2pzL2phZGUvYm94LW5hdi5qcyIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL2NsdXN0ZXItYm94LmpzIiwiLi4vLi4vc2VydmVyL2pzL2phZGUvY29tcG9uZW50LWJveC5qcyIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL2hvc3QtYm94LmpzIiwiLi4vLi4vc2VydmVyL2pzL2phZGUvc2F2ZXIuanMiLCIuLi8uLi9zZXJ2ZXIvanMvamFkZS9zcGxpdC5qcyIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL3N0YXRzLXdyYXBwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBCb3hOYXYsIGJveE5hdjtcblxuYm94TmF2ID0gcmVxdWlyZSgnamFkZS9ib3gtbmF2Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm94TmF2ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBCb3hOYXYoJGVsLCBuYXZJdGVtcywgaWQpIHtcbiAgICB2YXIgJG5vZGU7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgICRub2RlID0gJChib3hOYXYoe1xuICAgICAgbmF2OiBuYXZJdGVtc1xuICAgIH0pKTtcbiAgICAkZWwuYXBwZW5kKCRub2RlKTtcbiAgICAkKFwiLm5hdi1pdGVtXCIsICRub2RlKS5vbihcImNsaWNrXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLm9uQ2xpY2soZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtZXZlbnRcIiksIGUuY3VycmVudFRhcmdldCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuXG4gIEJveE5hdi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKGV2ZW50LCBlbCkge1xuICAgIHJldHVybiBQdWJTdWIucHVibGlzaChldmVudCwge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBlbDogZWxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gQm94TmF2O1xuXG59KSgpO1xuIiwidmFyIEFkbWluTWFuYWdlciwgQXBwQ29tcG9uZW50cywgQm94LCBDb25zb2xlTWFuYWdlciwgTGluZUFuaW1hdG9yLCBQbGF0Zm9ybUNvbXBvbmVudHMsIFNjYWxlTWFuYWdlciwgU3BsaXRNYW5hZ2VyLCBTdGF0c01hbmFnZXIsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5TdGF0c01hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9zdGF0cy1tYW5hZ2VyJyk7XG5cbkNvbnNvbGVNYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvY29uc29sZS1tYW5hZ2VyJyk7XG5cblBsYXRmb3JtQ29tcG9uZW50cyA9IHJlcXVpcmUoJ21hbmFnZXJzL3BsYXRmb3JtLWNvbXBvbmVudHMnKTtcblxuQXBwQ29tcG9uZW50cyA9IHJlcXVpcmUoJ21hbmFnZXJzL2FwcC1jb21wb25lbnRzJyk7XG5cblNjYWxlTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL3NjYWxlLW1hbmFnZXInKTtcblxuQWRtaW5NYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvYWRtaW4tbWFuYWdlcicpO1xuXG5TcGxpdE1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9zcGxpdC1tYW5hZ2VyJyk7XG5cbkxpbmVBbmltYXRvciA9IHJlcXVpcmUoJ21pc2MvbGluZS1hbmltYXRvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJveCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQm94KCRub2RlLCBkYXRhMSkge1xuICAgIHRoaXMuJG5vZGUgPSAkbm9kZTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhMTtcbiAgICB0aGlzLmNsb3NlU3ViQ29udGVudCA9IGJpbmQodGhpcy5jbG9zZVN1YkNvbnRlbnQsIHRoaXMpO1xuICAgIHRoaXMucmVzaXplU3ViQ29udGVudCA9IGJpbmQodGhpcy5yZXNpemVTdWJDb250ZW50LCB0aGlzKTtcbiAgICB0aGlzLmhpZGVDdXJyZW50U3ViQ29udGVudCA9IGJpbmQodGhpcy5oaWRlQ3VycmVudFN1YkNvbnRlbnQsIHRoaXMpO1xuICAgIEV2ZW50aWZ5LmV4dGVuZCh0aGlzKTtcbiAgICB0aGlzLmlkID0gdGhpcy5kYXRhLmlkO1xuICAgIGNhc3RTaGFkb3dzKHRoaXMuJG5vZGUpO1xuICAgIHRoaXMuJHN1YkNvbnRlbnQgPSAkKFwiLnN1Yi1jb250ZW50XCIsIHRoaXMuJG5vZGUpO1xuICAgIHRoaXMuJHN1YiA9ICQoXCIuc3ViXCIsIHRoaXMuJG5vZGUpO1xuICAgIHRoaXMuZmFkZU91dER1cmF0aW9uID0gMzAwO1xuICAgIHRoaXMuYW5pbWF0ZUR1cmF0aW9uID0gMjUwO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5kYXRhLnN0YXRlKTtcbiAgfVxuXG4gIEJveC5wcm90b3R5cGUuYWRkQXBwQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKFwiVGhpcyBpcyBub3QgYSBob3N0LCBhbmQgY2Fubm90IGFkZCBhcHAgY29tcG9uZW50c1wiKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmhhc0NvbXBvbmVudFdpdGhJZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmhhc0dlbmVyYXRpb25XaXRoSWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5zd2l0Y2hTdWJDb250ZW50ID0gZnVuY3Rpb24obmV3U3ViU3RhdGUsIGNsaWNrZWROYXZCdG4pIHtcbiAgICB0aGlzLmNsaWNrZWROYXZCdG4gPSBjbGlja2VkTmF2QnRuO1xuICAgIGlmICh0aGlzLnN1YlN0YXRlID09PSBuZXdTdWJTdGF0ZSkge1xuICAgICAgdGhpcy5jbG9zZVN1YkNvbnRlbnQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zdWJTdGF0ZSA9IG5ld1N1YlN0YXRlO1xuICAgIHdpbmRvdy5zdWIgPSB0aGlzLiRzdWJDb250ZW50WzBdO1xuICAgIHJldHVybiB0aGlzLmhpZGVDdXJyZW50U3ViQ29udGVudCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dpdGNoIChfdGhpcy5zdWJTdGF0ZSkge1xuICAgICAgICAgIGNhc2UgJ3N0YXRzJzpcbiAgICAgICAgICAgIF90aGlzLnN1Yk1hbmFnZXIgPSBuZXcgU3RhdHNNYW5hZ2VyKF90aGlzLiRzdWJDb250ZW50LCBfdGhpcy5raW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2NvbnNvbGUnOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBDb25zb2xlTWFuYWdlcihfdGhpcy4kc3ViQ29udGVudCwgX3RoaXMua2luZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwbGF0Zm9ybS1jb21wb25lbnRzJzpcbiAgICAgICAgICAgIF90aGlzLnN1Yk1hbmFnZXIgPSBuZXcgUGxhdGZvcm1Db21wb25lbnRzKF90aGlzLiRzdWJDb250ZW50LCBfdGhpcy5kYXRhLnBsYXRmb3JtQ29tcG9uZW50cywgX3RoaXMuaGlkZUN1cnJlbnRTdWJDb250ZW50LCBfdGhpcy5yZXNpemVTdWJDb250ZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NjYWxlLW1hY2hpbmUnOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBTY2FsZU1hbmFnZXIoX3RoaXMuJHN1YkNvbnRlbnQsIF90aGlzLmRhdGEuc2VydmVyU3BlY3NJZCwgX3RoaXMudG90YWxNZW1iZXJzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FwcC1jb21wb25lbnRzJzpcbiAgICAgICAgICAgIF90aGlzLnN1Yk1hbmFnZXIgPSBuZXcgQXBwQ29tcG9uZW50cyhfdGhpcy4kc3ViQ29udGVudCwgX3RoaXMuZGF0YS5hcHBDb21wb25lbnRzLCBfdGhpcy5yZXNpemVTdWJDb250ZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FkbWluJzpcbiAgICAgICAgICAgIF90aGlzLnN1Yk1hbmFnZXIgPSBuZXcgQWRtaW5NYW5hZ2VyKF90aGlzLiRzdWJDb250ZW50LCBfdGhpcy5kYXRhLmFwcENvbXBvbmVudHMsIF90aGlzLnJlc2l6ZVN1YkNvbnRlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc3BsaXQnOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBTcGxpdE1hbmFnZXIoX3RoaXMuJHN1YkNvbnRlbnQsIF90aGlzLmNvbXBvbmVudERhdGEuc2NhbGVzSG9yaXosIF90aGlzLmNsb3NlU3ViQ29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMucG9zaXRpb25BcnJvdyhfdGhpcy5jbGlja2VkTmF2QnRuLCBfdGhpcy5zdWJTdGF0ZSk7XG4gICAgICAgIHJldHVybiBfdGhpcy5yZXNpemVTdWJDb250ZW50KF90aGlzLnN1YlN0YXRlKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuaGFzR2VuZXJhdGlvbldpdGhJZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGNvbXBvbmVudERhdGEsIGdlbmVyYXRpb24sIGksIGosIGxlbiwgbGVuMSwgcmVmLCByZWYxO1xuICAgIHJlZiA9IHRoaXMuZGF0YS5hcHBDb21wb25lbnRzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50RGF0YSA9IHJlZltpXTtcbiAgICAgIHJlZjEgPSBjb21wb25lbnREYXRhLmdlbmVyYXRpb25zO1xuICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgIGdlbmVyYXRpb24gPSByZWYxW2pdO1xuICAgICAgICBpZiAoZ2VuZXJhdGlvbi5pZCA9PT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5zZXRHZW5lcmF0aW9uU3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICB2YXIgY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbiwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgcmVmID0gdGhpcy5kYXRhLmFwcENvbXBvbmVudHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50RGF0YSA9IHJlZltpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBqLCBsZW4xLCByZWYxLCByZXN1bHRzMTtcbiAgICAgICAgcmVmMSA9IGNvbXBvbmVudERhdGEuZ2VuZXJhdGlvbnM7XG4gICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGdlbmVyYXRpb24gPSByZWYxW2pdO1xuICAgICAgICAgIGlmIChpZCA9PT0gZ2VuZXJhdGlvbi5pZCkge1xuICAgICAgICAgICAgZ2VuZXJhdGlvbi5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ViU3RhdGUgPT09ICdhcHAtY29tcG9uZW50cycpIHtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaCh0aGlzLnN1Yk1hbmFnZXIudXBkYXRlR2VuZXJhdGlvblN0YXRlKGlkLCBzdGF0ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaCh2b2lkIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzMS5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgIH0pLmNhbGwodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmhpZGVDdXJyZW50U3ViQ29udGVudCA9IGZ1bmN0aW9uKGNiLCBkb0Rlc3Ryb3lDdXJyZW50Q29udGVudCwgZG9DYWxsUmVzaXplQmVmb3JlQ2IpIHtcbiAgICB2YXIgbWU7XG4gICAgaWYgKGRvRGVzdHJveUN1cnJlbnRDb250ZW50ID09IG51bGwpIHtcbiAgICAgIGRvRGVzdHJveUN1cnJlbnRDb250ZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGRvQ2FsbFJlc2l6ZUJlZm9yZUNiID09IG51bGwpIHtcbiAgICAgIGRvQ2FsbFJlc2l6ZUJlZm9yZUNiID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc2V0SGVpZ2h0VG9Db250ZW50KCk7XG4gICAgaWYgKHRoaXMuc3ViTWFuYWdlciA9PSBudWxsKSB7XG4gICAgICBjYigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZSA9IHRoaXM7XG4gICAgdGhpcy4kc3ViQ29udGVudC5jc3Moe1xuICAgICAgb3BhY2l0eTogMFxuICAgIH0pO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGRvRGVzdHJveUN1cnJlbnRDb250ZW50KSB7XG4gICAgICAgIG1lLmRlc3Ryb3lTdWJJdGVtKCk7XG4gICAgICB9XG4gICAgICBpZiAoZG9DYWxsUmVzaXplQmVmb3JlQ2IpIHtcbiAgICAgICAgcmV0dXJuIG1lLnJlc2l6ZVN1YkNvbnRlbnQobnVsbCwgY2IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICB9XG4gICAgfSwgdGhpcy5mYWRlT3V0RHVyYXRpb24pO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUucmVzaXplU3ViQ29udGVudCA9IGZ1bmN0aW9uKGNzc0NsYXNzLCBjYikge1xuICAgIFB1YlN1Yi5wdWJsaXNoKCdTQ1JPTExfVE8nLCB0aGlzLiRub2RlKTtcbiAgICBpZiAoY3NzQ2xhc3MgIT0gbnVsbCkge1xuICAgICAgdGhpcy4kc3ViQ29udGVudC5hZGRDbGFzcyhjc3NDbGFzcyk7XG4gICAgfVxuICAgIHRoaXMuc2V0SGVpZ2h0VG9Db250ZW50KCk7XG4gICAgdGhpcy4kc3ViLmFkZENsYXNzKFwiaGFzLWNvbnRlbnRcIik7XG4gICAgc2V0VGltZW91dCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuJHN1Yi5jc3Moe1xuICAgICAgICAgIGhlaWdodDogJ2luaXRpYWwnXG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy4kc3ViQ29udGVudC5jc3Moe1xuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjYiAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkodGhpcyksIHRoaXMuYW5pbWF0ZUR1cmF0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5maXJlKFwicmVzaXplXCIsIHRoaXMpO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuY2xvc2VTdWJDb250ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRIZWlnaHRUb0NvbnRlbnQoKTtcbiAgICB0aGlzLiRzdWJDb250ZW50LmNzcyh7XG4gICAgICBvcGFjaXR5OiAwXG4gICAgfSk7XG4gICAgdGhpcy4kc3ViLnJlbW92ZUNsYXNzKFwiaGFzLWNvbnRlbnRcIik7XG4gICAgc2V0VGltZW91dCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuc3ViU3RhdGUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gX3RoaXMuZGVzdHJveVN1Ykl0ZW0oKTtcbiAgICAgIH07XG4gICAgfSkodGhpcyksIHRoaXMuYW5pbWF0ZUR1cmF0aW9uKTtcbiAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLiRzdWIuY3NzKHtcbiAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpLCAyMCk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5kZXN0cm95U3ViSXRlbSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN1Yk1hbmFnZXIgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN1Yk1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuJHN1YkNvbnRlbnQuZW1wdHkoKTtcbiAgICB0aGlzLiRzdWJDb250ZW50LmF0dHIoJ2NsYXNzJywgXCJzdWItY29udGVudFwiKTtcbiAgICByZXR1cm4gdGhpcy5zdWJNYW5hZ2VyID0gbnVsbDtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnJlbW92ZVN1YkNvbnRlbnRBbmltYXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJHN1Yi5hZGRDbGFzcyhcIm5vLXRyYW5zaXRpb25cIik7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlLCBzdGF0dXMsIG1lc3NhZ2VDb2RlKSB7XG4gICAgaWYgKHN0YXRlID09PSB0aGlzLnN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgJ2NyZWF0ZWQnOlxuICAgICAgY2FzZSAnaW5pdGlhbGl6ZWQnOlxuICAgICAgY2FzZSAnb3JkZXJlZCc6XG4gICAgICBjYXNlICdwcm92aXNpb25pbmcnOlxuICAgICAgY2FzZSAnZGVmdW5jdCc6XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGluZ1N0YXRlKCdidWlsZCcsIHRoaXMuZ2V0U3RhdGVNZXNzYWdlKHRoaXMuc3RhdGUpKTtcbiAgICAgIGNhc2UgJ2FjdGl2ZSc6XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVN0YXRlKCk7XG4gICAgICBjYXNlICdkZWNvbWlzc2lvbmluZyc6XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGluZ1N0YXRlKCdkZXN0cm95JywgdGhpcy5nZXRTdGF0ZU1lc3NhZ2UodGhpcy5zdGF0ZSkpO1xuICAgICAgY2FzZSAnYXJjaGl2ZWQnOlxuICAgICAgICByZXR1cm4gdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuYW5pbWF0aW5nU3RhdGUgPSBmdW5jdGlvbihhbmltYXRpb25LaW5kLCBtZXNzYWdlKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uS2luZCA9PT0gYW5pbWF0aW9uS2luZCkge1xuICAgICAgJCgnLmFuaW1hdGlvbiAudGl0bGUnLCB0aGlzLiRub2RlKS50ZXh0KG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFuaW1hdGlvbktpbmQgPSBhbmltYXRpb25LaW5kO1xuICAgICAgdGhpcy5jbG9zZVN1YkNvbnRlbnQoKTtcbiAgICAgIHJldHVybiB0aGlzLmZhZGVPdXRNYWluQ29udGVudCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB4dHJhO1xuICAgICAgICAgIHh0cmEgPSBfdGhpcy4kbm9kZS5pcygnOmxhc3QtY2hpbGQnKSA/IDE1IDogMDtcbiAgICAgICAgICBfdGhpcy4kbm9kZS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiBfdGhpcy4kbm9kZS5oZWlnaHQoKSArIHh0cmFcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBfdGhpcy5kZXN0cm95QW55QW5pbWF0aW9uKCk7XG4gICAgICAgICAgJCgnLmFuaW1hdGlvbiAudGl0bGUnLCBfdGhpcy4kbm9kZSkudGV4dChtZXNzYWdlKTtcbiAgICAgICAgICBfdGhpcy5saW5lQW5pbWF0aW9uID0gbmV3IExpbmVBbmltYXRvcigkKCcuYW5pbWF0aW9uIC5zdmctaG9sZGVyJywgX3RoaXMuJG5vZGUpLCBfdGhpcy5raW5kLCBfdGhpcy5hbmltYXRpb25LaW5kKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuc2V0U3RhdGVDbGFzc0FuZEZhZGVJbignYW5pbWF0aW5nJyk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfVxuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuYWN0aXZlU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFuaW1hdGlvbktpbmQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzLmZhZGVPdXRNYWluQ29udGVudCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuJG5vZGUuY3NzKHtcbiAgICAgICAgICBoZWlnaHQ6IFwiaW5pdGlhbFwiXG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy5kZXN0cm95QW55QW5pbWF0aW9uKCk7XG4gICAgICAgIHJldHVybiBfdGhpcy5zZXRTdGF0ZUNsYXNzQW5kRmFkZUluKCdhY3RpdmUnKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuZXJyb3JlZFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3dpdGNoTWFpblZpZXdTdGF0ZSgnZXJyb3JlZCcpO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuc2V0U3RhdGVDbGFzc0FuZEZhZGVJbiA9IGZ1bmN0aW9uKGNzc0NsYXNzKSB7XG4gICAgdGhpcy5oYXNDb250ZW50ID0gdHJ1ZTtcbiAgICB0aGlzLiRub2RlLnJlbW92ZUNsYXNzKCdidWlsZGluZyBhY3RpdmUgZXJyb3JlZCBhbmltYXRpbmcnKTtcbiAgICB0aGlzLiRub2RlLmFkZENsYXNzKGNzc0NsYXNzKTtcbiAgICByZXR1cm4gJChcIi5tYWluLWNvbnRlbnRcIiwgdGhpcy4kbm9kZSkuY3NzKHtcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9KTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmRlc3Ryb3lBbnlBbmltYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5saW5lQW5pbWF0aW9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMubGluZUFuaW1hdGlvbi5kZXN0cm95KCk7XG4gICAgICByZXR1cm4gdGhpcy5saW5lQW5pbWF0aW9uID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5mYWRlT3V0TWFpbkNvbnRlbnQgPSBmdW5jdGlvbihjYikge1xuICAgIGlmICghdGhpcy5oYXNDb250ZW50KSB7XG4gICAgICBjYigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkKFwiLm1haW4tY29udGVudFwiLCB0aGlzLiRub2RlKS5jc3Moe1xuICAgICAgb3BhY2l0eTogMFxuICAgIH0pO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNiKCk7XG4gICAgfSwgMjUwKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnNldEhlaWdodFRvQ29udGVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiRzdWIuY3NzKHtcbiAgICAgIGhlaWdodDogdGhpcy4kc3ViQ29udGVudFswXS5vZmZzZXRIZWlnaHRcbiAgICB9KTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnBvc2l0aW9uQXJyb3cgPSBmdW5jdGlvbihlbCwgY3NzQ2xhc3MpIHtcbiAgICB2YXIgJGFycm93UG9pbnRlciwgJGVsO1xuICAgICRlbCA9ICQoZWwpO1xuICAgICRhcnJvd1BvaW50ZXIgPSAkKFwiPGRpdiBjbGFzcz0nYXJyb3ctcG9pbnRlcicvPlwiKTtcbiAgICB0aGlzLiRzdWJDb250ZW50LmFwcGVuZCgkYXJyb3dQb2ludGVyKTtcbiAgICAkYXJyb3dQb2ludGVyLmNzcyh7XG4gICAgICBsZWZ0OiAkZWwub2Zmc2V0KCkubGVmdCArICQoXCIudGV4dFwiLCBlbCkud2lkdGgoKSAvIDIgLSAxXG4gICAgfSk7XG4gICAgaWYgKGNzc0NsYXNzICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAkYXJyb3dQb2ludGVyLmFkZENsYXNzKGNzc0NsYXNzKTtcbiAgICB9XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5nZXRTdGF0ZU1lc3NhZ2UgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgIGNhc2UgJ2NyZWF0ZWQnOlxuICAgICAgICByZXR1cm4gdGhpcy5pZCArIFwiIDogQ3JlYXRpbmdcIjtcbiAgICAgIGNhc2UgJ2luaXRpYWxpemVkJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgKyBcIiA6IEluaXRpYWxpemluZ1wiO1xuICAgICAgY2FzZSAnb3JkZXJlZCc6XG4gICAgICAgIHJldHVybiB0aGlzLmlkICsgXCIgOiBPcmRlcmluZ1wiO1xuICAgICAgY2FzZSAncHJvdmlzaW9uaW5nJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgKyBcIiA6IFByb3Zpc2lvbmluZ1wiO1xuICAgICAgY2FzZSAnZGVmdW5jdCc6XG4gICAgICAgIHJldHVybiB0aGlzLmlkICsgXCIgOiBEZWZ1bmN0XCI7XG4gICAgICBjYXNlICdkZWNvbWlzc2lvbmluZyc6XG4gICAgICAgIHJldHVybiB0aGlzLmlkICsgXCIgOiBEZWNvbWlzc2lvbmluZ1wiO1xuICAgIH1cbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmJ1aWxkU3RhdHMgPSBmdW5jdGlvbigkZWwpIHtcbiAgICB2YXIgc3RhdFR5cGVzO1xuICAgIHRoaXMuc3RhdHMgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygnc3RhbmRhcmQnLCAkZWwpO1xuICAgIHN0YXRUeXBlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiY3B1X3VzZWRcIixcbiAgICAgICAgbmlja25hbWU6IFwiQ1BVXCIsXG4gICAgICAgIG5hbWU6IFwiQ1BVIFVzZWRcIlxuICAgICAgfSwge1xuICAgICAgICBpZDogXCJyYW1fdXNlZFwiLFxuICAgICAgICBuaWNrbmFtZTogXCJSQU1cIixcbiAgICAgICAgbmFtZTogXCJSQU0gVXNlZFwiXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInN3YXBfdXNlZFwiLFxuICAgICAgICBuaWNrbmFtZTogXCJTV0FQXCIsXG4gICAgICAgIG5hbWU6IFwiU3dhcCBVc2VkXCJcbiAgICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiZGlza191c2VkXCIsXG4gICAgICAgIG5pY2tuYW1lOiBcIkRJU0tcIixcbiAgICAgICAgbmFtZTogXCJEaXNrIFVzZWRcIlxuICAgICAgfVxuICAgIF07XG4gICAgcmV0dXJuIHRoaXMuc3RhdHMuYnVpbGQoKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnVwZGF0ZUxpdmVTdGF0cyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0cy51cGRhdGVMaXZlU3RhdHMoZGF0YSk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS51cGRhdGVIaXN0b3JpY1N0YXRzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRzLnVwZGF0ZUhpc3RvcmljU3RhdHMoZGF0YSk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lO1xuICAgIHRoaXMuJG5vZGUuY3NzKHtcbiAgICAgIGhlaWdodDogdGhpcy4kbm9kZS5oZWlnaHQoKVxuICAgIH0pO1xuICAgIG1lID0gdGhpcztcbiAgICB0aGlzLiRub2RlLmFkZENsYXNzKCdmYWRlZCcpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbWUuJG5vZGUuYWRkQ2xhc3MoJ2FyY2hpdmVkJyk7XG4gICAgfSwgMzAwKTtcbiAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLiRub2RlLnJlbW92ZSgpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSwgNzUwKTtcbiAgfTtcblxuICByZXR1cm4gQm94O1xuXG59KSgpO1xuIiwidmFyIEJveCwgQm94TmF2LCBDbHVzdGVyQm94LCBjbHVzdGVyQm94LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQm94ID0gcmVxdWlyZSgnYm94ZXMvYm94Jyk7XG5cbkJveE5hdiA9IHJlcXVpcmUoJ2JveC1uYXYnKTtcblxuY2x1c3RlckJveCA9IHJlcXVpcmUoJ2phZGUvY2x1c3Rlci1ib3gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbHVzdGVyQm94ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKENsdXN0ZXJCb3gsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIENsdXN0ZXJCb3goJGVsLCBkYXRhKSB7XG4gICAgdmFyICRub2RlO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5raW5kID0gXCJjbHVzdGVyXCI7XG4gICAgdGhpcy5kYXRhLmNsdXN0ZXJOYW1lID0gdGhpcy5tYWtlQ2x1c3Rlck5hbWUodGhpcy5kYXRhLmluc3RhbmNlcyk7XG4gICAgdGhpcy50b3RhbE1lbWJlcnMgPSB0aGlzLmRhdGEudG90YWxNZW1iZXJzID0gdGhpcy5kYXRhLmluc3RhbmNlcy5sZW5ndGg7XG4gICAgJG5vZGUgPSAkKGNsdXN0ZXJCb3godGhpcy5kYXRhKSk7XG4gICAgJGVsLmFwcGVuZCgkbm9kZSk7XG4gICAgdGhpcy5idWlsZE5hdigkbm9kZSk7XG4gICAgQ2x1c3RlckJveC5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkbm9kZSwgdGhpcy5kYXRhKTtcbiAgICBQdWJTdWIucHVibGlzaCgnUkVHSVNURVIuQ0xVU1RFUicsIHRoaXMpO1xuICAgIHRoaXMuYnVpbGRTdGF0cygkKFwiLnN0YXRzXCIsICRub2RlKSk7XG4gIH1cblxuICBDbHVzdGVyQm94LnByb3RvdHlwZS5idWlsZE5hdiA9IGZ1bmN0aW9uKCRub2RlKSB7XG4gICAgdmFyIG5hdkl0ZW1zO1xuICAgIG5hdkl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICB0eHQ6IFwiQXBwIENvbXBvbmVudFwiLFxuICAgICAgICBpY29uOiAnYXBwLWNvbXBvbmVudCcsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5BUFBfQ09NUE9ORU5UUydcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIlNjYWxlXCIsXG4gICAgICAgIGljb246ICdzY2FsZScsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5TQ0FMRSdcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIlN0YXRzXCIsXG4gICAgICAgIGljb246ICdzdGF0cycsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5TVEFUUydcbiAgICAgIH1cbiAgICBdO1xuICAgIHJldHVybiB0aGlzLm5hdiA9IG5ldyBCb3hOYXYoJCgnLm5hdi1ob2xkZXInLCAkbm9kZSksIG5hdkl0ZW1zLCB0aGlzLmRhdGEuaWQpO1xuICB9O1xuXG4gIENsdXN0ZXJCb3gucHJvdG90eXBlLm1ha2VDbHVzdGVyTmFtZSA9IGZ1bmN0aW9uKGluc3RhbmNlcykge1xuICAgIHJldHVybiBpbnN0YW5jZXNbMF0uaG9zdE5hbWUgKyBcIiAtIFwiICsgaW5zdGFuY2VzW2luc3RhbmNlcy5sZW5ndGggLSAxXS5ob3N0TmFtZTtcbiAgfTtcblxuICBDbHVzdGVyQm94LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnB1Ymxpc2goJ1VOUkVHSVNURVIuQ0xVU1RFUicsIHRoaXMpO1xuICAgIHJldHVybiBDbHVzdGVyQm94Ll9fc3VwZXJfXy5kZXN0cm95LmNhbGwodGhpcyk7XG4gIH07XG5cbiAgcmV0dXJuIENsdXN0ZXJCb3g7XG5cbn0pKEJveCk7XG4iLCJ2YXIgQm94LCBCb3hOYXYsIENvbXBvbmVudEdlbmVyYXRpb25Cb3gsIGNvbXBvbmVudEJveCxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJveCA9IHJlcXVpcmUoJ2JveGVzL2JveCcpO1xuXG5Cb3hOYXYgPSByZXF1aXJlKCdib3gtbmF2Jyk7XG5cbmNvbXBvbmVudEJveCA9IHJlcXVpcmUoJ2phZGUvY29tcG9uZW50LWJveCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudEdlbmVyYXRpb25Cb3ggPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQ29tcG9uZW50R2VuZXJhdGlvbkJveCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50R2VuZXJhdGlvbkJveCgkZWwsIGRhdGEpIHtcbiAgICB2YXIgJG5vZGUsIGNvbXBpbGVkRGF0YTtcbiAgICB0aGlzLmtpbmQgPSBcImNvbXBvbmVudFwiO1xuICAgIHRoaXMuY29tcG9uZW50RGF0YSA9IGRhdGEuY29tcG9uZW50RGF0YTtcbiAgICB0aGlzLmdlbmVyYXRpb25EYXRhID0gZGF0YS5nZW5lcmF0aW9uRGF0YTtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmNvbXBvbmVudERhdGE7XG4gICAgY29tcGlsZWREYXRhID0ge1xuICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGlvbkRhdGEuaWQsXG4gICAgICBzdGF0ZTogdGhpcy5nZW5lcmF0aW9uRGF0YS5zdGF0ZVxuICAgIH07XG4gICAgJG5vZGUgPSAkKGNvbXBvbmVudEJveCh0aGlzLmNvbXBvbmVudERhdGEpKTtcbiAgICAkZWwuYXBwZW5kKCRub2RlKTtcbiAgICB0aGlzLmJ1aWxkQXBwQ29tcG9uZW50TmF2KCRub2RlKTtcbiAgICBQdWJTdWIucHVibGlzaCgnUkVHSVNURVIuQVBQX0NPTVBPTkVOVCcsIHRoaXMpO1xuICAgIENvbXBvbmVudEdlbmVyYXRpb25Cb3guX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgJG5vZGUsIGNvbXBpbGVkRGF0YSk7XG4gICAgdGhpcy5idWlsZFN0YXRzKCQoXCIuc3RhdHNcIiwgJG5vZGUpKTtcbiAgfVxuXG4gIENvbXBvbmVudEdlbmVyYXRpb25Cb3gucHJvdG90eXBlLmJ1aWxkQXBwQ29tcG9uZW50TmF2ID0gZnVuY3Rpb24oJG5vZGUpIHtcbiAgICB2YXIgbmF2SXRlbXM7XG4gICAgbmF2SXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIHR4dDogXCJDb25zb2xlXCIsXG4gICAgICAgIGljb246ICdjb25zb2xlJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLkNPTlNPTEUnXG4gICAgICB9LCB7XG4gICAgICAgIHR4dDogXCJTcGxpdFwiLFxuICAgICAgICBpY29uOiAnc3BsaXQnLFxuICAgICAgICBldmVudDogJ1NIT1cuU1BMSVQnXG4gICAgICB9LCB7XG4gICAgICAgIHR4dDogXCJBZG1pblwiLFxuICAgICAgICBpY29uOiAnYWRtaW4nLFxuICAgICAgICBldmVudDogJ1NIT1cuQURNSU4nXG4gICAgICB9LCB7XG4gICAgICAgIHR4dDogXCJTdGF0c1wiLFxuICAgICAgICBpY29uOiAnc3RhdHMnLFxuICAgICAgICBldmVudDogJ1NIT1cuU1RBVFMnXG4gICAgICB9XG4gICAgXTtcbiAgICByZXR1cm4gdGhpcy5uYXYgPSBuZXcgQm94TmF2KCQoJy5uYXYtaG9sZGVyJywgJG5vZGUpLCBuYXZJdGVtcywgdGhpcy5nZW5lcmF0aW9uRGF0YS5pZCk7XG4gIH07XG5cbiAgQ29tcG9uZW50R2VuZXJhdGlvbkJveC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIFB1YlN1Yi5wdWJsaXNoKCdVTlJFR0lTVEVSLkFQUF9DT01QT05FTlQnLCB0aGlzKTtcbiAgICByZXR1cm4gQ29tcG9uZW50R2VuZXJhdGlvbkJveC5fX3N1cGVyX18uZGVzdHJveS5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIHJldHVybiBDb21wb25lbnRHZW5lcmF0aW9uQm94O1xuXG59KShCb3gpO1xuIiwidmFyIEJveCwgQm94TmF2LCBIb3N0Qm94LCBob3N0Qm94LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQm94ID0gcmVxdWlyZSgnYm94ZXMvYm94Jyk7XG5cbkJveE5hdiA9IHJlcXVpcmUoJ2JveC1uYXYnKTtcblxuaG9zdEJveCA9IHJlcXVpcmUoJ2phZGUvaG9zdC1ib3gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb3N0Qm94ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEhvc3RCb3gsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEhvc3RCb3goJGVsLCBkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmtpbmQgPSBcImhvc3RcIjtcbiAgICB0aGlzLiRub2RlID0gJChob3N0Qm94KHRoaXMuZGF0YSkpO1xuICAgICRlbC5hcHBlbmQodGhpcy4kbm9kZSk7XG4gICAgdGhpcy5idWlsZE5hdih0aGlzLiRub2RlKTtcbiAgICBIb3N0Qm94Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIHRoaXMuJG5vZGUsIHRoaXMuZGF0YSk7XG4gICAgUHViU3ViLnB1Ymxpc2goJ1JFR0lTVEVSLkhPU1QnLCB0aGlzKTtcbiAgICB0aGlzLmJ1aWxkU3RhdHMoJChcIi5zdGF0c1wiLCB0aGlzLiRub2RlKSk7XG4gIH1cblxuICBIb3N0Qm94LnByb3RvdHlwZS5idWlsZE5hdiA9IGZ1bmN0aW9uKCRub2RlKSB7XG4gICAgdmFyIG5hdkl0ZW1zO1xuICAgIG5hdkl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICB0eHQ6IFwiUGxhdGZvcm0gQ29tcG9uZW50c1wiLFxuICAgICAgICBpY29uOiAncGxhdGZvcm0tY29tcG9uZW50JyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLlBMQVRGT1JNX0NPTVBPTkVOVFMnXG4gICAgICB9LCB7XG4gICAgICAgIHR4dDogXCJBcHAgQ29tcG9uZW50c1wiLFxuICAgICAgICBpY29uOiAnYXBwLWNvbXBvbmVudCcsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5BUFBfQ09NUE9ORU5UUydcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIlNjYWxlXCIsXG4gICAgICAgIGljb246ICdzY2FsZScsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5TQ0FMRSdcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIlN0YXRzXCIsXG4gICAgICAgIGljb246ICdzdGF0cycsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5TVEFUUydcbiAgICAgIH1cbiAgICBdO1xuICAgIHJldHVybiB0aGlzLm5hdiA9IG5ldyBCb3hOYXYoJCgnLm5hdi1ob2xkZXInLCAkbm9kZSksIG5hdkl0ZW1zLCB0aGlzLmRhdGEuaWQpO1xuICB9O1xuXG4gIEhvc3RCb3gucHJvdG90eXBlLmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudERhdGEpIHtcbiAgICB0aGlzLmRhdGEuYXBwQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudERhdGEpO1xuICAgIGlmICh0aGlzLnN1YlN0YXRlID09PSAnYXBwLWNvbXBvbmVudHMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdWJNYW5hZ2VyLmFkZENvbXBvbmVudChjb21wb25lbnREYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgSG9zdEJveC5wcm90b3R5cGUuYWRkR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGNvbXBvbmVudElkLCBnZW5lcmF0aW9uRGF0YSkge1xuICAgIHZhciBjb21wb25lbnREYXRhLCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICByZWYgPSB0aGlzLmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gcmVmW2ldO1xuICAgICAgaWYgKGNvbXBvbmVudERhdGEuaWQgPT09IGNvbXBvbmVudElkKSB7XG4gICAgICAgIGNvbXBvbmVudERhdGEuZ2VuZXJhdGlvbnMucHVzaChnZW5lcmF0aW9uRGF0YSk7XG4gICAgICAgIGlmICh0aGlzLnN1YlN0YXRlID09PSAnYXBwLWNvbXBvbmVudHMnKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc3ViTWFuYWdlci5hZGRHZW5lcmF0aW9uKGNvbXBvbmVudERhdGEsIGdlbmVyYXRpb25EYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBIb3N0Qm94LnByb3RvdHlwZS5zZXRHZW5lcmF0aW9uU3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICB2YXIgY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbiwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgcmVmID0gdGhpcy5kYXRhLmFwcENvbXBvbmVudHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50RGF0YSA9IHJlZltpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBqLCBsZW4xLCByZWYxLCByZXN1bHRzMTtcbiAgICAgICAgcmVmMSA9IGNvbXBvbmVudERhdGEuZ2VuZXJhdGlvbnM7XG4gICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGdlbmVyYXRpb24gPSByZWYxW2pdO1xuICAgICAgICAgIGlmIChpZCA9PT0gZ2VuZXJhdGlvbi5pZCkge1xuICAgICAgICAgICAgZ2VuZXJhdGlvbi5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ViU3RhdGUgPT09ICdhcHAtY29tcG9uZW50cycpIHtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaCh0aGlzLnN1Yk1hbmFnZXIudXBkYXRlR2VuZXJhdGlvblN0YXRlKGlkLCBzdGF0ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaCh2b2lkIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzMS5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgIH0pLmNhbGwodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBIb3N0Qm94LnByb3RvdHlwZS5oYXNHZW5lcmF0aW9uV2l0aElkID0gZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbiwgaSwgaiwgbGVuLCBsZW4xLCByZWYsIHJlZjE7XG4gICAgcmVmID0gdGhpcy5kYXRhLmFwcENvbXBvbmVudHM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gcmVmW2ldO1xuICAgICAgcmVmMSA9IGNvbXBvbmVudERhdGEuZ2VuZXJhdGlvbnM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgZ2VuZXJhdGlvbiA9IHJlZjFbal07XG4gICAgICAgIGlmIChnZW5lcmF0aW9uLmlkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBIb3N0Qm94LnByb3RvdHlwZS5oYXNDb21wb25lbnRXaXRoSWQgPSBmdW5jdGlvbihpZCkge1xuICAgIHZhciBjb21wb25lbnREYXRhLCBpLCBsZW4sIHJlZjtcbiAgICByZWYgPSB0aGlzLmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudERhdGEgPSByZWZbaV07XG4gICAgICBpZiAoY29tcG9uZW50RGF0YS5pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBIb3N0Qm94LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnB1Ymxpc2goJ1VOUkVHSVNURVIuSE9TVCcsIHRoaXMpO1xuICAgIHJldHVybiBIb3N0Qm94Ll9fc3VwZXJfXy5kZXN0cm95LmNhbGwodGhpcyk7XG4gIH07XG5cbiAgcmV0dXJuIEhvc3RCb3g7XG5cbn0pKEJveCk7XG4iLCJ2YXIgQm94LCBCb3hOYXYsIFBsYXRmb3JtQ29tcG9uZW50Qm94LCBjb21wb25lbnRCb3gsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5Cb3ggPSByZXF1aXJlKCdib3hlcy9ib3gnKTtcblxuQm94TmF2ID0gcmVxdWlyZSgnYm94LW5hdicpO1xuXG5jb21wb25lbnRCb3ggPSByZXF1aXJlKCdqYWRlL2NvbXBvbmVudC1ib3gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF0Zm9ybUNvbXBvbmVudEJveCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChQbGF0Zm9ybUNvbXBvbmVudEJveCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUGxhdGZvcm1Db21wb25lbnRCb3goJGVsLCBkYXRhKSB7XG4gICAgdmFyICRub2RlO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5raW5kID0gXCJjb21wb25lbnRcIjtcbiAgICAkbm9kZSA9ICQoY29tcG9uZW50Qm94KHRoaXMuZGF0YSkpO1xuICAgICRlbC5hcHBlbmQoJG5vZGUpO1xuICAgIHRoaXMuYnVpbGRQbGF0Zm9ybUNvbXBvbmVudE5hdigkbm9kZSk7XG4gICAgUHViU3ViLnB1Ymxpc2goJ1JFR0lTVEVSLlBMQVRGT1JNX0NPTVBPTkVOVCcsIHRoaXMpO1xuICAgIFBsYXRmb3JtQ29tcG9uZW50Qm94Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICRub2RlLCB0aGlzLmRhdGEpO1xuICAgIHRoaXMuYnVpbGRTdGF0cygkKFwiLnN0YXRzXCIsICRub2RlKSk7XG4gIH1cblxuICBQbGF0Zm9ybUNvbXBvbmVudEJveC5wcm90b3R5cGUuYnVpbGRQbGF0Zm9ybUNvbXBvbmVudE5hdiA9IGZ1bmN0aW9uKCRub2RlKSB7XG4gICAgdmFyIG5hdkl0ZW1zO1xuICAgIG5hdkl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICB0eHQ6IFwiQ29uc29sZVwiLFxuICAgICAgICBpY29uOiAnY29uc29sZScsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5DT05TT0xFJ1xuICAgICAgfSwge1xuICAgICAgICB0eHQ6IFwiU3RhdHNcIixcbiAgICAgICAgaWNvbjogJ3N0YXRzJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLlNUQVRTJ1xuICAgICAgfVxuICAgIF07XG4gICAgcmV0dXJuIHRoaXMubmF2ID0gbmV3IEJveE5hdigkKCcubmF2LWhvbGRlcicsICRub2RlKSwgbmF2SXRlbXMsIHRoaXMuZGF0YS5pZCk7XG4gIH07XG5cbiAgUGxhdGZvcm1Db21wb25lbnRCb3gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIucHVibGlzaCgnVU5SRUdJU1RFUi5QTEFURk9STV9DT01QT05FTlQnLCB0aGlzKTtcbiAgICByZXR1cm4gUGxhdGZvcm1Db21wb25lbnRCb3guX19zdXBlcl9fLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgfTtcblxuICByZXR1cm4gUGxhdGZvcm1Db21wb25lbnRCb3g7XG5cbn0pKEJveCk7XG4iLCJ2YXIgQ2xvYmJlckJveCwgQ2x1c3RlckJveCwgQ29tcG9uZW50R2VuZXJhdGlvbkJveCwgSG9zdEJveCwgUGxhdGZvcm1Db21wb25lbnQsIFdpbmRvd1Njcm9sbGVyO1xuXG5Ib3N0Qm94ID0gcmVxdWlyZSgnYm94ZXMvaG9zdC1ib3gnKTtcblxuQ2x1c3RlckJveCA9IHJlcXVpcmUoJ2JveGVzL2NsdXN0ZXItYm94Jyk7XG5cbkNvbXBvbmVudEdlbmVyYXRpb25Cb3ggPSByZXF1aXJlKCdib3hlcy9jb21wb25lbnQtZ2VuZXJhdGlvbi1ib3gnKTtcblxuUGxhdGZvcm1Db21wb25lbnQgPSByZXF1aXJlKCdib3hlcy9wbGF0Zm9ybS1jb21wb25lbnQtYm94Jyk7XG5cbldpbmRvd1Njcm9sbGVyID0gcmVxdWlyZSgnbWlzYy93aW5kb3ctc2Nyb2xsZXInKTtcblxuQ2xvYmJlckJveCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2xvYmJlckJveCgpIHtcbiAgICBuZXcgV2luZG93U2Nyb2xsZXIoKTtcbiAgfVxuXG4gIENsb2JiZXJCb3gucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oJGVsLCBraW5kLCBkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgQ2xvYmJlckJveC5IT1NUOlxuICAgICAgICB0aGlzLmJveCA9IG5ldyBIb3N0Qm94KCRlbCwgdGhpcy5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENsb2JiZXJCb3guQ0xVU1RFUjpcbiAgICAgICAgdGhpcy5ib3ggPSBuZXcgQ2x1c3RlckJveCgkZWwsIHRoaXMuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDbG9iYmVyQm94LkFQUF9DT01QT05FTlRfR0VORVJBVElPTjpcbiAgICAgICAgdGhpcy5ib3ggPSBuZXcgQ29tcG9uZW50R2VuZXJhdGlvbkJveCgkZWwsIHRoaXMuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDbG9iYmVyQm94LlBMQVRGT1JNX0NPTVBPTkVOVDpcbiAgICAgICAgdGhpcy5ib3ggPSBuZXcgUGxhdGZvcm1Db21wb25lbnQoJGVsLCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0cyA9IHRoaXMuYm94LnN0YXRzO1xuICB9O1xuXG4gIENsb2JiZXJCb3gucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5ib3guc2V0U3RhdGUoc3RhdGUpO1xuICB9O1xuXG4gIENsb2JiZXJCb3gucHJvdG90eXBlLmRvbnRBbmltYXRlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmJveC5yZW1vdmVTdWJDb250ZW50QW5pbWF0aW9ucygpO1xuICB9O1xuXG4gIENsb2JiZXJCb3gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ib3guZGVzdHJveSgpO1xuICB9O1xuXG4gIENsb2JiZXJCb3guQ0xVU1RFUiA9ICdjbHVzdGVyJztcblxuICBDbG9iYmVyQm94LkhPU1QgPSAnaG9zdCc7XG5cbiAgQ2xvYmJlckJveC5QTEFURk9STV9DT01QT05FTlQgPSAncGxhdGZvcm0tY29tcG9uZW50JztcblxuICBDbG9iYmVyQm94LkFQUF9DT01QT05FTlRfR0VORVJBVElPTiA9ICdhcHAtY29tcG9uZW50LWdlbmVyYXRpb24nO1xuXG4gIHJldHVybiBDbG9iYmVyQm94O1xuXG59KSgpO1xuXG53aW5kb3cubmFub2JveCB8fCAod2luZG93Lm5hbm9ib3ggPSB7fSk7XG5cbm5hbm9ib3guQ2xvYmJlckJveCA9IENsb2JiZXJCb3g7XG4iLCJ2YXIgQWRtaW5NYW5hZ2VyLCBNYW5hZ2VyLCBhZG1pbixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbk1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9tYW5hZ2VyJyk7XG5cbmFkbWluID0gcmVxdWlyZSgnamFkZS9hZG1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkbWluTWFuYWdlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBZG1pbk1hbmFnZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFkbWluTWFuYWdlcigkZWwpIHtcbiAgICB2YXIgJG5vZGU7XG4gICAgJG5vZGUgPSAkKGFkbWluKHt9KSk7XG4gICAgJGVsLmFwcGVuZCgkbm9kZSk7XG4gICAgY2FzdFNoYWRvd3ModGhpcy4kbm9kZSk7XG4gICAgQWRtaW5NYW5hZ2VyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgcmV0dXJuIEFkbWluTWFuYWdlcjtcblxufSkoTWFuYWdlcik7XG4iLCJ2YXIgQXBwQ29tcG9uZW50cywgTWFuYWdlcixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbk1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9tYW5hZ2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29tcG9uZW50cyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBcHBDb21wb25lbnRzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBcHBDb21wb25lbnRzKCRlbCwgY29tcG9uZW50cywgcmVzaXplQ2IpIHtcbiAgICB2YXIgY29tcG9uZW50RGF0YSwgaSwgbGVuO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHRoaXMucmVzaXplQ2IgPSByZXNpemVDYjtcbiAgICBBcHBDb21wb25lbnRzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGlvbnMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjb21wb25lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gY29tcG9uZW50c1tpXTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGNvbXBvbmVudERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIEFwcENvbXBvbmVudHMucHJvdG90eXBlLmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudERhdGEpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbkRhdGEsIGksIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgIHJlZiA9IGNvbXBvbmVudERhdGEuZ2VuZXJhdGlvbnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZ2VuZXJhdGlvbkRhdGEgPSByZWZbaV07XG4gICAgICBpZiAoZ2VuZXJhdGlvbkRhdGEuc3RhdGUgIT09IFwiYXJjaGl2ZWRcIikge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRHZW5lcmF0aW9uKGNvbXBvbmVudERhdGEsIGdlbmVyYXRpb25EYXRhKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgQXBwQ29tcG9uZW50cy5wcm90b3R5cGUuYWRkR2VuZXJhdGlvbiA9IGZ1bmN0aW9uKGNvbXBvbmVudERhdGEsIGdlbmVyYXRpb25EYXRhKSB7XG4gICAgdmFyIGdlbmVyYXRpb247XG4gICAgZ2VuZXJhdGlvbiA9IG5ldyBuYW5vYm94LkNsb2JiZXJCb3goKTtcbiAgICBnZW5lcmF0aW9uLmJ1aWxkKHRoaXMuJGVsLCBuYW5vYm94LkNsb2JiZXJCb3guQVBQX0NPTVBPTkVOVF9HRU5FUkFUSU9OLCB7XG4gICAgICBjb21wb25lbnREYXRhOiBjb21wb25lbnREYXRhLFxuICAgICAgZ2VuZXJhdGlvbkRhdGE6IGdlbmVyYXRpb25EYXRhXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGlvbnMucHVzaChnZW5lcmF0aW9uKTtcbiAgfTtcblxuICBBcHBDb21wb25lbnRzLnByb3RvdHlwZS51cGRhdGVHZW5lcmF0aW9uU3RhdGUgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbiwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgcmVmID0gdGhpcy5nZW5lcmF0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBnZW5lcmF0aW9uID0gcmVmW2ldO1xuICAgICAgaWYgKGlkID09PSBnZW5lcmF0aW9uLmJveC5pZCkge1xuICAgICAgICByZXN1bHRzLnB1c2goZ2VuZXJhdGlvbi5ib3guc2V0U3RhdGUoc3RhdGUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBBcHBDb21wb25lbnRzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdlbmVyYXRpb24sIGksIGxlbiwgcmVmO1xuICAgIHJlZiA9IHRoaXMuZ2VuZXJhdGlvbnM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBnZW5lcmF0aW9uID0gcmVmW2ldO1xuICAgICAgZ2VuZXJhdGlvbi5ib3gub2ZmKCk7XG4gICAgICBnZW5lcmF0aW9uLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgcmV0dXJuIEFwcENvbXBvbmVudHMuX19zdXBlcl9fLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgfTtcblxuICByZXR1cm4gQXBwQ29tcG9uZW50cztcblxufSkoTWFuYWdlcik7XG4iLCJ2YXIgQ29uc29sZU1hbmFnZXIsIE1hbmFnZXIsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5NYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvbWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnNvbGVNYW5hZ2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKENvbnNvbGVNYW5hZ2VyLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBDb25zb2xlTWFuYWdlcigkZWwpIHtcbiAgICB2YXIgYXBwO1xuICAgIENvbnNvbGVNYW5hZ2VyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIGFwcCA9IG5ldyBuYW5vYm94LkNvbnNvbGUoJGVsKTtcbiAgfVxuXG4gIHJldHVybiBDb25zb2xlTWFuYWdlcjtcblxufSkoTWFuYWdlcik7XG4iLCJ2YXIgTWFuYWdlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBNYW5hZ2VyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBNYW5hZ2VyKCkge31cblxuICBNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7fTtcblxuICByZXR1cm4gTWFuYWdlcjtcblxufSkoKTtcbiIsInZhciBNYW5hZ2VyLCBQbGF0Zm9ybUNvbXBvbmVudHMsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL21hbmFnZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF0Zm9ybUNvbXBvbmVudHMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGxhdGZvcm1Db21wb25lbnRzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQbGF0Zm9ybUNvbXBvbmVudHMoJGVsLCBwbGF0Zm9ybUNvbXBvbmVudHMsIGZhZGVQYXJlbnRNZXRob2QsIHJlc2l6ZUNiKSB7XG4gICAgdGhpcy5mYWRlUGFyZW50TWV0aG9kID0gZmFkZVBhcmVudE1ldGhvZDtcbiAgICB0aGlzLnJlc2l6ZUNiID0gcmVzaXplQ2I7XG4gICAgdGhpcy5yZXNldFZpZXcgPSBiaW5kKHRoaXMucmVzZXRWaWV3LCB0aGlzKTtcbiAgICB0aGlzLnNob3dDb21wb25lbnRBZG1pbiA9IGJpbmQodGhpcy5zaG93Q29tcG9uZW50QWRtaW4sIHRoaXMpO1xuICAgIFBsYXRmb3JtQ29tcG9uZW50cy5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmNyZWF0ZUNvbXBvbmVudHMoJGVsLCBwbGF0Zm9ybUNvbXBvbmVudHMpO1xuICB9XG5cbiAgUGxhdGZvcm1Db21wb25lbnRzLnByb3RvdHlwZS5jcmVhdGVDb21wb25lbnRzID0gZnVuY3Rpb24oJGVsLCBwbGF0Zm9ybUNvbXBvbmVudHMpIHtcbiAgICB2YXIgY29tcG9uZW50LCBjb21wb25lbnREYXRhLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgdGhpcy5jb21wb25lbnRzID0gW107XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBsYXRmb3JtQ29tcG9uZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50RGF0YSA9IHBsYXRmb3JtQ29tcG9uZW50c1tpXTtcbiAgICAgIGNvbXBvbmVudCA9IG5ldyBuYW5vYm94LlBsYXRmb3JtQ29tcG9uZW50KCRlbCwgY29tcG9uZW50RGF0YS5raW5kLCBjb21wb25lbnREYXRhLmlkKTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZShcIm1pbmlcIik7XG4gICAgICBjb21wb25lbnQub24oXCJzaG93LWFkbWluXCIsIHRoaXMuc2hvd0NvbXBvbmVudEFkbWluKTtcbiAgICAgIGNvbXBvbmVudC5vbihcImNsb3NlLWRldGFpbC12aWV3XCIsIHRoaXMucmVzZXRWaWV3KTtcbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgUGxhdGZvcm1Db21wb25lbnRzLnByb3RvdHlwZS5zaG93Q29tcG9uZW50QWRtaW4gPSBmdW5jdGlvbihlLCBpZCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudHMgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5mYWRlUGFyZW50TWV0aG9kKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29tcG9uZW50LCBpLCBsZW4sIHJlZjtcbiAgICAgICAgcmVmID0gX3RoaXMuY29tcG9uZW50cztcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgY29tcG9uZW50ID0gcmVmW2ldO1xuICAgICAgICAgIGlmIChpZCA9PT0gY29tcG9uZW50LmNvbXBvbmVudElkKSB7XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUoXCJmdWxsXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfdGhpcy5yZXNpemVDYigpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSwgZmFsc2UsIGZhbHNlKTtcbiAgfTtcblxuICBQbGF0Zm9ybUNvbXBvbmVudHMucHJvdG90eXBlLnJlc2V0VmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudHMgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5mYWRlUGFyZW50TWV0aG9kKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29tcG9uZW50LCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVmID0gX3RoaXMuY29tcG9uZW50cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBjb21wb25lbnQgPSByZWZbaV07XG4gICAgICAgICAgY29tcG9uZW50LnNldFN0YXRlKFwibWluaVwiKTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goX3RoaXMucmVzaXplQ2IoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpLCBmYWxzZSwgZmFsc2UpO1xuICB9O1xuXG4gIFBsYXRmb3JtQ29tcG9uZW50cy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21wb25lbnQsIGksIGxlbiwgcmVmO1xuICAgIHJlZiA9IHRoaXMuY29tcG9uZW50cztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudCA9IHJlZltpXTtcbiAgICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgfVxuICAgIFBsYXRmb3JtQ29tcG9uZW50cy5fX3N1cGVyX18uZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudHMgPSBudWxsO1xuICB9O1xuXG4gIHJldHVybiBQbGF0Zm9ybUNvbXBvbmVudHM7XG5cbn0pKE1hbmFnZXIpO1xuIiwidmFyIE1hbmFnZXIsIFNhdmVyLCBTY2FsZU1hbmFnZXIsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL21hbmFnZXInKTtcblxuU2F2ZXIgPSByZXF1aXJlKCdzYXZlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjYWxlTWFuYWdlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChTY2FsZU1hbmFnZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFNjYWxlTWFuYWdlcigkZWwsIHNlcnZlclNwZWNzSWQsIGN1cnJlbnRUb3RhbCkge1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHRoaXMub25DYW5jZWwgPSBiaW5kKHRoaXMub25DYW5jZWwsIHRoaXMpO1xuICAgIHRoaXMub25TYXZlID0gYmluZCh0aGlzLm9uU2F2ZSwgdGhpcyk7XG4gICAgdGhpcy5vbkluc3RhbmNlVG90YWxDaGFuZ2UgPSBiaW5kKHRoaXMub25JbnN0YW5jZVRvdGFsQ2hhbmdlLCB0aGlzKTtcbiAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlID0gYmluZCh0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLCB0aGlzKTtcbiAgICBpZiAoY3VycmVudFRvdGFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuc2NhbGVNYWNoaW5lID0gbmV3IG5hbm9ib3guU2NhbGVNYWNoaW5lKHRoaXMuJGVsLCBzZXJ2ZXJTcGVjc0lkLCB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLCB0aGlzLm9uSW5zdGFuY2VUb3RhbENoYW5nZSwgY3VycmVudFRvdGFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zY2FsZU1hY2hpbmUgPSBuZXcgbmFub2JveC5TY2FsZU1hY2hpbmUodGhpcy4kZWwsIHNlcnZlclNwZWNzSWQsIHRoaXMub25TZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH1cbiAgICBTY2FsZU1hbmFnZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBTY2FsZU1hbmFnZXIucHJvdG90eXBlLnNob3dTYXZlciA9IGZ1bmN0aW9uKCRlbCkge1xuICAgIHZhciBzYXZlcjtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICBpZiAodGhpcy5zYXZlVmlzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNhdmVWaXNpYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gc2F2ZXIgPSBuZXcgU2F2ZXIodGhpcy4kZWwsIHRoaXMub25TYXZlLCB0aGlzLm9uQ2FuY2VsKTtcbiAgfTtcblxuICBTY2FsZU1hbmFnZXIucHJvdG90eXBlLm9uU2VsZWN0aW9uQ2hhbmdlID0gZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG4gICAgY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5zaG93U2F2ZXIodGhpcy4kZWwpO1xuICB9O1xuXG4gIFNjYWxlTWFuYWdlci5wcm90b3R5cGUub25JbnN0YW5jZVRvdGFsQ2hhbmdlID0gZnVuY3Rpb24oaW5zdGFuY2VzKSB7XG4gICAgY29uc29sZS5sb2coXCJcIiArIGluc3RhbmNlcyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd1NhdmVyKHRoaXMuJGVsKTtcbiAgfTtcblxuICBTY2FsZU1hbmFnZXIucHJvdG90eXBlLm9uU2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb25zb2xlLmxvZyhcInNhdmUgaXQhXCIpO1xuICB9O1xuXG4gIFNjYWxlTWFuYWdlci5wcm90b3R5cGUub25DYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNhdmVWaXNpYmxlID0gZmFsc2U7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKFwiY2FuY2VsIGl0IVwiKTtcbiAgfTtcblxuICByZXR1cm4gU2NhbGVNYW5hZ2VyO1xuXG59KShNYW5hZ2VyKTtcbiIsInZhciBNYW5hZ2VyLCBTcGxpdE1hbmFnZXIsIHNwbGl0LFxuICBiaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbk1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9tYW5hZ2VyJyk7XG5cbnNwbGl0ID0gcmVxdWlyZSgnamFkZS9zcGxpdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwbGl0TWFuYWdlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChTcGxpdE1hbmFnZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFNwbGl0TWFuYWdlcigkZWwsIGlzSG9yaXpvbnRhbCwgaGlkZUNiKSB7XG4gICAgdmFyIGFwcCwgYnVua0hvdXNlcztcbiAgICB0aGlzLmhpZGVDYiA9IGhpZGVDYjtcbiAgICB0aGlzLm9uQ2FuY2VsID0gYmluZCh0aGlzLm9uQ2FuY2VsLCB0aGlzKTtcbiAgICBidW5rSG91c2VzID0gW1xuICAgICAge1xuICAgICAgICBpZDogXCJhXCIsXG4gICAgICAgIG5hbWU6IFwiRUMyIDFcIixcbiAgICAgICAgY3VycmVudDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBpZDogXCJiXCIsXG4gICAgICAgIG5hbWU6IFwiRUMyIDJcIlxuICAgICAgfSwge1xuICAgICAgICBpZDogXCJjXCIsXG4gICAgICAgIG5hbWU6IFwiRUMyIDNcIlxuICAgICAgfVxuICAgIF07XG4gICAgYXBwID0gbmV3IG5hbm9ib3guU3BsaXR0ZXIoJGVsLCBpc0hvcml6b250YWwsIGJ1bmtIb3VzZXMsIHRoaXMub25TdWJtaXQsIHRoaXMub25DYW5jZWwpO1xuICAgIFNwbGl0TWFuYWdlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIFNwbGl0TWFuYWdlci5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbigpIHt9O1xuXG4gIFNwbGl0TWFuYWdlci5wcm90b3R5cGUub25DYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oaWRlQ2IoKTtcbiAgfTtcblxuICByZXR1cm4gU3BsaXRNYW5hZ2VyO1xuXG59KShNYW5hZ2VyKTtcbiIsInZhciBNYW5hZ2VyLCBTdGF0c01hbmFnZXIsIHN0YXRzV3JhcHBlcixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbk1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9tYW5hZ2VyJyk7XG5cbnN0YXRzV3JhcHBlciA9IHJlcXVpcmUoJ2phZGUvc3RhdHMtd3JhcHBlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzTWFuYWdlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChTdGF0c01hbmFnZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFN0YXRzTWFuYWdlcigkZWwsIGtpbmQpIHtcbiAgICB2YXIgJGJyZWFrZG93biwgJGhvdXJseUF2ZXJhZ2UsICRob3VybHlTdGF0cywgJHN0YXRzV3JhcHBlciwgZXhwYW5kZWQsIGhvdXJseTtcbiAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgICRzdGF0c1dyYXBwZXIgPSAkKHN0YXRzV3JhcHBlcih7XG4gICAgICBraW5kOiB0aGlzLmtpbmRcbiAgICB9KSk7XG4gICAgJGVsLmFwcGVuZCgkc3RhdHNXcmFwcGVyKTtcbiAgICAkaG91cmx5QXZlcmFnZSA9ICQoXCIuaG91cmx5LWF2Z3Mtd3JhcFwiLCAkc3RhdHNXcmFwcGVyKTtcbiAgICAkaG91cmx5U3RhdHMgPSAkKFwiLmhvdXJseS1zdGF0cy13cmFwXCIsICRzdGF0c1dyYXBwZXIpO1xuICAgICRicmVha2Rvd24gPSAkKFwiLmJyZWFrZG93bi13cmFwXCIsICRzdGF0c1dyYXBwZXIpO1xuICAgIGhvdXJseSA9IG5ldyBuYW5vYm94LkhvdXJseUF2ZXJhZ2UoJGhvdXJseUF2ZXJhZ2UpO1xuICAgIGhvdXJseS5idWlsZCgpO1xuICAgIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoXCJleHBhbmRlZFwiLCAkaG91cmx5U3RhdHMpO1xuICAgIGV4cGFuZGVkLmJ1aWxkKCk7XG4gIH1cblxuICByZXR1cm4gU3RhdHNNYW5hZ2VyO1xuXG59KShNYW5hZ2VyKTtcbiIsInZhciBMaW5lQW5pbWF0b3IsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmVBbmltYXRvciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTGluZUFuaW1hdG9yKCRlbCwgY29tcG9uZW50S2luZCwgYW5pbWF0aW9uS2luZCwgbWVzc2FnZSkge1xuICAgIHZhciAkc3ZnLCBzdmdJZDtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICB0aGlzLmRlc3Ryb3lUaWNrID0gYmluZCh0aGlzLmRlc3Ryb3lUaWNrLCB0aGlzKTtcbiAgICB0aGlzLmJ1aWxkVGljayA9IGJpbmQodGhpcy5idWlsZFRpY2ssIHRoaXMpO1xuICAgIHRoaXMuc2V0Q3Jvc3NQbGF0Zm9ybSgpO1xuICAgIHN2Z0lkID0gdGhpcy5nZXRTdmdJZChjb21wb25lbnRLaW5kKTtcbiAgICAkc3ZnID0gJChcIjxpbWcgY2xhc3M9J3NoYWRvdy1pY29uJyBkYXRhLXNyYz0nXCIgKyBzdmdJZCArIFwiJyAvPlwiKTtcbiAgICB0aGlzLiRlbC5hcHBlbmQoJHN2Zyk7XG4gICAgY2FzdFNoYWRvd3ModGhpcy4kZWwpO1xuICAgIHRoaXMucGF0aCA9ICQoJ3BhdGgnLCB0aGlzLiRlbClbMF07XG4gICAgdGhpcy5wYXRoLnN0eWxlWydzdHJva2UtZGFzaG9mZnNldCddID0gMzAwMDtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uKGFuaW1hdGlvbktpbmQpO1xuICB9XG5cbiAgTGluZUFuaW1hdG9yLnByb3RvdHlwZS5idWlsZFRpY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgaW5jLCBpdGVtLCBqLCBsZW4sIHJlZjtcbiAgICBpZiAodGhpcy5kYXNoQXJyYXlbMV0gPiA4MCkge1xuICAgICAgcmVmID0gdGhpcy5kYXNoQXJyYXk7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9IGogKz0gMikge1xuICAgICAgICBpdGVtID0gcmVmW2ldO1xuICAgICAgICBpZiAodGhpcy5kYXNoQXJyYXlbaSArIDFdID4gODApIHtcbiAgICAgICAgICBpbmMgPSBNYXRoLnJhbmRvbSgpIC8gMjtcbiAgICAgICAgICB0aGlzLmRhc2hBcnJheVtpXSArPSBpbmM7XG4gICAgICAgICAgdGhpcy5kYXNoQXJyYXlbaSArIDFdIC09IGluYztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhdGguc3R5bGVbJ3N0cm9rZS1kYXNoYXJyYXknXSA9IHRoaXMuZGFzaEFycmF5O1xuICAgIHRoaXMucGF0aC5zdHlsZVsnc3Ryb2tlLWRhc2hvZmZzZXQnXSA9IHRoaXMub2Zmc2V0ICs9IHRoaXMuc3BlZWQ7XG4gICAgcmV0dXJuIHRoaXMudGlja0lkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYnVpbGRUaWNrKTtcbiAgfTtcblxuICBMaW5lQW5pbWF0b3IucHJvdG90eXBlLmRlc3Ryb3lUaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGluYywgaXRlbSwgaiwgbGVuLCByZWY7XG4gICAgaWYgKHRoaXMuZGFzaEFycmF5WzBdID4gMTEpIHtcbiAgICAgIHJlZiA9IHRoaXMuZGFzaEFycmF5O1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSBqICs9IDIpIHtcbiAgICAgICAgaXRlbSA9IHJlZltpXTtcbiAgICAgICAgaWYgKHRoaXMuZGFzaEFycmF5W2kgKyAxXSA+IDgwKSB7XG4gICAgICAgICAgaW5jID0gTWF0aC5yYW5kb20oKSAvIDM7XG4gICAgICAgICAgdGhpcy5kYXNoQXJyYXlbaV0gLT0gaW5jO1xuICAgICAgICAgIHRoaXMuZGFzaEFycmF5W2kgKyAxXSArPSBpbmM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYXRoLnN0eWxlWydzdHJva2UtZGFzaGFycmF5J10gPSB0aGlzLmRhc2hBcnJheTtcbiAgICB0aGlzLnBhdGguc3R5bGVbJ3N0cm9rZS1kYXNob2Zmc2V0J10gPSB0aGlzLm9mZnNldCArPSB0aGlzLnNwZWVkO1xuICAgIHJldHVybiB0aGlzLnRpY2tJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRlc3Ryb3lUaWNrKTtcbiAgfTtcblxuICBMaW5lQW5pbWF0b3IucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnRpY2tJZCk7XG4gICAgdGhpcy5wYXRoID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcy4kZWwuZW1wdHkoKTtcbiAgfTtcblxuICBMaW5lQW5pbWF0b3IucHJvdG90eXBlLnN0YXJ0QW5pbWF0aW9uID0gZnVuY3Rpb24oYW5pbWF0aW9uS2luZCkge1xuICAgIGlmIChhbmltYXRpb25LaW5kID09PSAnYnVpbGQnKSB7XG4gICAgICB0aGlzLmRhc2hBcnJheSA9IFsyLCA4MDAsIDIsIDYwMCwgMiwgNDAwXTtcbiAgICAgIHRoaXMucGF0aC5zdHlsZVsnc3Ryb2tlLWRhc2hhcnJheSddID0gdGhpcy5kYXNoQXJyYXk7XG4gICAgICB0aGlzLnNwZWVkID0gODtcbiAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkVGljaygpO1xuICAgIH0gZWxzZSBpZiAoYW5pbWF0aW9uS2luZCA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICB0aGlzLmRhc2hBcnJheSA9IFsxNjAsIDEwMF07XG4gICAgICB0aGlzLnBhdGguc3R5bGVbJ3N0cm9rZS1kYXNoYXJyYXknXSA9IHRoaXMuZGFzaEFycmF5O1xuICAgICAgdGhpcy5wYXRoLnN0eWxlWydzdHJva2UnXSA9ICcjRDJEMkQyJztcbiAgICAgIHRoaXMuc3BlZWQgPSA2O1xuICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgcmV0dXJuIHRoaXMuZGVzdHJveVRpY2soKTtcbiAgICB9XG4gIH07XG5cbiAgTGluZUFuaW1hdG9yLnByb3RvdHlwZS5nZXRTdmdJZCA9IGZ1bmN0aW9uKGNvbXBvbmVudEtpbmQpIHtcbiAgICBjb25zb2xlLmxvZyhjb21wb25lbnRLaW5kKTtcbiAgICBzd2l0Y2ggKGNvbXBvbmVudEtpbmQpIHtcbiAgICAgIGNhc2UgJ2hvc3QnOlxuICAgICAgY2FzZSAnY2x1c3Rlcic6XG4gICAgICAgIHJldHVybiAnaG9zdC1zaWx2ZXJpbmcnO1xuICAgICAgY2FzZSAnY29tcG9uZW50JzpcbiAgICAgICAgcmV0dXJuICdjb21wb25lbnQtc2lsdmVyaW5nJztcbiAgICB9XG4gIH07XG5cbiAgTGluZUFuaW1hdG9yLnByb3RvdHlwZS5zZXRDcm9zc1BsYXRmb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzLCB2ZW5kb3I7XG4gICAgaWYgKHdpbmRvdy5jcm9zc1BsYXRmb3JtQWxyZWFkeVNldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuY3Jvc3NQbGF0Zm9ybUFscmVhZHlTZXQgPSB0cnVlO1xuICAgIHJlZiA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgdmVuZG9yID0gcmVmW2pdO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93W3ZlbmRvciArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvd1t2ZW5kb3IgKyBcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdIHx8IHdpbmRvd1t2ZW5kb3IgKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9IG51bGwpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgcmV0dXJuIExpbmVBbmltYXRvcjtcblxufSkoKTtcbiIsInZhciBXaW5kb3dTY3JvbGxlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dTY3JvbGxlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gV2luZG93U2Nyb2xsZXIoKSB7XG4gICAgaWYgKHdpbmRvdy5fX3dpbmRfc2Nyb2xsZXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHdpbmRvdy5fX3dpbmRfc2Nyb2xsZXIgPSB0aGlzO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NDUk9MTF9UTycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnNjcm9sbFdpbmRvd1RvKGRhdGEsIDQ4MCwgNjAwLCAyMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuXG4gIFdpbmRvd1Njcm9sbGVyLnByb3RvdHlwZS5zY3JvbGxXaW5kb3dUbyA9IGZ1bmN0aW9uKCRlbCwgZGVsYXksIGR1cmF0aW9uLCB0b3BQYWRkaW5nKSB7XG4gICAgdmFyIHRvcDtcbiAgICBpZiAoZGVsYXkgPT0gbnVsbCkge1xuICAgICAgZGVsYXkgPSAwO1xuICAgIH1cbiAgICBpZiAoZHVyYXRpb24gPT0gbnVsbCkge1xuICAgICAgZHVyYXRpb24gPSA1MDA7XG4gICAgfVxuICAgIGlmICh0b3BQYWRkaW5nID09IG51bGwpIHtcbiAgICAgIHRvcFBhZGRpbmcgPSAwO1xuICAgIH1cbiAgICB0b3AgPSAkZWwub2Zmc2V0KCkudG9wIC0gdG9wUGFkZGluZztcbiAgICBpZiAoJCgnYm9keScpLmhlaWdodCgpIC0gdG9wIDwgdG9wKSB7XG4gICAgICB0b3AgPSAkKCdib2R5JykuaGVpZ2h0KCkgLSB0b3A7XG4gICAgfVxuICAgIGlmICh0b3AgIT09IHRvcFBhZGRpbmcpIHtcbiAgICAgIHJldHVybiAkKCdodG1sLGJvZHknKS52ZWxvY2l0eSgnc2Nyb2xsJywge1xuICAgICAgICBkZWxheTogZGVsYXksXG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgb2Zmc2V0OiB0b3AsXG4gICAgICAgIGVhc2luZzogJ2Vhc2VJbk91dFF1aW50J1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIFdpbmRvd1Njcm9sbGVyLnByb3RvdHlwZS5zY3JvbGxXaW5kb3d0b0Z1dHVyZVNpemUgPSBmdW5jdGlvbigkZWwsIGRlbGF5LCBkdXJhdGlvbiwgdG9wUGFkZGluZywgcHJvamVjdGVkSGVpZ2h0KSB7XG4gICAgdmFyIGJvZHlIZWlnaHQsIHRvcCwgd2luZG93SGVpZ2h0O1xuICAgIGlmIChkZWxheSA9PSBudWxsKSB7XG4gICAgICBkZWxheSA9IDA7XG4gICAgfVxuICAgIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7XG4gICAgICBkdXJhdGlvbiA9IDUwMDtcbiAgICB9XG4gICAgaWYgKHByb2plY3RlZEhlaWdodCA9PSBudWxsKSB7XG4gICAgICBwcm9qZWN0ZWRIZWlnaHQgPSAwO1xuICAgIH1cbiAgICB0b3AgPSAkZWwub2Zmc2V0KCkudG9wIC0gdG9wUGFkZGluZztcbiAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpICsgcHJvamVjdGVkSGVpZ2h0O1xuICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICBpZiAoYm9keUhlaWdodCAtIHRvcCA8IHdpbmRvd0hlaWdodCkge1xuICAgICAgdG9wID0gYm9keUhlaWdodCAtIHdpbmRvd0hlaWdodDtcbiAgICB9XG4gICAgaWYgKGJvZHlIZWlnaHQgPiB3aW5kb3dIZWlnaHQpIHtcbiAgICAgIHJldHVybiAkKCdodG1sLGJvZHknKS5kZWxheShkZWxheSkudmVsb2NpdHkoe1xuICAgICAgICBzY3JvbGxUb3A6IHRvcFxuICAgICAgfSwge1xuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIGVhc2luZzogXCJlYXNlSW5PdXRRdWludFwiXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFdpbmRvd1Njcm9sbGVyO1xuXG59KSgpO1xuIiwidmFyIFNhdmVyLCBzYXZlcjtcblxuc2F2ZXIgPSByZXF1aXJlKCdqYWRlL3NhdmVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2F2ZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFNhdmVyKCRlbCwgb25TYXZlQ2IsIG9uQ2FuY2VsQ2IpIHtcbiAgICB2YXIgJG5vZGU7XG4gICAgdGhpcy5vbkNhbmNlbENiID0gb25DYW5jZWxDYjtcbiAgICAkbm9kZSA9ICQoc2F2ZXIoe30pKTtcbiAgICAkZWwuYXBwZW5kKCRub2RlKTtcbiAgICAkKFwiLnNhdmUtYnRuXCIsICRub2RlKS5vbignY2xpY2snLCBvblNhdmVDYik7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkbm9kZS5hZGRDbGFzcygnb3BlbicpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICByZXR1cm4gU2F2ZXI7XG5cbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiYWRtaW5cXFwiPjxpbWcgZGF0YS1zcmM9XFxcImFkbWluLW9jdG9wdXNcXFwiIGNsYXNzPVxcXCJzaGFkb3ctaWNvblxcXCIvPjxkaXYgY2xhc3M9XFxcImluZm9cXFwiPjxkaXYgY2xhc3M9XFxcInRpdGxlXFxcIj5BZG1pbjwvZGl2PjxkaXYgY2xhc3M9XFxcInR4dFxcXCI+Q29ubmVjdGlvbiBDcmVkZW50aWFscywgUmVuYW1pbmcsIGV0Yy4uPC9kaXY+PGEgaHJlZj1cXFwiI1xcXCI+QWRtaW4gdGhpcyBDb21wb25lbnQ8L2E+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKG5hdiwgdW5kZWZpbmVkKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImJveC1uYXZcXFwiPlwiKTtcbi8vIGl0ZXJhdGUgbmF2XG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG5hdjtcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyICRpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgJGluZGV4IDwgJCRsOyAkaW5kZXgrKykge1xuICAgICAgdmFyIGl0ZW0gPSAkJG9ialskaW5kZXhdO1xuXG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWV2ZW50XCIsIFwiXCIgKyAoaXRlbS5ldmVudCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcIm5hdi1pdGVtXFxcIj48ZGl2IGNsYXNzPVxcXCJpY29uXFxcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1zcmNcIiwgXCJuYXYtXCIgKyAoaXRlbS5pY29uKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB4dHJhPVxcXCIyXFxcIiBjbGFzcz1cXFwic2hhZG93LWljb25cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGl0ZW0udHh0KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgJGluZGV4IGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgaXRlbSA9ICQkb2JqWyRpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtZXZlbnRcIiwgXCJcIiArIChpdGVtLmV2ZW50KSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibmF2LWl0ZW1cXFwiPjxkaXYgY2xhc3M9XFxcImljb25cXFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJkYXRhLXNyY1wiLCBcIm5hdi1cIiArIChpdGVtLmljb24pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHh0cmE9XFxcIjJcXFwiIGNsYXNzPVxcXCJzaGFkb3ctaWNvblxcXCIvPjwvZGl2PjxkaXYgY2xhc3M9XFxcInRleHRcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaXRlbS50eHQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuYnVmLnB1c2goXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJuYXZcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm5hdjp0eXBlb2YgbmF2IT09XCJ1bmRlZmluZWRcIj9uYXY6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGNsdXN0ZXJOYW1lLCBzZXJ2aWNlVHlwZSwgdG90YWxNZW1iZXJzKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImJveCBjbHVzdGVyLWJveFxcXCI+PGRpdiBjbGFzcz1cXFwibWFpbi1jb250ZW50XFxcIj48ZGl2IGNsYXNzPVxcXCJhbmltYXRpb25cXFwiPjxkaXYgY2xhc3M9XFxcInN2Zy1ob2xkZXJcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInRpdGxlXFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ3aGl0ZS1ib3hcXFwiPjxkaXYgY2xhc3M9XFxcImlkXFxcIj48ZGl2IGNsYXNzPVxcXCJuYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGNsdXN0ZXJOYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJzZXJ2aWNlLW5hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc2VydmljZVR5cGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImNvbXBvbmVudFxcXCI+PGRpdlwiICsgKGphZGUuY2xzKFsnc2VydmljZS1pY29uJyxcIlwiICsgKHNlcnZpY2VUeXBlKSArIFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+PGltZ1wiICsgKGphZGUuYXR0cihcImRhdGEtc3JjXCIsIFwiaGV4LVwiICsgKHNlcnZpY2VUeXBlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBzY2FsYWJsZT1cXFwidHJ1ZVxcXCIgeHRyYT1cXFwiMlxcXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwidG90YWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdG90YWxNZW1iZXJzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJzdGF0c1xcXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibmF2LWhvbGRlclxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwic3ViXFxcIj48ZGl2IGNsYXNzPVxcXCJzdWItY29udGVudFxcXCI+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiY2x1c3Rlck5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNsdXN0ZXJOYW1lOnR5cGVvZiBjbHVzdGVyTmFtZSE9PVwidW5kZWZpbmVkXCI/Y2x1c3Rlck5hbWU6dW5kZWZpbmVkLFwic2VydmljZVR5cGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnNlcnZpY2VUeXBlOnR5cGVvZiBzZXJ2aWNlVHlwZSE9PVwidW5kZWZpbmVkXCI/c2VydmljZVR5cGU6dW5kZWZpbmVkLFwidG90YWxNZW1iZXJzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50b3RhbE1lbWJlcnM6dHlwZW9mIHRvdGFsTWVtYmVycyE9PVwidW5kZWZpbmVkXCI/dG90YWxNZW1iZXJzOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKG5hbWUsIHNlcnZpY2VUeXBlKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImJveCBjb21wb25lbnQtYm94XFxcIj48ZGl2IGNsYXNzPVxcXCJtYWluLWNvbnRlbnRcXFwiPjxkaXYgY2xhc3M9XFxcImFuaW1hdGlvblxcXCI+PGRpdiBjbGFzcz1cXFwic3ZnLWhvbGRlclxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwidGl0bGVcXFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIndoaXRlLWJveFxcXCI+PGRpdiBjbGFzcz1cXFwiY29ybmVyLWJveFxcXCI+PGltZyBkYXRhLXNyYz1cXFwiY29ybmVyLWJnXFxcIiBjbGFzcz1cXFwic2hhZG93LWljb25cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJpZFxcXCI+PGRpdiBjbGFzcz1cXFwibmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJzZXJ2aWNlLW5hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc2VydmljZVR5cGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInN0YXRzXFxcIj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJzZXJ2aWNlLWJ1Z1xcXCI+IDxkaXYgY2xhc3M9XFxcImJnLWhleFxcXCI+PC9kaXY+PGltZ1wiICsgKGphZGUuYXR0cihcImRhdGEtc3JjXCIsIFwiaGV4LVwiICsgKHNlcnZpY2VUeXBlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwic2hhZG93LWljb25cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJuYXYtaG9sZGVyXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJzdWJcXFwiPjxkaXYgY2xhc3M9XFxcInN1Yi1jb250ZW50XFxcIj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJuYW1lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5uYW1lOnR5cGVvZiBuYW1lIT09XCJ1bmRlZmluZWRcIj9uYW1lOnVuZGVmaW5lZCxcInNlcnZpY2VUeXBlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zZXJ2aWNlVHlwZTp0eXBlb2Ygc2VydmljZVR5cGUhPT1cInVuZGVmaW5lZFwiP3NlcnZpY2VUeXBlOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGFwcENvbXBvbmVudHMsIG5hbWUsIHVuZGVmaW5lZCkge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJib3ggaG9zdC1ib3hcXFwiPjxkaXYgY2xhc3M9XFxcIm1haW4tY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwiYW5pbWF0aW9uXFxcIj48ZGl2IGNsYXNzPVxcXCJzdmctaG9sZGVyXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwid2hpdGUtYm94XFxcIj48ZGl2IGNsYXNzPVxcXCJuYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG5hbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcInNlcnZpY2UtaWNvbnNcXFwiPlwiKTtcbi8vIGl0ZXJhdGUgYXBwQ29tcG9uZW50c1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBhcHBDb21wb25lbnRzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgJGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyAkaW5kZXggPCAkJGw7ICRpbmRleCsrKSB7XG4gICAgICB2YXIgc2VydmljZSA9ICQkb2JqWyRpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuY2xzKFsnc2VydmljZS1pY29uJyxcIlwiICsgKHNlcnZpY2Uuc2VydmljZVR5cGUpICsgXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1zcmNcIiwgXCJoZXgtXCIgKyAoc2VydmljZS5zZXJ2aWNlVHlwZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgc2NhbGFibGU9XFxcInRydWVcXFwiIHh0cmE9XFxcIjJcXFwiIGNsYXNzPVxcXCJzaGFkb3ctaWNvblxcXCIvPjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBzZXJ2aWNlID0gJCRvYmpbJGluZGV4XTtcblxuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5jbHMoWydzZXJ2aWNlLWljb24nLFwiXCIgKyAoc2VydmljZS5zZXJ2aWNlVHlwZSkgKyBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJkYXRhLXNyY1wiLCBcImhleC1cIiArIChzZXJ2aWNlLnNlcnZpY2VUeXBlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBzY2FsYWJsZT1cXFwidHJ1ZVxcXCIgeHRyYT1cXFwiMlxcXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjwvZGl2PjxkaXYgY2xhc3M9XFxcInN0YXRzXFxcIj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJuYXYtaG9sZGVyXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJzdWJcXFwiPjxkaXYgY2xhc3M9XFxcInN1Yi1jb250ZW50XFxcIj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJhcHBDb21wb25lbnRzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hcHBDb21wb25lbnRzOnR5cGVvZiBhcHBDb21wb25lbnRzIT09XCJ1bmRlZmluZWRcIj9hcHBDb21wb25lbnRzOnVuZGVmaW5lZCxcIm5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm5hbWU6dHlwZW9mIG5hbWUhPT1cInVuZGVmaW5lZFwiP25hbWU6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInNhdmVyXFxcIj48ZGl2IGNsYXNzPVxcXCJzYXZlLWJ0blxcXCI+U2F2ZTwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJzcGxpdC1ob2xkZXJcXFwiPjxkaXYgY2xhc3M9XFxcInRlbXBcXFwiPlRoZSBwcm9jZXNzIG9mIHNwbGl0dGluZyBhIGNvbXBvbmVudCBvbnRvIGEgZGlmZmVyZW50IGhvc3Qgd2lsbCBnbyBoZXJlLjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChraW5kKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInN0YXRzLXdyYXBwZXJcXFwiPjxkaXYgY2xhc3M9XFxcImhvdXJseVxcXCI+PGRpdiBjbGFzcz1cXFwiaG91cmx5LWF2Z3Mtd3JhcFxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwiaG91cmx5LXN0YXRzLXdyYXBcXFwiPjwvZGl2PjwvZGl2PlwiKTtcbmlmICgga2luZCA9PSBcImhvc3RcIilcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiYnJlYWtkb3duLXdyYXBcXFwiPjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwia2luZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgua2luZDp0eXBlb2Yga2luZCE9PVwidW5kZWZpbmVkXCI/a2luZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSJdfQ==
