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

  SplitManager.prototype.onSubmit = function(data) {
    console.log("We probably need to broadcast this data out to rails somehow.. Probably with pubsub");
    return console.log(data);
  };

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

    for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
      var service = $$obj[i];

if ( i < 3 || ( i==3 && appComponents.length == 4 ))
{
buf.push("<div" + (jade.cls(['service-icon',"" + (service.serviceType) + ""], [null,true])) + "><img" + (jade.attr("data-src", "hex-" + (service.serviceType) + "", true, false)) + " scalable=\"true\" xtra=\"2\" class=\"shadow-icon\"/></div>");
}
    }

  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;      var service = $$obj[i];

if ( i < 3 || ( i==3 && appComponents.length == 4 ))
{
buf.push("<div" + (jade.cls(['service-icon',"" + (service.serviceType) + ""], [null,true])) + "><img" + (jade.attr("data-src", "hex-" + (service.serviceType) + "", true, false)) + " scalable=\"true\" xtra=\"2\" class=\"shadow-icon\"/></div>");
}
    }

  }
}).call(this);

if ( appComponents.length > 4)
{
buf.push("<div class=\"service-icon empty\"><img data-src=\"hex-empty\" scalable=\"true\" xtra=\"2\" class=\"shadow-icon\"/><div class=\"txt\"><div class=\"num\">" + (jade.escape((jade_interp = appComponents.length-3) == null ? '' : jade_interp)) + " </div><span>more</span></div></div>");
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYm94LW5hdi5jb2ZmZWUiLCJib3hlcy9ib3guY29mZmVlIiwiYm94ZXMvY2x1c3Rlci1ib3guY29mZmVlIiwiYm94ZXMvY29tcG9uZW50LWdlbmVyYXRpb24tYm94LmNvZmZlZSIsImJveGVzL2hvc3QtYm94LmNvZmZlZSIsImJveGVzL3BsYXRmb3JtLWNvbXBvbmVudC1ib3guY29mZmVlIiwibWFpbi5jb2ZmZWUiLCJtYW5hZ2Vycy9hZG1pbi1tYW5hZ2VyLmNvZmZlZSIsIm1hbmFnZXJzL2FwcC1jb21wb25lbnRzLmNvZmZlZSIsIm1hbmFnZXJzL2NvbnNvbGUtbWFuYWdlci5jb2ZmZWUiLCJtYW5hZ2Vycy9tYW5hZ2VyLmNvZmZlZSIsIm1hbmFnZXJzL3BsYXRmb3JtLWNvbXBvbmVudHMuY29mZmVlIiwibWFuYWdlcnMvc2NhbGUtbWFuYWdlci5jb2ZmZWUiLCJtYW5hZ2Vycy9zcGxpdC1tYW5hZ2VyLmNvZmZlZSIsIm1hbmFnZXJzL3N0YXRzLW1hbmFnZXIuY29mZmVlIiwibWlzYy9saW5lLWFuaW1hdG9yLmNvZmZlZSIsIm1pc2Mvd2luZG93LXNjcm9sbGVyLmNvZmZlZSIsInNhdmVyLmNvZmZlZSIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL2FkbWluLmpzIiwiLi4vLi4vc2VydmVyL2pzL2phZGUvYm94LW5hdi5qcyIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL2NsdXN0ZXItYm94LmpzIiwiLi4vLi4vc2VydmVyL2pzL2phZGUvY29tcG9uZW50LWJveC5qcyIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL2hvc3QtYm94LmpzIiwiLi4vLi4vc2VydmVyL2pzL2phZGUvc2F2ZXIuanMiLCIuLi8uLi9zZXJ2ZXIvanMvamFkZS9zcGxpdC5qcyIsIi4uLy4uL3NlcnZlci9qcy9qYWRlL3N0YXRzLXdyYXBwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEJveE5hdiwgYm94TmF2O1xuXG5ib3hOYXYgPSByZXF1aXJlKCdqYWRlL2JveC1uYXYnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb3hOYXYgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEJveE5hdigkZWwsIG5hdkl0ZW1zLCBpZCkge1xuICAgIHZhciAkbm9kZTtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgJG5vZGUgPSAkKGJveE5hdih7XG4gICAgICBuYXY6IG5hdkl0ZW1zXG4gICAgfSkpO1xuICAgICRlbC5hcHBlbmQoJG5vZGUpO1xuICAgICQoXCIubmF2LWl0ZW1cIiwgJG5vZGUpLm9uKFwiY2xpY2tcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMub25DbGljayhlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1ldmVudFwiKSwgZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG5cbiAgQm94TmF2LnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQsIGVsKSB7XG4gICAgcmV0dXJuIFB1YlN1Yi5wdWJsaXNoKGV2ZW50LCB7XG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIGVsOiBlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBCb3hOYXY7XG5cbn0pKCk7XG4iLCJ2YXIgQWRtaW5NYW5hZ2VyLCBBcHBDb21wb25lbnRzLCBCb3gsIENvbnNvbGVNYW5hZ2VyLCBMaW5lQW5pbWF0b3IsIFBsYXRmb3JtQ29tcG9uZW50cywgU2NhbGVNYW5hZ2VyLCBTcGxpdE1hbmFnZXIsIFN0YXRzTWFuYWdlcixcbiAgYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cblN0YXRzTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL3N0YXRzLW1hbmFnZXInKTtcblxuQ29uc29sZU1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9jb25zb2xlLW1hbmFnZXInKTtcblxuUGxhdGZvcm1Db21wb25lbnRzID0gcmVxdWlyZSgnbWFuYWdlcnMvcGxhdGZvcm0tY29tcG9uZW50cycpO1xuXG5BcHBDb21wb25lbnRzID0gcmVxdWlyZSgnbWFuYWdlcnMvYXBwLWNvbXBvbmVudHMnKTtcblxuU2NhbGVNYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvc2NhbGUtbWFuYWdlcicpO1xuXG5BZG1pbk1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9hZG1pbi1tYW5hZ2VyJyk7XG5cblNwbGl0TWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL3NwbGl0LW1hbmFnZXInKTtcblxuTGluZUFuaW1hdG9yID0gcmVxdWlyZSgnbWlzYy9saW5lLWFuaW1hdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm94ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBCb3goJG5vZGUsIGRhdGExKSB7XG4gICAgdGhpcy4kbm9kZSA9ICRub2RlO1xuICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgIHRoaXMuY2xvc2VTdWJDb250ZW50ID0gYmluZCh0aGlzLmNsb3NlU3ViQ29udGVudCwgdGhpcyk7XG4gICAgdGhpcy5yZXNpemVTdWJDb250ZW50ID0gYmluZCh0aGlzLnJlc2l6ZVN1YkNvbnRlbnQsIHRoaXMpO1xuICAgIHRoaXMuaGlkZUN1cnJlbnRTdWJDb250ZW50ID0gYmluZCh0aGlzLmhpZGVDdXJyZW50U3ViQ29udGVudCwgdGhpcyk7XG4gICAgRXZlbnRpZnkuZXh0ZW5kKHRoaXMpO1xuICAgIHRoaXMuaWQgPSB0aGlzLmRhdGEuaWQ7XG4gICAgY2FzdFNoYWRvd3ModGhpcy4kbm9kZSk7XG4gICAgdGhpcy4kc3ViQ29udGVudCA9ICQoXCIuc3ViLWNvbnRlbnRcIiwgdGhpcy4kbm9kZSk7XG4gICAgdGhpcy4kc3ViID0gJChcIi5zdWJcIiwgdGhpcy4kbm9kZSk7XG4gICAgdGhpcy5mYWRlT3V0RHVyYXRpb24gPSAzMDA7XG4gICAgdGhpcy5hbmltYXRlRHVyYXRpb24gPSAyNTA7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmRhdGEuc3RhdGUpO1xuICB9XG5cbiAgQm94LnByb3RvdHlwZS5hZGRBcHBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2coXCJUaGlzIGlzIG5vdCBhIGhvc3QsIGFuZCBjYW5ub3QgYWRkIGFwcCBjb21wb25lbnRzXCIpO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuaGFzQ29tcG9uZW50V2l0aElkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuaGFzR2VuZXJhdGlvbldpdGhJZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnN3aXRjaFN1YkNvbnRlbnQgPSBmdW5jdGlvbihuZXdTdWJTdGF0ZSwgY2xpY2tlZE5hdkJ0bikge1xuICAgIHRoaXMuY2xpY2tlZE5hdkJ0biA9IGNsaWNrZWROYXZCdG47XG4gICAgaWYgKHRoaXMuc3ViU3RhdGUgPT09IG5ld1N1YlN0YXRlKSB7XG4gICAgICB0aGlzLmNsb3NlU3ViQ29udGVudCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN1YlN0YXRlID0gbmV3U3ViU3RhdGU7XG4gICAgd2luZG93LnN1YiA9IHRoaXMuJHN1YkNvbnRlbnRbMF07XG4gICAgcmV0dXJuIHRoaXMuaGlkZUN1cnJlbnRTdWJDb250ZW50KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2l0Y2ggKF90aGlzLnN1YlN0YXRlKSB7XG4gICAgICAgICAgY2FzZSAnc3RhdHMnOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBTdGF0c01hbmFnZXIoX3RoaXMuJHN1YkNvbnRlbnQsIF90aGlzLmtpbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnY29uc29sZSc6XG4gICAgICAgICAgICBfdGhpcy5zdWJNYW5hZ2VyID0gbmV3IENvbnNvbGVNYW5hZ2VyKF90aGlzLiRzdWJDb250ZW50LCBfdGhpcy5raW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3BsYXRmb3JtLWNvbXBvbmVudHMnOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBQbGF0Zm9ybUNvbXBvbmVudHMoX3RoaXMuJHN1YkNvbnRlbnQsIF90aGlzLmRhdGEucGxhdGZvcm1Db21wb25lbnRzLCBfdGhpcy5oaWRlQ3VycmVudFN1YkNvbnRlbnQsIF90aGlzLnJlc2l6ZVN1YkNvbnRlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2NhbGUtbWFjaGluZSc6XG4gICAgICAgICAgICBfdGhpcy5zdWJNYW5hZ2VyID0gbmV3IFNjYWxlTWFuYWdlcihfdGhpcy4kc3ViQ29udGVudCwgX3RoaXMuZGF0YS5zZXJ2ZXJTcGVjc0lkLCBfdGhpcy50b3RhbE1lbWJlcnMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYXBwLWNvbXBvbmVudHMnOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBBcHBDb21wb25lbnRzKF90aGlzLiRzdWJDb250ZW50LCBfdGhpcy5kYXRhLmFwcENvbXBvbmVudHMsIF90aGlzLnJlc2l6ZVN1YkNvbnRlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWRtaW4nOlxuICAgICAgICAgICAgX3RoaXMuc3ViTWFuYWdlciA9IG5ldyBBZG1pbk1hbmFnZXIoX3RoaXMuJHN1YkNvbnRlbnQsIF90aGlzLmRhdGEuYXBwQ29tcG9uZW50cywgX3RoaXMucmVzaXplU3ViQ29udGVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzcGxpdCc6XG4gICAgICAgICAgICBfdGhpcy5zdWJNYW5hZ2VyID0gbmV3IFNwbGl0TWFuYWdlcihfdGhpcy4kc3ViQ29udGVudCwgX3RoaXMuY29tcG9uZW50RGF0YS5zY2FsZXNIb3JpeiwgX3RoaXMuY2xvc2VTdWJDb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5wb3NpdGlvbkFycm93KF90aGlzLmNsaWNrZWROYXZCdG4sIF90aGlzLnN1YlN0YXRlKTtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlc2l6ZVN1YkNvbnRlbnQoX3RoaXMuc3ViU3RhdGUpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5oYXNHZW5lcmF0aW9uV2l0aElkID0gZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbiwgaSwgaiwgbGVuLCBsZW4xLCByZWYsIHJlZjE7XG4gICAgcmVmID0gdGhpcy5kYXRhLmFwcENvbXBvbmVudHM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gcmVmW2ldO1xuICAgICAgcmVmMSA9IGNvbXBvbmVudERhdGEuZ2VuZXJhdGlvbnM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgZ2VuZXJhdGlvbiA9IHJlZjFbal07XG4gICAgICAgIGlmIChnZW5lcmF0aW9uLmlkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnNldEdlbmVyYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgIHZhciBjb21wb25lbnREYXRhLCBnZW5lcmF0aW9uLCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICByZWYgPSB0aGlzLmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gcmVmW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGosIGxlbjEsIHJlZjEsIHJlc3VsdHMxO1xuICAgICAgICByZWYxID0gY29tcG9uZW50RGF0YS5nZW5lcmF0aW9ucztcbiAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgZ2VuZXJhdGlvbiA9IHJlZjFbal07XG4gICAgICAgICAgaWYgKGlkID09PSBnZW5lcmF0aW9uLmlkKSB7XG4gICAgICAgICAgICBnZW5lcmF0aW9uLnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICBpZiAodGhpcy5zdWJTdGF0ZSA9PT0gJ2FwcC1jb21wb25lbnRzJykge1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKHRoaXMuc3ViTWFuYWdlci51cGRhdGVHZW5lcmF0aW9uU3RhdGUoaWQsIHN0YXRlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMxLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgfSkuY2FsbCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuaGlkZUN1cnJlbnRTdWJDb250ZW50ID0gZnVuY3Rpb24oY2IsIGRvRGVzdHJveUN1cnJlbnRDb250ZW50LCBkb0NhbGxSZXNpemVCZWZvcmVDYikge1xuICAgIHZhciBtZTtcbiAgICBpZiAoZG9EZXN0cm95Q3VycmVudENvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgZG9EZXN0cm95Q3VycmVudENvbnRlbnQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZG9DYWxsUmVzaXplQmVmb3JlQ2IgPT0gbnVsbCkge1xuICAgICAgZG9DYWxsUmVzaXplQmVmb3JlQ2IgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zZXRIZWlnaHRUb0NvbnRlbnQoKTtcbiAgICBpZiAodGhpcy5zdWJNYW5hZ2VyID09IG51bGwpIHtcbiAgICAgIGNiKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lID0gdGhpcztcbiAgICB0aGlzLiRzdWJDb250ZW50LmNzcyh7XG4gICAgICBvcGFjaXR5OiAwXG4gICAgfSk7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoZG9EZXN0cm95Q3VycmVudENvbnRlbnQpIHtcbiAgICAgICAgbWUuZGVzdHJveVN1Ykl0ZW0oKTtcbiAgICAgIH1cbiAgICAgIGlmIChkb0NhbGxSZXNpemVCZWZvcmVDYikge1xuICAgICAgICByZXR1cm4gbWUucmVzaXplU3ViQ29udGVudChudWxsLCBjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzLmZhZGVPdXREdXJhdGlvbik7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5yZXNpemVTdWJDb250ZW50ID0gZnVuY3Rpb24oY3NzQ2xhc3MsIGNiKSB7XG4gICAgUHViU3ViLnB1Ymxpc2goJ1NDUk9MTF9UTycsIHRoaXMuJG5vZGUpO1xuICAgIGlmIChjc3NDbGFzcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLiRzdWJDb250ZW50LmFkZENsYXNzKGNzc0NsYXNzKTtcbiAgICB9XG4gICAgdGhpcy5zZXRIZWlnaHRUb0NvbnRlbnQoKTtcbiAgICB0aGlzLiRzdWIuYWRkQ2xhc3MoXCJoYXMtY29udGVudFwiKTtcbiAgICBzZXRUaW1lb3V0KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy4kc3ViLmNzcyh7XG4gICAgICAgICAgaGVpZ2h0OiAnaW5pdGlhbCdcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLiRzdWJDb250ZW50LmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNiICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSh0aGlzKSwgdGhpcy5hbmltYXRlRHVyYXRpb24pO1xuICAgIHJldHVybiB0aGlzLmZpcmUoXCJyZXNpemVcIiwgdGhpcyk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5jbG9zZVN1YkNvbnRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEhlaWdodFRvQ29udGVudCgpO1xuICAgIHRoaXMuJHN1YkNvbnRlbnQuY3NzKHtcbiAgICAgIG9wYWNpdHk6IDBcbiAgICB9KTtcbiAgICB0aGlzLiRzdWIucmVtb3ZlQ2xhc3MoXCJoYXMtY29udGVudFwiKTtcbiAgICBzZXRUaW1lb3V0KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5zdWJTdGF0ZSA9IFwiXCI7XG4gICAgICAgIHJldHVybiBfdGhpcy5kZXN0cm95U3ViSXRlbSgpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSwgdGhpcy5hbmltYXRlRHVyYXRpb24pO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuJHN1Yi5jc3Moe1xuICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcyksIDIwKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmRlc3Ryb3lTdWJJdGVtID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3ViTWFuYWdlciA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3ViTWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy4kc3ViQ29udGVudC5lbXB0eSgpO1xuICAgIHRoaXMuJHN1YkNvbnRlbnQuYXR0cignY2xhc3MnLCBcInN1Yi1jb250ZW50XCIpO1xuICAgIHJldHVybiB0aGlzLnN1Yk1hbmFnZXIgPSBudWxsO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUucmVtb3ZlU3ViQ29udGVudEFuaW1hdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kc3ViLmFkZENsYXNzKFwibm8tdHJhbnNpdGlvblwiKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24oc3RhdGUsIHN0YXR1cywgbWVzc2FnZUNvZGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHRoaXMuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSAnY3JlYXRlZCc6XG4gICAgICBjYXNlICdpbml0aWFsaXplZCc6XG4gICAgICBjYXNlICdvcmRlcmVkJzpcbiAgICAgIGNhc2UgJ3Byb3Zpc2lvbmluZyc6XG4gICAgICBjYXNlICdkZWZ1bmN0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW5nU3RhdGUoJ2J1aWxkJywgdGhpcy5nZXRTdGF0ZU1lc3NhZ2UodGhpcy5zdGF0ZSkpO1xuICAgICAgY2FzZSAnYWN0aXZlJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlU3RhdGUoKTtcbiAgICAgIGNhc2UgJ2RlY29taXNzaW9uaW5nJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW5nU3RhdGUoJ2Rlc3Ryb3knLCB0aGlzLmdldFN0YXRlTWVzc2FnZSh0aGlzLnN0YXRlKSk7XG4gICAgICBjYXNlICdhcmNoaXZlZCc6XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5hbmltYXRpbmdTdGF0ZSA9IGZ1bmN0aW9uKGFuaW1hdGlvbktpbmQsIG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25LaW5kID09PSBhbmltYXRpb25LaW5kKSB7XG4gICAgICAkKCcuYW5pbWF0aW9uIC50aXRsZScsIHRoaXMuJG5vZGUpLnRleHQobWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYW5pbWF0aW9uS2luZCA9IGFuaW1hdGlvbktpbmQ7XG4gICAgICB0aGlzLmNsb3NlU3ViQ29udGVudCgpO1xuICAgICAgcmV0dXJuIHRoaXMuZmFkZU91dE1haW5Db250ZW50KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHh0cmE7XG4gICAgICAgICAgeHRyYSA9IF90aGlzLiRub2RlLmlzKCc6bGFzdC1jaGlsZCcpID8gMTUgOiAwO1xuICAgICAgICAgIF90aGlzLiRub2RlLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IF90aGlzLiRub2RlLmhlaWdodCgpICsgeHRyYVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIF90aGlzLmRlc3Ryb3lBbnlBbmltYXRpb24oKTtcbiAgICAgICAgICAkKCcuYW5pbWF0aW9uIC50aXRsZScsIF90aGlzLiRub2RlKS50ZXh0KG1lc3NhZ2UpO1xuICAgICAgICAgIF90aGlzLmxpbmVBbmltYXRpb24gPSBuZXcgTGluZUFuaW1hdG9yKCQoJy5hbmltYXRpb24gLnN2Zy1ob2xkZXInLCBfdGhpcy4kbm9kZSksIF90aGlzLmtpbmQsIF90aGlzLmFuaW1hdGlvbktpbmQpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5zZXRTdGF0ZUNsYXNzQW5kRmFkZUluKCdhbmltYXRpbmcnKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5hY3RpdmVTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5pbWF0aW9uS2luZCA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuZmFkZU91dE1haW5Db250ZW50KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy4kbm9kZS5jc3Moe1xuICAgICAgICAgIGhlaWdodDogXCJpbml0aWFsXCJcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLmRlc3Ryb3lBbnlBbmltYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIF90aGlzLnNldFN0YXRlQ2xhc3NBbmRGYWRlSW4oJ2FjdGl2ZScpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5lcnJvcmVkU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zd2l0Y2hNYWluVmlld1N0YXRlKCdlcnJvcmVkJyk7XG4gIH07XG5cbiAgQm94LnByb3RvdHlwZS5zZXRTdGF0ZUNsYXNzQW5kRmFkZUluID0gZnVuY3Rpb24oY3NzQ2xhc3MpIHtcbiAgICB0aGlzLmhhc0NvbnRlbnQgPSB0cnVlO1xuICAgIHRoaXMuJG5vZGUucmVtb3ZlQ2xhc3MoJ2J1aWxkaW5nIGFjdGl2ZSBlcnJvcmVkIGFuaW1hdGluZycpO1xuICAgIHRoaXMuJG5vZGUuYWRkQ2xhc3MoY3NzQ2xhc3MpO1xuICAgIHJldHVybiAkKFwiLm1haW4tY29udGVudFwiLCB0aGlzLiRub2RlKS5jc3Moe1xuICAgICAgb3BhY2l0eTogMVxuICAgIH0pO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuZGVzdHJveUFueUFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmxpbmVBbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5saW5lQW5pbWF0aW9uLmRlc3Ryb3koKTtcbiAgICAgIHJldHVybiB0aGlzLmxpbmVBbmltYXRpb24gPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmZhZGVPdXRNYWluQ29udGVudCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbnRlbnQpIHtcbiAgICAgIGNiKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICQoXCIubWFpbi1jb250ZW50XCIsIHRoaXMuJG5vZGUpLmNzcyh7XG4gICAgICBvcGFjaXR5OiAwXG4gICAgfSk7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2IoKTtcbiAgICB9LCAyNTApO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuc2V0SGVpZ2h0VG9Db250ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJHN1Yi5jc3Moe1xuICAgICAgaGVpZ2h0OiB0aGlzLiRzdWJDb250ZW50WzBdLm9mZnNldEhlaWdodFxuICAgIH0pO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUucG9zaXRpb25BcnJvdyA9IGZ1bmN0aW9uKGVsLCBjc3NDbGFzcykge1xuICAgIHZhciAkYXJyb3dQb2ludGVyLCAkZWw7XG4gICAgJGVsID0gJChlbCk7XG4gICAgJGFycm93UG9pbnRlciA9ICQoXCI8ZGl2IGNsYXNzPSdhcnJvdy1wb2ludGVyJy8+XCIpO1xuICAgIHRoaXMuJHN1YkNvbnRlbnQuYXBwZW5kKCRhcnJvd1BvaW50ZXIpO1xuICAgICRhcnJvd1BvaW50ZXIuY3NzKHtcbiAgICAgIGxlZnQ6ICRlbC5vZmZzZXQoKS5sZWZ0ICsgJChcIi50ZXh0XCIsIGVsKS53aWR0aCgpIC8gMiAtIDFcbiAgICB9KTtcbiAgICBpZiAoY3NzQ2xhc3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICRhcnJvd1BvaW50ZXIuYWRkQ2xhc3MoY3NzQ2xhc3MpO1xuICAgIH1cbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmdldFN0YXRlTWVzc2FnZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgY2FzZSAnY3JlYXRlZCc6XG4gICAgICAgIHJldHVybiB0aGlzLmlkICsgXCIgOiBDcmVhdGluZ1wiO1xuICAgICAgY2FzZSAnaW5pdGlhbGl6ZWQnOlxuICAgICAgICByZXR1cm4gdGhpcy5pZCArIFwiIDogSW5pdGlhbGl6aW5nXCI7XG4gICAgICBjYXNlICdvcmRlcmVkJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgKyBcIiA6IE9yZGVyaW5nXCI7XG4gICAgICBjYXNlICdwcm92aXNpb25pbmcnOlxuICAgICAgICByZXR1cm4gdGhpcy5pZCArIFwiIDogUHJvdmlzaW9uaW5nXCI7XG4gICAgICBjYXNlICdkZWZ1bmN0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgKyBcIiA6IERlZnVuY3RcIjtcbiAgICAgIGNhc2UgJ2RlY29taXNzaW9uaW5nJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgKyBcIiA6IERlY29taXNzaW9uaW5nXCI7XG4gICAgfVxuICB9O1xuXG4gIEJveC5wcm90b3R5cGUuYnVpbGRTdGF0cyA9IGZ1bmN0aW9uKCRlbCkge1xuICAgIHZhciBzdGF0VHlwZXM7XG4gICAgdGhpcy5zdGF0cyA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCdzdGFuZGFyZCcsICRlbCk7XG4gICAgc3RhdFR5cGVzID0gW1xuICAgICAge1xuICAgICAgICBpZDogXCJjcHVfdXNlZFwiLFxuICAgICAgICBuaWNrbmFtZTogXCJDUFVcIixcbiAgICAgICAgbmFtZTogXCJDUFUgVXNlZFwiXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInJhbV91c2VkXCIsXG4gICAgICAgIG5pY2tuYW1lOiBcIlJBTVwiLFxuICAgICAgICBuYW1lOiBcIlJBTSBVc2VkXCJcbiAgICAgIH0sIHtcbiAgICAgICAgaWQ6IFwic3dhcF91c2VkXCIsXG4gICAgICAgIG5pY2tuYW1lOiBcIlNXQVBcIixcbiAgICAgICAgbmFtZTogXCJTd2FwIFVzZWRcIlxuICAgICAgfSwge1xuICAgICAgICBpZDogXCJkaXNrX3VzZWRcIixcbiAgICAgICAgbmlja25hbWU6IFwiRElTS1wiLFxuICAgICAgICBuYW1lOiBcIkRpc2sgVXNlZFwiXG4gICAgICB9XG4gICAgXTtcbiAgICByZXR1cm4gdGhpcy5zdGF0cy5idWlsZCgpO1xuICB9O1xuXG4gIEJveC5wcm90b3R5cGUudXBkYXRlTGl2ZVN0YXRzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRzLnVwZGF0ZUxpdmVTdGF0cyhkYXRhKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLnVwZGF0ZUhpc3RvcmljU3RhdHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHMudXBkYXRlSGlzdG9yaWNTdGF0cyhkYXRhKTtcbiAgfTtcblxuICBCb3gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWU7XG4gICAgdGhpcy4kbm9kZS5jc3Moe1xuICAgICAgaGVpZ2h0OiB0aGlzLiRub2RlLmhlaWdodCgpXG4gICAgfSk7XG4gICAgbWUgPSB0aGlzO1xuICAgIHRoaXMuJG5vZGUuYWRkQ2xhc3MoJ2ZhZGVkJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBtZS4kbm9kZS5hZGRDbGFzcygnYXJjaGl2ZWQnKTtcbiAgICB9LCAzMDApO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuJG5vZGUucmVtb3ZlKCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpLCA3NTApO1xuICB9O1xuXG4gIHJldHVybiBCb3g7XG5cbn0pKCk7XG4iLCJ2YXIgQm94LCBCb3hOYXYsIENsdXN0ZXJCb3gsIGNsdXN0ZXJCb3gsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5Cb3ggPSByZXF1aXJlKCdib3hlcy9ib3gnKTtcblxuQm94TmF2ID0gcmVxdWlyZSgnYm94LW5hdicpO1xuXG5jbHVzdGVyQm94ID0gcmVxdWlyZSgnamFkZS9jbHVzdGVyLWJveCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsdXN0ZXJCb3ggPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQ2x1c3RlckJveCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQ2x1c3RlckJveCgkZWwsIGRhdGEpIHtcbiAgICB2YXIgJG5vZGU7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmtpbmQgPSBcImNsdXN0ZXJcIjtcbiAgICB0aGlzLmRhdGEuY2x1c3Rlck5hbWUgPSB0aGlzLm1ha2VDbHVzdGVyTmFtZSh0aGlzLmRhdGEuaW5zdGFuY2VzKTtcbiAgICB0aGlzLnRvdGFsTWVtYmVycyA9IHRoaXMuZGF0YS50b3RhbE1lbWJlcnMgPSB0aGlzLmRhdGEuaW5zdGFuY2VzLmxlbmd0aDtcbiAgICAkbm9kZSA9ICQoY2x1c3RlckJveCh0aGlzLmRhdGEpKTtcbiAgICAkZWwuYXBwZW5kKCRub2RlKTtcbiAgICB0aGlzLmJ1aWxkTmF2KCRub2RlKTtcbiAgICBDbHVzdGVyQm94Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICRub2RlLCB0aGlzLmRhdGEpO1xuICAgIFB1YlN1Yi5wdWJsaXNoKCdSRUdJU1RFUi5DTFVTVEVSJywgdGhpcyk7XG4gICAgdGhpcy5idWlsZFN0YXRzKCQoXCIuc3RhdHNcIiwgJG5vZGUpKTtcbiAgfVxuXG4gIENsdXN0ZXJCb3gucHJvdG90eXBlLmJ1aWxkTmF2ID0gZnVuY3Rpb24oJG5vZGUpIHtcbiAgICB2YXIgbmF2SXRlbXM7XG4gICAgbmF2SXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIHR4dDogXCJBcHAgQ29tcG9uZW50XCIsXG4gICAgICAgIGljb246ICdhcHAtY29tcG9uZW50JyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLkFQUF9DT01QT05FTlRTJ1xuICAgICAgfSwge1xuICAgICAgICB0eHQ6IFwiU2NhbGVcIixcbiAgICAgICAgaWNvbjogJ3NjYWxlJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLlNDQUxFJ1xuICAgICAgfSwge1xuICAgICAgICB0eHQ6IFwiU3RhdHNcIixcbiAgICAgICAgaWNvbjogJ3N0YXRzJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLlNUQVRTJ1xuICAgICAgfVxuICAgIF07XG4gICAgcmV0dXJuIHRoaXMubmF2ID0gbmV3IEJveE5hdigkKCcubmF2LWhvbGRlcicsICRub2RlKSwgbmF2SXRlbXMsIHRoaXMuZGF0YS5pZCk7XG4gIH07XG5cbiAgQ2x1c3RlckJveC5wcm90b3R5cGUubWFrZUNsdXN0ZXJOYW1lID0gZnVuY3Rpb24oaW5zdGFuY2VzKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlc1swXS5ob3N0TmFtZSArIFwiIC0gXCIgKyBpbnN0YW5jZXNbaW5zdGFuY2VzLmxlbmd0aCAtIDFdLmhvc3ROYW1lO1xuICB9O1xuXG4gIENsdXN0ZXJCb3gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIucHVibGlzaCgnVU5SRUdJU1RFUi5DTFVTVEVSJywgdGhpcyk7XG4gICAgcmV0dXJuIENsdXN0ZXJCb3guX19zdXBlcl9fLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgfTtcblxuICByZXR1cm4gQ2x1c3RlckJveDtcblxufSkoQm94KTtcbiIsInZhciBCb3gsIEJveE5hdiwgQ29tcG9uZW50R2VuZXJhdGlvbkJveCwgY29tcG9uZW50Qm94LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQm94ID0gcmVxdWlyZSgnYm94ZXMvYm94Jyk7XG5cbkJveE5hdiA9IHJlcXVpcmUoJ2JveC1uYXYnKTtcblxuY29tcG9uZW50Qm94ID0gcmVxdWlyZSgnamFkZS9jb21wb25lbnQtYm94Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50R2VuZXJhdGlvbkJveCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChDb21wb25lbnRHZW5lcmF0aW9uQm94LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBDb21wb25lbnRHZW5lcmF0aW9uQm94KCRlbCwgZGF0YSkge1xuICAgIHZhciAkbm9kZSwgY29tcGlsZWREYXRhO1xuICAgIHRoaXMua2luZCA9IFwiY29tcG9uZW50XCI7XG4gICAgdGhpcy5jb21wb25lbnREYXRhID0gZGF0YS5jb21wb25lbnREYXRhO1xuICAgIHRoaXMuZ2VuZXJhdGlvbkRhdGEgPSBkYXRhLmdlbmVyYXRpb25EYXRhO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuY29tcG9uZW50RGF0YTtcbiAgICBjb21waWxlZERhdGEgPSB7XG4gICAgICBpZDogdGhpcy5nZW5lcmF0aW9uRGF0YS5pZCxcbiAgICAgIHN0YXRlOiB0aGlzLmdlbmVyYXRpb25EYXRhLnN0YXRlXG4gICAgfTtcbiAgICAkbm9kZSA9ICQoY29tcG9uZW50Qm94KHRoaXMuY29tcG9uZW50RGF0YSkpO1xuICAgICRlbC5hcHBlbmQoJG5vZGUpO1xuICAgIHRoaXMuYnVpbGRBcHBDb21wb25lbnROYXYoJG5vZGUpO1xuICAgIFB1YlN1Yi5wdWJsaXNoKCdSRUdJU1RFUi5BUFBfQ09NUE9ORU5UJywgdGhpcyk7XG4gICAgQ29tcG9uZW50R2VuZXJhdGlvbkJveC5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkbm9kZSwgY29tcGlsZWREYXRhKTtcbiAgICB0aGlzLmJ1aWxkU3RhdHMoJChcIi5zdGF0c1wiLCAkbm9kZSkpO1xuICB9XG5cbiAgQ29tcG9uZW50R2VuZXJhdGlvbkJveC5wcm90b3R5cGUuYnVpbGRBcHBDb21wb25lbnROYXYgPSBmdW5jdGlvbigkbm9kZSkge1xuICAgIHZhciBuYXZJdGVtcztcbiAgICBuYXZJdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdHh0OiBcIkNvbnNvbGVcIixcbiAgICAgICAgaWNvbjogJ2NvbnNvbGUnLFxuICAgICAgICBldmVudDogJ1NIT1cuQ09OU09MRSdcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIlNwbGl0XCIsXG4gICAgICAgIGljb246ICdzcGxpdCcsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5TUExJVCdcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIkFkbWluXCIsXG4gICAgICAgIGljb246ICdhZG1pbicsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5BRE1JTidcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIlN0YXRzXCIsXG4gICAgICAgIGljb246ICdzdGF0cycsXG4gICAgICAgIGV2ZW50OiAnU0hPVy5TVEFUUydcbiAgICAgIH1cbiAgICBdO1xuICAgIHJldHVybiB0aGlzLm5hdiA9IG5ldyBCb3hOYXYoJCgnLm5hdi1ob2xkZXInLCAkbm9kZSksIG5hdkl0ZW1zLCB0aGlzLmdlbmVyYXRpb25EYXRhLmlkKTtcbiAgfTtcblxuICBDb21wb25lbnRHZW5lcmF0aW9uQm94LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnB1Ymxpc2goJ1VOUkVHSVNURVIuQVBQX0NPTVBPTkVOVCcsIHRoaXMpO1xuICAgIHJldHVybiBDb21wb25lbnRHZW5lcmF0aW9uQm94Ll9fc3VwZXJfXy5kZXN0cm95LmNhbGwodGhpcyk7XG4gIH07XG5cbiAgcmV0dXJuIENvbXBvbmVudEdlbmVyYXRpb25Cb3g7XG5cbn0pKEJveCk7XG4iLCJ2YXIgQm94LCBCb3hOYXYsIEhvc3RCb3gsIGhvc3RCb3gsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5Cb3ggPSByZXF1aXJlKCdib3hlcy9ib3gnKTtcblxuQm94TmF2ID0gcmVxdWlyZSgnYm94LW5hdicpO1xuXG5ob3N0Qm94ID0gcmVxdWlyZSgnamFkZS9ob3N0LWJveCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvc3RCb3ggPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoSG9zdEJveCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gSG9zdEJveCgkZWwsIGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMua2luZCA9IFwiaG9zdFwiO1xuICAgIHRoaXMuJG5vZGUgPSAkKGhvc3RCb3godGhpcy5kYXRhKSk7XG4gICAgJGVsLmFwcGVuZCh0aGlzLiRub2RlKTtcbiAgICB0aGlzLmJ1aWxkTmF2KHRoaXMuJG5vZGUpO1xuICAgIEhvc3RCb3guX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgdGhpcy4kbm9kZSwgdGhpcy5kYXRhKTtcbiAgICBQdWJTdWIucHVibGlzaCgnUkVHSVNURVIuSE9TVCcsIHRoaXMpO1xuICAgIHRoaXMuYnVpbGRTdGF0cygkKFwiLnN0YXRzXCIsIHRoaXMuJG5vZGUpKTtcbiAgfVxuXG4gIEhvc3RCb3gucHJvdG90eXBlLmJ1aWxkTmF2ID0gZnVuY3Rpb24oJG5vZGUpIHtcbiAgICB2YXIgbmF2SXRlbXM7XG4gICAgbmF2SXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIHR4dDogXCJQbGF0Zm9ybSBDb21wb25lbnRzXCIsXG4gICAgICAgIGljb246ICdwbGF0Zm9ybS1jb21wb25lbnQnLFxuICAgICAgICBldmVudDogJ1NIT1cuUExBVEZPUk1fQ09NUE9ORU5UUydcbiAgICAgIH0sIHtcbiAgICAgICAgdHh0OiBcIkFwcCBDb21wb25lbnRzXCIsXG4gICAgICAgIGljb246ICdhcHAtY29tcG9uZW50JyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLkFQUF9DT01QT05FTlRTJ1xuICAgICAgfSwge1xuICAgICAgICB0eHQ6IFwiU2NhbGVcIixcbiAgICAgICAgaWNvbjogJ3NjYWxlJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLlNDQUxFJ1xuICAgICAgfSwge1xuICAgICAgICB0eHQ6IFwiU3RhdHNcIixcbiAgICAgICAgaWNvbjogJ3N0YXRzJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLlNUQVRTJ1xuICAgICAgfVxuICAgIF07XG4gICAgcmV0dXJuIHRoaXMubmF2ID0gbmV3IEJveE5hdigkKCcubmF2LWhvbGRlcicsICRub2RlKSwgbmF2SXRlbXMsIHRoaXMuZGF0YS5pZCk7XG4gIH07XG5cbiAgSG9zdEJveC5wcm90b3R5cGUuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50RGF0YSkge1xuICAgIHRoaXMuZGF0YS5hcHBDb21wb25lbnRzLnB1c2goY29tcG9uZW50RGF0YSk7XG4gICAgaWYgKHRoaXMuc3ViU3RhdGUgPT09ICdhcHAtY29tcG9uZW50cycpIHtcbiAgICAgIHJldHVybiB0aGlzLnN1Yk1hbmFnZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudERhdGEpO1xuICAgIH1cbiAgfTtcblxuICBIb3N0Qm94LnByb3RvdHlwZS5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oY29tcG9uZW50SWQsIGdlbmVyYXRpb25EYXRhKSB7XG4gICAgdmFyIGNvbXBvbmVudERhdGEsIGksIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgIHJlZiA9IHRoaXMuZGF0YS5hcHBDb21wb25lbnRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudERhdGEgPSByZWZbaV07XG4gICAgICBpZiAoY29tcG9uZW50RGF0YS5pZCA9PT0gY29tcG9uZW50SWQpIHtcbiAgICAgICAgY29tcG9uZW50RGF0YS5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb25EYXRhKTtcbiAgICAgICAgaWYgKHRoaXMuc3ViU3RhdGUgPT09ICdhcHAtY29tcG9uZW50cycpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zdWJNYW5hZ2VyLmFkZEdlbmVyYXRpb24oY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbkRhdGEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEhvc3RCb3gucHJvdG90eXBlLnNldEdlbmVyYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgIHZhciBjb21wb25lbnREYXRhLCBnZW5lcmF0aW9uLCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICByZWYgPSB0aGlzLmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gcmVmW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGosIGxlbjEsIHJlZjEsIHJlc3VsdHMxO1xuICAgICAgICByZWYxID0gY29tcG9uZW50RGF0YS5nZW5lcmF0aW9ucztcbiAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgZ2VuZXJhdGlvbiA9IHJlZjFbal07XG4gICAgICAgICAgaWYgKGlkID09PSBnZW5lcmF0aW9uLmlkKSB7XG4gICAgICAgICAgICBnZW5lcmF0aW9uLnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICBpZiAodGhpcy5zdWJTdGF0ZSA9PT0gJ2FwcC1jb21wb25lbnRzJykge1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKHRoaXMuc3ViTWFuYWdlci51cGRhdGVHZW5lcmF0aW9uU3RhdGUoaWQsIHN0YXRlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMxLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgfSkuY2FsbCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEhvc3RCb3gucHJvdG90eXBlLmhhc0dlbmVyYXRpb25XaXRoSWQgPSBmdW5jdGlvbihpZCkge1xuICAgIHZhciBjb21wb25lbnREYXRhLCBnZW5lcmF0aW9uLCBpLCBqLCBsZW4sIGxlbjEsIHJlZiwgcmVmMTtcbiAgICByZWYgPSB0aGlzLmRhdGEuYXBwQ29tcG9uZW50cztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudERhdGEgPSByZWZbaV07XG4gICAgICByZWYxID0gY29tcG9uZW50RGF0YS5nZW5lcmF0aW9ucztcbiAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICBnZW5lcmF0aW9uID0gcmVmMVtqXTtcbiAgICAgICAgaWYgKGdlbmVyYXRpb24uaWQgPT09IGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIEhvc3RCb3gucHJvdG90eXBlLmhhc0NvbXBvbmVudFdpdGhJZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGNvbXBvbmVudERhdGEsIGksIGxlbiwgcmVmO1xuICAgIHJlZiA9IHRoaXMuZGF0YS5hcHBDb21wb25lbnRzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50RGF0YSA9IHJlZltpXTtcbiAgICAgIGlmIChjb21wb25lbnREYXRhLmlkID09PSBpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIEhvc3RCb3gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIucHVibGlzaCgnVU5SRUdJU1RFUi5IT1NUJywgdGhpcyk7XG4gICAgcmV0dXJuIEhvc3RCb3guX19zdXBlcl9fLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgfTtcblxuICByZXR1cm4gSG9zdEJveDtcblxufSkoQm94KTtcbiIsInZhciBCb3gsIEJveE5hdiwgUGxhdGZvcm1Db21wb25lbnRCb3gsIGNvbXBvbmVudEJveCxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJveCA9IHJlcXVpcmUoJ2JveGVzL2JveCcpO1xuXG5Cb3hOYXYgPSByZXF1aXJlKCdib3gtbmF2Jyk7XG5cbmNvbXBvbmVudEJveCA9IHJlcXVpcmUoJ2phZGUvY29tcG9uZW50LWJveCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXRmb3JtQ29tcG9uZW50Qm94ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFBsYXRmb3JtQ29tcG9uZW50Qm94LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQbGF0Zm9ybUNvbXBvbmVudEJveCgkZWwsIGRhdGEpIHtcbiAgICB2YXIgJG5vZGU7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmtpbmQgPSBcImNvbXBvbmVudFwiO1xuICAgICRub2RlID0gJChjb21wb25lbnRCb3godGhpcy5kYXRhKSk7XG4gICAgJGVsLmFwcGVuZCgkbm9kZSk7XG4gICAgdGhpcy5idWlsZFBsYXRmb3JtQ29tcG9uZW50TmF2KCRub2RlKTtcbiAgICBQdWJTdWIucHVibGlzaCgnUkVHSVNURVIuUExBVEZPUk1fQ09NUE9ORU5UJywgdGhpcyk7XG4gICAgUGxhdGZvcm1Db21wb25lbnRCb3guX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgJG5vZGUsIHRoaXMuZGF0YSk7XG4gICAgdGhpcy5idWlsZFN0YXRzKCQoXCIuc3RhdHNcIiwgJG5vZGUpKTtcbiAgfVxuXG4gIFBsYXRmb3JtQ29tcG9uZW50Qm94LnByb3RvdHlwZS5idWlsZFBsYXRmb3JtQ29tcG9uZW50TmF2ID0gZnVuY3Rpb24oJG5vZGUpIHtcbiAgICB2YXIgbmF2SXRlbXM7XG4gICAgbmF2SXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIHR4dDogXCJDb25zb2xlXCIsXG4gICAgICAgIGljb246ICdjb25zb2xlJyxcbiAgICAgICAgZXZlbnQ6ICdTSE9XLkNPTlNPTEUnXG4gICAgICB9LCB7XG4gICAgICAgIHR4dDogXCJTdGF0c1wiLFxuICAgICAgICBpY29uOiAnc3RhdHMnLFxuICAgICAgICBldmVudDogJ1NIT1cuU1RBVFMnXG4gICAgICB9XG4gICAgXTtcbiAgICByZXR1cm4gdGhpcy5uYXYgPSBuZXcgQm94TmF2KCQoJy5uYXYtaG9sZGVyJywgJG5vZGUpLCBuYXZJdGVtcywgdGhpcy5kYXRhLmlkKTtcbiAgfTtcblxuICBQbGF0Zm9ybUNvbXBvbmVudEJveC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIFB1YlN1Yi5wdWJsaXNoKCdVTlJFR0lTVEVSLlBMQVRGT1JNX0NPTVBPTkVOVCcsIHRoaXMpO1xuICAgIHJldHVybiBQbGF0Zm9ybUNvbXBvbmVudEJveC5fX3N1cGVyX18uZGVzdHJveS5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIHJldHVybiBQbGF0Zm9ybUNvbXBvbmVudEJveDtcblxufSkoQm94KTtcbiIsInZhciBDbG9iYmVyQm94LCBDbHVzdGVyQm94LCBDb21wb25lbnRHZW5lcmF0aW9uQm94LCBIb3N0Qm94LCBQbGF0Zm9ybUNvbXBvbmVudCwgV2luZG93U2Nyb2xsZXI7XG5cbkhvc3RCb3ggPSByZXF1aXJlKCdib3hlcy9ob3N0LWJveCcpO1xuXG5DbHVzdGVyQm94ID0gcmVxdWlyZSgnYm94ZXMvY2x1c3Rlci1ib3gnKTtcblxuQ29tcG9uZW50R2VuZXJhdGlvbkJveCA9IHJlcXVpcmUoJ2JveGVzL2NvbXBvbmVudC1nZW5lcmF0aW9uLWJveCcpO1xuXG5QbGF0Zm9ybUNvbXBvbmVudCA9IHJlcXVpcmUoJ2JveGVzL3BsYXRmb3JtLWNvbXBvbmVudC1ib3gnKTtcblxuV2luZG93U2Nyb2xsZXIgPSByZXF1aXJlKCdtaXNjL3dpbmRvdy1zY3JvbGxlcicpO1xuXG5DbG9iYmVyQm94ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDbG9iYmVyQm94KCkge1xuICAgIG5ldyBXaW5kb3dTY3JvbGxlcigpO1xuICB9XG5cbiAgQ2xvYmJlckJveC5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigkZWwsIGtpbmQsIGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBDbG9iYmVyQm94LkhPU1Q6XG4gICAgICAgIHRoaXMuYm94ID0gbmV3IEhvc3RCb3goJGVsLCB0aGlzLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ2xvYmJlckJveC5DTFVTVEVSOlxuICAgICAgICB0aGlzLmJveCA9IG5ldyBDbHVzdGVyQm94KCRlbCwgdGhpcy5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENsb2JiZXJCb3guQVBQX0NPTVBPTkVOVF9HRU5FUkFUSU9OOlxuICAgICAgICB0aGlzLmJveCA9IG5ldyBDb21wb25lbnRHZW5lcmF0aW9uQm94KCRlbCwgdGhpcy5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENsb2JiZXJCb3guUExBVEZPUk1fQ09NUE9ORU5UOlxuICAgICAgICB0aGlzLmJveCA9IG5ldyBQbGF0Zm9ybUNvbXBvbmVudCgkZWwsIHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXRzID0gdGhpcy5ib3guc3RhdHM7XG4gIH07XG5cbiAgQ2xvYmJlckJveC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHJldHVybiB0aGlzLmJveC5zZXRTdGF0ZShzdGF0ZSk7XG4gIH07XG5cbiAgQ2xvYmJlckJveC5wcm90b3R5cGUuZG9udEFuaW1hdGVUcmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYm94LnJlbW92ZVN1YkNvbnRlbnRBbmltYXRpb25zKCk7XG4gIH07XG5cbiAgQ2xvYmJlckJveC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmJveC5kZXN0cm95KCk7XG4gIH07XG5cbiAgQ2xvYmJlckJveC5DTFVTVEVSID0gJ2NsdXN0ZXInO1xuXG4gIENsb2JiZXJCb3guSE9TVCA9ICdob3N0JztcblxuICBDbG9iYmVyQm94LlBMQVRGT1JNX0NPTVBPTkVOVCA9ICdwbGF0Zm9ybS1jb21wb25lbnQnO1xuXG4gIENsb2JiZXJCb3guQVBQX0NPTVBPTkVOVF9HRU5FUkFUSU9OID0gJ2FwcC1jb21wb25lbnQtZ2VuZXJhdGlvbic7XG5cbiAgcmV0dXJuIENsb2JiZXJCb3g7XG5cbn0pKCk7XG5cbndpbmRvdy5uYW5vYm94IHx8ICh3aW5kb3cubmFub2JveCA9IHt9KTtcblxubmFub2JveC5DbG9iYmVyQm94ID0gQ2xvYmJlckJveDtcbiIsInZhciBBZG1pbk1hbmFnZXIsIE1hbmFnZXIsIGFkbWluLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL21hbmFnZXInKTtcblxuYWRtaW4gPSByZXF1aXJlKCdqYWRlL2FkbWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWRtaW5NYW5hZ2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFkbWluTWFuYWdlciwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWRtaW5NYW5hZ2VyKCRlbCkge1xuICAgIHZhciAkbm9kZTtcbiAgICAkbm9kZSA9ICQoYWRtaW4oe30pKTtcbiAgICAkZWwuYXBwZW5kKCRub2RlKTtcbiAgICBjYXN0U2hhZG93cyh0aGlzLiRub2RlKTtcbiAgICBBZG1pbk1hbmFnZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICByZXR1cm4gQWRtaW5NYW5hZ2VyO1xuXG59KShNYW5hZ2VyKTtcbiIsInZhciBBcHBDb21wb25lbnRzLCBNYW5hZ2VyLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL21hbmFnZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDb21wb25lbnRzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFwcENvbXBvbmVudHMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFwcENvbXBvbmVudHMoJGVsLCBjb21wb25lbnRzLCByZXNpemVDYikge1xuICAgIHZhciBjb21wb25lbnREYXRhLCBpLCBsZW47XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy5yZXNpemVDYiA9IHJlc2l6ZUNiO1xuICAgIEFwcENvbXBvbmVudHMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0aW9ucyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbXBvbmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudERhdGEgPSBjb21wb25lbnRzW2ldO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoY29tcG9uZW50RGF0YSk7XG4gICAgfVxuICB9XG5cbiAgQXBwQ29tcG9uZW50cy5wcm90b3R5cGUuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50RGF0YSkge1xuICAgIHZhciBnZW5lcmF0aW9uRGF0YSwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgcmVmID0gY29tcG9uZW50RGF0YS5nZW5lcmF0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBnZW5lcmF0aW9uRGF0YSA9IHJlZltpXTtcbiAgICAgIGlmIChnZW5lcmF0aW9uRGF0YS5zdGF0ZSAhPT0gXCJhcmNoaXZlZFwiKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZEdlbmVyYXRpb24oY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbkRhdGEpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBBcHBDb21wb25lbnRzLnByb3RvdHlwZS5hZGRHZW5lcmF0aW9uID0gZnVuY3Rpb24oY29tcG9uZW50RGF0YSwgZ2VuZXJhdGlvbkRhdGEpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbjtcbiAgICBnZW5lcmF0aW9uID0gbmV3IG5hbm9ib3guQ2xvYmJlckJveCgpO1xuICAgIGdlbmVyYXRpb24uYnVpbGQodGhpcy4kZWwsIG5hbm9ib3guQ2xvYmJlckJveC5BUFBfQ09NUE9ORU5UX0dFTkVSQVRJT04sIHtcbiAgICAgIGNvbXBvbmVudERhdGE6IGNvbXBvbmVudERhdGEsXG4gICAgICBnZW5lcmF0aW9uRGF0YTogZ2VuZXJhdGlvbkRhdGFcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5nZW5lcmF0aW9ucy5wdXNoKGdlbmVyYXRpb24pO1xuICB9O1xuXG4gIEFwcENvbXBvbmVudHMucHJvdG90eXBlLnVwZGF0ZUdlbmVyYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKGlkLCBzdGF0ZSkge1xuICAgIHZhciBnZW5lcmF0aW9uLCBpLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICByZWYgPSB0aGlzLmdlbmVyYXRpb25zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGdlbmVyYXRpb24gPSByZWZbaV07XG4gICAgICBpZiAoaWQgPT09IGdlbmVyYXRpb24uYm94LmlkKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChnZW5lcmF0aW9uLmJveC5zZXRTdGF0ZShzdGF0ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEFwcENvbXBvbmVudHMucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ2VuZXJhdGlvbiwgaSwgbGVuLCByZWY7XG4gICAgcmVmID0gdGhpcy5nZW5lcmF0aW9ucztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGdlbmVyYXRpb24gPSByZWZbaV07XG4gICAgICBnZW5lcmF0aW9uLmJveC5vZmYoKTtcbiAgICAgIGdlbmVyYXRpb24uZGVzdHJveSgpO1xuICAgIH1cbiAgICByZXR1cm4gQXBwQ29tcG9uZW50cy5fX3N1cGVyX18uZGVzdHJveS5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIHJldHVybiBBcHBDb21wb25lbnRzO1xuXG59KShNYW5hZ2VyKTtcbiIsInZhciBDb25zb2xlTWFuYWdlciwgTWFuYWdlcixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbk1hbmFnZXIgPSByZXF1aXJlKCdtYW5hZ2Vycy9tYW5hZ2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc29sZU1hbmFnZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQ29uc29sZU1hbmFnZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIENvbnNvbGVNYW5hZ2VyKCRlbCkge1xuICAgIHZhciBhcHA7XG4gICAgQ29uc29sZU1hbmFnZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gICAgYXBwID0gbmV3IG5hbm9ib3guQ29uc29sZSgkZWwpO1xuICB9XG5cbiAgcmV0dXJuIENvbnNvbGVNYW5hZ2VyO1xuXG59KShNYW5hZ2VyKTtcbiIsInZhciBNYW5hZ2VyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbmFnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE1hbmFnZXIoKSB7fVxuXG4gIE1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHt9O1xuXG4gIHJldHVybiBNYW5hZ2VyO1xuXG59KSgpO1xuIiwidmFyIE1hbmFnZXIsIFBsYXRmb3JtQ29tcG9uZW50cyxcbiAgYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5NYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvbWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXRmb3JtQ29tcG9uZW50cyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChQbGF0Zm9ybUNvbXBvbmVudHMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFBsYXRmb3JtQ29tcG9uZW50cygkZWwsIHBsYXRmb3JtQ29tcG9uZW50cywgZmFkZVBhcmVudE1ldGhvZCwgcmVzaXplQ2IpIHtcbiAgICB0aGlzLmZhZGVQYXJlbnRNZXRob2QgPSBmYWRlUGFyZW50TWV0aG9kO1xuICAgIHRoaXMucmVzaXplQ2IgPSByZXNpemVDYjtcbiAgICB0aGlzLnJlc2V0VmlldyA9IGJpbmQodGhpcy5yZXNldFZpZXcsIHRoaXMpO1xuICAgIHRoaXMuc2hvd0NvbXBvbmVudEFkbWluID0gYmluZCh0aGlzLnNob3dDb21wb25lbnRBZG1pbiwgdGhpcyk7XG4gICAgUGxhdGZvcm1Db21wb25lbnRzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlQ29tcG9uZW50cygkZWwsIHBsYXRmb3JtQ29tcG9uZW50cyk7XG4gIH1cblxuICBQbGF0Zm9ybUNvbXBvbmVudHMucHJvdG90eXBlLmNyZWF0ZUNvbXBvbmVudHMgPSBmdW5jdGlvbigkZWwsIHBsYXRmb3JtQ29tcG9uZW50cykge1xuICAgIHZhciBjb21wb25lbnQsIGNvbXBvbmVudERhdGEsIGksIGxlbiwgcmVzdWx0cztcbiAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcGxhdGZvcm1Db21wb25lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb21wb25lbnREYXRhID0gcGxhdGZvcm1Db21wb25lbnRzW2ldO1xuICAgICAgY29tcG9uZW50ID0gbmV3IG5hbm9ib3guUGxhdGZvcm1Db21wb25lbnQoJGVsLCBjb21wb25lbnREYXRhLmtpbmQsIGNvbXBvbmVudERhdGEuaWQpO1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlKFwibWluaVwiKTtcbiAgICAgIGNvbXBvbmVudC5vbihcInNob3ctYWRtaW5cIiwgdGhpcy5zaG93Q29tcG9uZW50QWRtaW4pO1xuICAgICAgY29tcG9uZW50Lm9uKFwiY2xvc2UtZGV0YWlsLXZpZXdcIiwgdGhpcy5yZXNldFZpZXcpO1xuICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBQbGF0Zm9ybUNvbXBvbmVudHMucHJvdG90eXBlLnNob3dDb21wb25lbnRBZG1pbiA9IGZ1bmN0aW9uKGUsIGlkKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50cyA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZhZGVQYXJlbnRNZXRob2QoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQsIGksIGxlbiwgcmVmO1xuICAgICAgICByZWYgPSBfdGhpcy5jb21wb25lbnRzO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBjb21wb25lbnQgPSByZWZbaV07XG4gICAgICAgICAgaWYgKGlkID09PSBjb21wb25lbnQuY29tcG9uZW50SWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZShcImZ1bGxcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzLnJlc2l6ZUNiKCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpLCBmYWxzZSwgZmFsc2UpO1xuICB9O1xuXG4gIFBsYXRmb3JtQ29tcG9uZW50cy5wcm90b3R5cGUucmVzZXRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50cyA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZhZGVQYXJlbnRNZXRob2QoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQsIGksIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZWYgPSBfdGhpcy5jb21wb25lbnRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGNvbXBvbmVudCA9IHJlZltpXTtcbiAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUoXCJtaW5pXCIpO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChfdGhpcy5yZXNpemVDYigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH07XG4gICAgfSkodGhpcyksIGZhbHNlLCBmYWxzZSk7XG4gIH07XG5cbiAgUGxhdGZvcm1Db21wb25lbnRzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbXBvbmVudCwgaSwgbGVuLCByZWY7XG4gICAgcmVmID0gdGhpcy5jb21wb25lbnRzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29tcG9uZW50ID0gcmVmW2ldO1xuICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgUGxhdGZvcm1Db21wb25lbnRzLl9fc3VwZXJfXy5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50cyA9IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIFBsYXRmb3JtQ29tcG9uZW50cztcblxufSkoTWFuYWdlcik7XG4iLCJ2YXIgTWFuYWdlciwgU2F2ZXIsIFNjYWxlTWFuYWdlcixcbiAgYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5NYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvbWFuYWdlcicpO1xuXG5TYXZlciA9IHJlcXVpcmUoJ3NhdmVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2NhbGVNYW5hZ2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFNjYWxlTWFuYWdlciwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gU2NhbGVNYW5hZ2VyKCRlbCwgc2VydmVyU3BlY3NJZCwgY3VycmVudFRvdGFsKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy5vbkNhbmNlbCA9IGJpbmQodGhpcy5vbkNhbmNlbCwgdGhpcyk7XG4gICAgdGhpcy5vblNhdmUgPSBiaW5kKHRoaXMub25TYXZlLCB0aGlzKTtcbiAgICB0aGlzLm9uSW5zdGFuY2VUb3RhbENoYW5nZSA9IGJpbmQodGhpcy5vbkluc3RhbmNlVG90YWxDaGFuZ2UsIHRoaXMpO1xuICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2UgPSBiaW5kKHRoaXMub25TZWxlY3Rpb25DaGFuZ2UsIHRoaXMpO1xuICAgIGlmIChjdXJyZW50VG90YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5zY2FsZU1hY2hpbmUgPSBuZXcgbmFub2JveC5TY2FsZU1hY2hpbmUodGhpcy4kZWwsIHNlcnZlclNwZWNzSWQsIHRoaXMub25TZWxlY3Rpb25DaGFuZ2UsIHRoaXMub25JbnN0YW5jZVRvdGFsQ2hhbmdlLCBjdXJyZW50VG90YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjYWxlTWFjaGluZSA9IG5ldyBuYW5vYm94LlNjYWxlTWFjaGluZSh0aGlzLiRlbCwgc2VydmVyU3BlY3NJZCwgdGhpcy5vblNlbGVjdGlvbkNoYW5nZSk7XG4gICAgfVxuICAgIFNjYWxlTWFuYWdlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIFNjYWxlTWFuYWdlci5wcm90b3R5cGUuc2hvd1NhdmVyID0gZnVuY3Rpb24oJGVsKSB7XG4gICAgdmFyIHNhdmVyO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIGlmICh0aGlzLnNhdmVWaXNpYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2F2ZVZpc2libGUgPSB0cnVlO1xuICAgIHJldHVybiBzYXZlciA9IG5ldyBTYXZlcih0aGlzLiRlbCwgdGhpcy5vblNhdmUsIHRoaXMub25DYW5jZWwpO1xuICB9O1xuXG4gIFNjYWxlTWFuYWdlci5wcm90b3R5cGUub25TZWxlY3Rpb25DaGFuZ2UgPSBmdW5jdGlvbihzZWxlY3Rpb24pIHtcbiAgICBjb25zb2xlLmxvZyhzZWxlY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLnNob3dTYXZlcih0aGlzLiRlbCk7XG4gIH07XG5cbiAgU2NhbGVNYW5hZ2VyLnByb3RvdHlwZS5vbkluc3RhbmNlVG90YWxDaGFuZ2UgPSBmdW5jdGlvbihpbnN0YW5jZXMpIHtcbiAgICBjb25zb2xlLmxvZyhcIlwiICsgaW5zdGFuY2VzKTtcbiAgICByZXR1cm4gdGhpcy5zaG93U2F2ZXIodGhpcy4kZWwpO1xuICB9O1xuXG4gIFNjYWxlTWFuYWdlci5wcm90b3R5cGUub25TYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKFwic2F2ZSBpdCFcIik7XG4gIH07XG5cbiAgU2NhbGVNYW5hZ2VyLnByb3RvdHlwZS5vbkNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2F2ZVZpc2libGUgPSBmYWxzZTtcbiAgICByZXR1cm4gY29uc29sZS5sb2coXCJjYW5jZWwgaXQhXCIpO1xuICB9O1xuXG4gIHJldHVybiBTY2FsZU1hbmFnZXI7XG5cbn0pKE1hbmFnZXIpO1xuIiwidmFyIE1hbmFnZXIsIFNwbGl0TWFuYWdlciwgc3BsaXQsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuTWFuYWdlciA9IHJlcXVpcmUoJ21hbmFnZXJzL21hbmFnZXInKTtcblxuc3BsaXQgPSByZXF1aXJlKCdqYWRlL3NwbGl0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3BsaXRNYW5hZ2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFNwbGl0TWFuYWdlciwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gU3BsaXRNYW5hZ2VyKCRlbCwgaXNIb3Jpem9udGFsLCBoaWRlQ2IpIHtcbiAgICB2YXIgYXBwLCBidW5rSG91c2VzO1xuICAgIHRoaXMuaGlkZUNiID0gaGlkZUNiO1xuICAgIHRoaXMub25DYW5jZWwgPSBiaW5kKHRoaXMub25DYW5jZWwsIHRoaXMpO1xuICAgIGJ1bmtIb3VzZXMgPSBbXG4gICAgICB7XG4gICAgICAgIGlkOiBcImFcIixcbiAgICAgICAgbmFtZTogXCJFQzIgMVwiLFxuICAgICAgICBjdXJyZW50OiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImJcIixcbiAgICAgICAgbmFtZTogXCJFQzIgMlwiXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImNcIixcbiAgICAgICAgbmFtZTogXCJFQzIgM1wiXG4gICAgICB9XG4gICAgXTtcbiAgICBhcHAgPSBuZXcgbmFub2JveC5TcGxpdHRlcigkZWwsIGlzSG9yaXpvbnRhbCwgYnVua0hvdXNlcywgdGhpcy5vblN1Ym1pdCwgdGhpcy5vbkNhbmNlbCk7XG4gICAgU3BsaXRNYW5hZ2VyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgU3BsaXRNYW5hZ2VyLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhcIldlIHByb2JhYmx5IG5lZWQgdG8gYnJvYWRjYXN0IHRoaXMgZGF0YSBvdXQgdG8gcmFpbHMgc29tZWhvdy4uIFByb2JhYmx5IHdpdGggcHVic3ViXCIpO1xuICAgIHJldHVybiBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfTtcblxuICBTcGxpdE1hbmFnZXIucHJvdG90eXBlLm9uQ2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlkZUNiKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwbGl0TWFuYWdlcjtcblxufSkoTWFuYWdlcik7XG4iLCJ2YXIgTWFuYWdlciwgU3RhdHNNYW5hZ2VyLCBzdGF0c1dyYXBwZXIsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5NYW5hZ2VyID0gcmVxdWlyZSgnbWFuYWdlcnMvbWFuYWdlcicpO1xuXG5zdGF0c1dyYXBwZXIgPSByZXF1aXJlKCdqYWRlL3N0YXRzLXdyYXBwZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0c01hbmFnZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoU3RhdHNNYW5hZ2VyLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBTdGF0c01hbmFnZXIoJGVsLCBraW5kKSB7XG4gICAgdmFyICRicmVha2Rvd24sICRob3VybHlBdmVyYWdlLCAkaG91cmx5U3RhdHMsICRzdGF0c1dyYXBwZXIsIGV4cGFuZGVkLCBob3VybHk7XG4gICAgdGhpcy5raW5kID0ga2luZDtcbiAgICAkc3RhdHNXcmFwcGVyID0gJChzdGF0c1dyYXBwZXIoe1xuICAgICAga2luZDogdGhpcy5raW5kXG4gICAgfSkpO1xuICAgICRlbC5hcHBlbmQoJHN0YXRzV3JhcHBlcik7XG4gICAgJGhvdXJseUF2ZXJhZ2UgPSAkKFwiLmhvdXJseS1hdmdzLXdyYXBcIiwgJHN0YXRzV3JhcHBlcik7XG4gICAgJGhvdXJseVN0YXRzID0gJChcIi5ob3VybHktc3RhdHMtd3JhcFwiLCAkc3RhdHNXcmFwcGVyKTtcbiAgICAkYnJlYWtkb3duID0gJChcIi5icmVha2Rvd24td3JhcFwiLCAkc3RhdHNXcmFwcGVyKTtcbiAgICBob3VybHkgPSBuZXcgbmFub2JveC5Ib3VybHlBdmVyYWdlKCRob3VybHlBdmVyYWdlKTtcbiAgICBob3VybHkuYnVpbGQoKTtcbiAgICBleHBhbmRlZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKFwiZXhwYW5kZWRcIiwgJGhvdXJseVN0YXRzKTtcbiAgICBleHBhbmRlZC5idWlsZCgpO1xuICB9XG5cbiAgcmV0dXJuIFN0YXRzTWFuYWdlcjtcblxufSkoTWFuYWdlcik7XG4iLCJ2YXIgTGluZUFuaW1hdG9yLFxuICBiaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lQW5pbWF0b3IgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIExpbmVBbmltYXRvcigkZWwsIGNvbXBvbmVudEtpbmQsIGFuaW1hdGlvbktpbmQsIG1lc3NhZ2UpIHtcbiAgICB2YXIgJHN2Zywgc3ZnSWQ7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy5kZXN0cm95VGljayA9IGJpbmQodGhpcy5kZXN0cm95VGljaywgdGhpcyk7XG4gICAgdGhpcy5idWlsZFRpY2sgPSBiaW5kKHRoaXMuYnVpbGRUaWNrLCB0aGlzKTtcbiAgICB0aGlzLnNldENyb3NzUGxhdGZvcm0oKTtcbiAgICBzdmdJZCA9IHRoaXMuZ2V0U3ZnSWQoY29tcG9uZW50S2luZCk7XG4gICAgJHN2ZyA9ICQoXCI8aW1nIGNsYXNzPSdzaGFkb3ctaWNvbicgZGF0YS1zcmM9J1wiICsgc3ZnSWQgKyBcIicgLz5cIik7XG4gICAgdGhpcy4kZWwuYXBwZW5kKCRzdmcpO1xuICAgIGNhc3RTaGFkb3dzKHRoaXMuJGVsKTtcbiAgICB0aGlzLnBhdGggPSAkKCdwYXRoJywgdGhpcy4kZWwpWzBdO1xuICAgIHRoaXMucGF0aC5zdHlsZVsnc3Ryb2tlLWRhc2hvZmZzZXQnXSA9IDMwMDA7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbihhbmltYXRpb25LaW5kKTtcbiAgfVxuXG4gIExpbmVBbmltYXRvci5wcm90b3R5cGUuYnVpbGRUaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGluYywgaXRlbSwgaiwgbGVuLCByZWY7XG4gICAgaWYgKHRoaXMuZGFzaEFycmF5WzFdID4gODApIHtcbiAgICAgIHJlZiA9IHRoaXMuZGFzaEFycmF5O1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSBqICs9IDIpIHtcbiAgICAgICAgaXRlbSA9IHJlZltpXTtcbiAgICAgICAgaWYgKHRoaXMuZGFzaEFycmF5W2kgKyAxXSA+IDgwKSB7XG4gICAgICAgICAgaW5jID0gTWF0aC5yYW5kb20oKSAvIDI7XG4gICAgICAgICAgdGhpcy5kYXNoQXJyYXlbaV0gKz0gaW5jO1xuICAgICAgICAgIHRoaXMuZGFzaEFycmF5W2kgKyAxXSAtPSBpbmM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYXRoLnN0eWxlWydzdHJva2UtZGFzaGFycmF5J10gPSB0aGlzLmRhc2hBcnJheTtcbiAgICB0aGlzLnBhdGguc3R5bGVbJ3N0cm9rZS1kYXNob2Zmc2V0J10gPSB0aGlzLm9mZnNldCArPSB0aGlzLnNwZWVkO1xuICAgIHJldHVybiB0aGlzLnRpY2tJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmJ1aWxkVGljayk7XG4gIH07XG5cbiAgTGluZUFuaW1hdG9yLnByb3RvdHlwZS5kZXN0cm95VGljayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBpbmMsIGl0ZW0sIGosIGxlbiwgcmVmO1xuICAgIGlmICh0aGlzLmRhc2hBcnJheVswXSA+IDExKSB7XG4gICAgICByZWYgPSB0aGlzLmRhc2hBcnJheTtcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gaiArPSAyKSB7XG4gICAgICAgIGl0ZW0gPSByZWZbaV07XG4gICAgICAgIGlmICh0aGlzLmRhc2hBcnJheVtpICsgMV0gPiA4MCkge1xuICAgICAgICAgIGluYyA9IE1hdGgucmFuZG9tKCkgLyAzO1xuICAgICAgICAgIHRoaXMuZGFzaEFycmF5W2ldIC09IGluYztcbiAgICAgICAgICB0aGlzLmRhc2hBcnJheVtpICsgMV0gKz0gaW5jO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGF0aC5zdHlsZVsnc3Ryb2tlLWRhc2hhcnJheSddID0gdGhpcy5kYXNoQXJyYXk7XG4gICAgdGhpcy5wYXRoLnN0eWxlWydzdHJva2UtZGFzaG9mZnNldCddID0gdGhpcy5vZmZzZXQgKz0gdGhpcy5zcGVlZDtcbiAgICByZXR1cm4gdGhpcy50aWNrSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kZXN0cm95VGljayk7XG4gIH07XG5cbiAgTGluZUFuaW1hdG9yLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy50aWNrSWQpO1xuICAgIHRoaXMucGF0aCA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuJGVsLmVtcHR5KCk7XG4gIH07XG5cbiAgTGluZUFuaW1hdG9yLnByb3RvdHlwZS5zdGFydEFuaW1hdGlvbiA9IGZ1bmN0aW9uKGFuaW1hdGlvbktpbmQpIHtcbiAgICBpZiAoYW5pbWF0aW9uS2luZCA9PT0gJ2J1aWxkJykge1xuICAgICAgdGhpcy5kYXNoQXJyYXkgPSBbMiwgODAwLCAyLCA2MDAsIDIsIDQwMF07XG4gICAgICB0aGlzLnBhdGguc3R5bGVbJ3N0cm9rZS1kYXNoYXJyYXknXSA9IHRoaXMuZGFzaEFycmF5O1xuICAgICAgdGhpcy5zcGVlZCA9IDg7XG4gICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZFRpY2soKTtcbiAgICB9IGVsc2UgaWYgKGFuaW1hdGlvbktpbmQgPT09ICdkZXN0cm95Jykge1xuICAgICAgdGhpcy5kYXNoQXJyYXkgPSBbMTYwLCAxMDBdO1xuICAgICAgdGhpcy5wYXRoLnN0eWxlWydzdHJva2UtZGFzaGFycmF5J10gPSB0aGlzLmRhc2hBcnJheTtcbiAgICAgIHRoaXMucGF0aC5zdHlsZVsnc3Ryb2tlJ10gPSAnI0QyRDJEMic7XG4gICAgICB0aGlzLnNwZWVkID0gNjtcbiAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgIHJldHVybiB0aGlzLmRlc3Ryb3lUaWNrKCk7XG4gICAgfVxuICB9O1xuXG4gIExpbmVBbmltYXRvci5wcm90b3R5cGUuZ2V0U3ZnSWQgPSBmdW5jdGlvbihjb21wb25lbnRLaW5kKSB7XG4gICAgY29uc29sZS5sb2coY29tcG9uZW50S2luZCk7XG4gICAgc3dpdGNoIChjb21wb25lbnRLaW5kKSB7XG4gICAgICBjYXNlICdob3N0JzpcbiAgICAgIGNhc2UgJ2NsdXN0ZXInOlxuICAgICAgICByZXR1cm4gJ2hvc3Qtc2lsdmVyaW5nJztcbiAgICAgIGNhc2UgJ2NvbXBvbmVudCc6XG4gICAgICAgIHJldHVybiAnY29tcG9uZW50LXNpbHZlcmluZyc7XG4gICAgfVxuICB9O1xuXG4gIExpbmVBbmltYXRvci5wcm90b3R5cGUuc2V0Q3Jvc3NQbGF0Zm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cywgdmVuZG9yO1xuICAgIGlmICh3aW5kb3cuY3Jvc3NQbGF0Zm9ybUFscmVhZHlTZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luZG93LmNyb3NzUGxhdGZvcm1BbHJlYWR5U2V0ID0gdHJ1ZTtcbiAgICByZWYgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHZlbmRvciA9IHJlZltqXTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvd1t2ZW5kb3IgKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3dbdmVuZG9yICsgXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiXSB8fCB3aW5kb3dbdmVuZG9yICsgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAhPSBudWxsKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHJldHVybiBMaW5lQW5pbWF0b3I7XG5cbn0pKCk7XG4iLCJ2YXIgV2luZG93U2Nyb2xsZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93U2Nyb2xsZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFdpbmRvd1Njcm9sbGVyKCkge1xuICAgIGlmICh3aW5kb3cuX193aW5kX3Njcm9sbGVyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB3aW5kb3cuX193aW5kX3Njcm9sbGVyID0gdGhpcztcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTQ1JPTExfVE8nLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5zY3JvbGxXaW5kb3dUbyhkYXRhLCA0ODAsIDYwMCwgMjApO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cblxuICBXaW5kb3dTY3JvbGxlci5wcm90b3R5cGUuc2Nyb2xsV2luZG93VG8gPSBmdW5jdGlvbigkZWwsIGRlbGF5LCBkdXJhdGlvbiwgdG9wUGFkZGluZykge1xuICAgIHZhciB0b3A7XG4gICAgaWYgKGRlbGF5ID09IG51bGwpIHtcbiAgICAgIGRlbGF5ID0gMDtcbiAgICB9XG4gICAgaWYgKGR1cmF0aW9uID09IG51bGwpIHtcbiAgICAgIGR1cmF0aW9uID0gNTAwO1xuICAgIH1cbiAgICBpZiAodG9wUGFkZGluZyA9PSBudWxsKSB7XG4gICAgICB0b3BQYWRkaW5nID0gMDtcbiAgICB9XG4gICAgdG9wID0gJGVsLm9mZnNldCgpLnRvcCAtIHRvcFBhZGRpbmc7XG4gICAgaWYgKCQoJ2JvZHknKS5oZWlnaHQoKSAtIHRvcCA8IHRvcCkge1xuICAgICAgdG9wID0gJCgnYm9keScpLmhlaWdodCgpIC0gdG9wO1xuICAgIH1cbiAgICBpZiAodG9wICE9PSB0b3BQYWRkaW5nKSB7XG4gICAgICByZXR1cm4gJCgnaHRtbCxib2R5JykudmVsb2NpdHkoJ3Njcm9sbCcsIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5LFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIG9mZnNldDogdG9wLFxuICAgICAgICBlYXNpbmc6ICdlYXNlSW5PdXRRdWludCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBXaW5kb3dTY3JvbGxlci5wcm90b3R5cGUuc2Nyb2xsV2luZG93dG9GdXR1cmVTaXplID0gZnVuY3Rpb24oJGVsLCBkZWxheSwgZHVyYXRpb24sIHRvcFBhZGRpbmcsIHByb2plY3RlZEhlaWdodCkge1xuICAgIHZhciBib2R5SGVpZ2h0LCB0b3AsIHdpbmRvd0hlaWdodDtcbiAgICBpZiAoZGVsYXkgPT0gbnVsbCkge1xuICAgICAgZGVsYXkgPSAwO1xuICAgIH1cbiAgICBpZiAoZHVyYXRpb24gPT0gbnVsbCkge1xuICAgICAgZHVyYXRpb24gPSA1MDA7XG4gICAgfVxuICAgIGlmIChwcm9qZWN0ZWRIZWlnaHQgPT0gbnVsbCkge1xuICAgICAgcHJvamVjdGVkSGVpZ2h0ID0gMDtcbiAgICB9XG4gICAgdG9wID0gJGVsLm9mZnNldCgpLnRvcCAtIHRvcFBhZGRpbmc7XG4gICAgYm9keUhlaWdodCA9ICQoJ2JvZHknKS5oZWlnaHQoKSArIHByb2plY3RlZEhlaWdodDtcbiAgICB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgaWYgKGJvZHlIZWlnaHQgLSB0b3AgPCB3aW5kb3dIZWlnaHQpIHtcbiAgICAgIHRvcCA9IGJvZHlIZWlnaHQgLSB3aW5kb3dIZWlnaHQ7XG4gICAgfVxuICAgIGlmIChib2R5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XG4gICAgICByZXR1cm4gJCgnaHRtbCxib2R5JykuZGVsYXkoZGVsYXkpLnZlbG9jaXR5KHtcbiAgICAgICAgc2Nyb2xsVG9wOiB0b3BcbiAgICAgIH0sIHtcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmc6IFwiZWFzZUluT3V0UXVpbnRcIlxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBXaW5kb3dTY3JvbGxlcjtcblxufSkoKTtcbiIsInZhciBTYXZlciwgc2F2ZXI7XG5cbnNhdmVyID0gcmVxdWlyZSgnamFkZS9zYXZlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNhdmVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTYXZlcigkZWwsIG9uU2F2ZUNiLCBvbkNhbmNlbENiKSB7XG4gICAgdmFyICRub2RlO1xuICAgIHRoaXMub25DYW5jZWxDYiA9IG9uQ2FuY2VsQ2I7XG4gICAgJG5vZGUgPSAkKHNhdmVyKHt9KSk7XG4gICAgJGVsLmFwcGVuZCgkbm9kZSk7XG4gICAgJChcIi5zYXZlLWJ0blwiLCAkbm9kZSkub24oJ2NsaWNrJywgb25TYXZlQ2IpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJG5vZGUuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgcmV0dXJuIFNhdmVyO1xuXG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImFkbWluXFxcIj48aW1nIGRhdGEtc3JjPVxcXCJhZG1pbi1vY3RvcHVzXFxcIiBjbGFzcz1cXFwic2hhZG93LWljb25cXFwiLz48ZGl2IGNsYXNzPVxcXCJpbmZvXFxcIj48ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+QWRtaW48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ0eHRcXFwiPkNvbm5lY3Rpb24gQ3JlZGVudGlhbHMsIFJlbmFtaW5nLCBldGMuLjwvZGl2PjxhIGhyZWY9XFxcIiNcXFwiPkFkbWluIHRoaXMgQ29tcG9uZW50PC9hPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChuYXYsIHVuZGVmaW5lZCkge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJib3gtbmF2XFxcIj5cIik7XG4vLyBpdGVyYXRlIG5hdlxuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBuYXY7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciAkaW5kZXggPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7ICRpbmRleCA8ICQkbDsgJGluZGV4KyspIHtcbiAgICAgIHZhciBpdGVtID0gJCRvYmpbJGluZGV4XTtcblxuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiZGF0YS1ldmVudFwiLCBcIlwiICsgKGl0ZW0uZXZlbnQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJuYXYtaXRlbVxcXCI+PGRpdiBjbGFzcz1cXFwiaWNvblxcXCI+PGltZ1wiICsgKGphZGUuYXR0cihcImRhdGEtc3JjXCIsIFwibmF2LVwiICsgKGl0ZW0uaWNvbikgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgeHRyYT1cXFwiMlxcXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwidGV4dFxcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpdGVtLnR4dCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyICRpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIGl0ZW0gPSAkJG9ialskaW5kZXhdO1xuXG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWV2ZW50XCIsIFwiXCIgKyAoaXRlbS5ldmVudCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcIm5hdi1pdGVtXFxcIj48ZGl2IGNsYXNzPVxcXCJpY29uXFxcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1zcmNcIiwgXCJuYXYtXCIgKyAoaXRlbS5pY29uKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB4dHJhPVxcXCIyXFxcIiBjbGFzcz1cXFwic2hhZG93LWljb25cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGl0ZW0udHh0KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwibmF2XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5uYXY6dHlwZW9mIG5hdiE9PVwidW5kZWZpbmVkXCI/bmF2OnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChjbHVzdGVyTmFtZSwgc2VydmljZVR5cGUsIHRvdGFsTWVtYmVycykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJib3ggY2x1c3Rlci1ib3hcXFwiPjxkaXYgY2xhc3M9XFxcIm1haW4tY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwiYW5pbWF0aW9uXFxcIj48ZGl2IGNsYXNzPVxcXCJzdmctaG9sZGVyXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwid2hpdGUtYm94XFxcIj48ZGl2IGNsYXNzPVxcXCJpZFxcXCI+PGRpdiBjbGFzcz1cXFwibmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBjbHVzdGVyTmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwic2VydmljZS1uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHNlcnZpY2VUeXBlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjb21wb25lbnRcXFwiPjxkaXZcIiArIChqYWRlLmNscyhbJ3NlcnZpY2UtaWNvbicsXCJcIiArIChzZXJ2aWNlVHlwZSkgKyBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJkYXRhLXNyY1wiLCBcImhleC1cIiArIChzZXJ2aWNlVHlwZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgc2NhbGFibGU9XFxcInRydWVcXFwiIHh0cmE9XFxcIjJcXFwiIGNsYXNzPVxcXCJzaGFkb3ctaWNvblxcXCIvPjwvZGl2PjxkaXYgY2xhc3M9XFxcInRvdGFsXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHRvdGFsTWVtYmVycykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwic3RhdHNcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm5hdi1ob2xkZXJcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInN1YlxcXCI+PGRpdiBjbGFzcz1cXFwic3ViLWNvbnRlbnRcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImNsdXN0ZXJOYW1lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jbHVzdGVyTmFtZTp0eXBlb2YgY2x1c3Rlck5hbWUhPT1cInVuZGVmaW5lZFwiP2NsdXN0ZXJOYW1lOnVuZGVmaW5lZCxcInNlcnZpY2VUeXBlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zZXJ2aWNlVHlwZTp0eXBlb2Ygc2VydmljZVR5cGUhPT1cInVuZGVmaW5lZFwiP3NlcnZpY2VUeXBlOnVuZGVmaW5lZCxcInRvdGFsTWVtYmVyc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudG90YWxNZW1iZXJzOnR5cGVvZiB0b3RhbE1lbWJlcnMhPT1cInVuZGVmaW5lZFwiP3RvdGFsTWVtYmVyczp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChuYW1lLCBzZXJ2aWNlVHlwZSkge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJib3ggY29tcG9uZW50LWJveFxcXCI+PGRpdiBjbGFzcz1cXFwibWFpbi1jb250ZW50XFxcIj48ZGl2IGNsYXNzPVxcXCJhbmltYXRpb25cXFwiPjxkaXYgY2xhc3M9XFxcInN2Zy1ob2xkZXJcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInRpdGxlXFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ3aGl0ZS1ib3hcXFwiPjxkaXYgY2xhc3M9XFxcImNvcm5lci1ib3hcXFwiPjxpbWcgZGF0YS1zcmM9XFxcImNvcm5lci1iZ1xcXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwiaWRcXFwiPjxkaXYgY2xhc3M9XFxcIm5hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gbmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwic2VydmljZS1uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHNlcnZpY2VUeXBlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJzdGF0c1xcXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwic2VydmljZS1idWdcXFwiPiA8ZGl2IGNsYXNzPVxcXCJiZy1oZXhcXFwiPjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJkYXRhLXNyY1wiLCBcImhleC1cIiArIChzZXJ2aWNlVHlwZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwibmF2LWhvbGRlclxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwic3ViXFxcIj48ZGl2IGNsYXNzPVxcXCJzdWItY29udGVudFxcXCI+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwibmFtZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubmFtZTp0eXBlb2YgbmFtZSE9PVwidW5kZWZpbmVkXCI/bmFtZTp1bmRlZmluZWQsXCJzZXJ2aWNlVHlwZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguc2VydmljZVR5cGU6dHlwZW9mIHNlcnZpY2VUeXBlIT09XCJ1bmRlZmluZWRcIj9zZXJ2aWNlVHlwZTp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChhcHBDb21wb25lbnRzLCBuYW1lLCB1bmRlZmluZWQpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiYm94IGhvc3QtYm94XFxcIj48ZGl2IGNsYXNzPVxcXCJtYWluLWNvbnRlbnRcXFwiPjxkaXYgY2xhc3M9XFxcImFuaW1hdGlvblxcXCI+PGRpdiBjbGFzcz1cXFwic3ZnLWhvbGRlclxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwidGl0bGVcXFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIndoaXRlLWJveFxcXCI+PGRpdiBjbGFzcz1cXFwibmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJzZXJ2aWNlLWljb25zXFxcIj5cIik7XG4vLyBpdGVyYXRlIGFwcENvbXBvbmVudHNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gYXBwQ29tcG9uZW50cztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyIGkgPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7IGkgPCAkJGw7IGkrKykge1xuICAgICAgdmFyIHNlcnZpY2UgPSAkJG9ialtpXTtcblxuaWYgKCBpIDwgMyB8fCAoIGk9PTMgJiYgYXBwQ29tcG9uZW50cy5sZW5ndGggPT0gNCApKVxue1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5jbHMoWydzZXJ2aWNlLWljb24nLFwiXCIgKyAoc2VydmljZS5zZXJ2aWNlVHlwZSkgKyBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJkYXRhLXNyY1wiLCBcImhleC1cIiArIChzZXJ2aWNlLnNlcnZpY2VUeXBlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBzY2FsYWJsZT1cXFwidHJ1ZVxcXCIgeHRyYT1cXFwiMlxcXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PC9kaXY+XCIpO1xufVxuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIGkgaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBzZXJ2aWNlID0gJCRvYmpbaV07XG5cbmlmICggaSA8IDMgfHwgKCBpPT0zICYmIGFwcENvbXBvbmVudHMubGVuZ3RoID09IDQgKSlcbntcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuY2xzKFsnc2VydmljZS1pY29uJyxcIlwiICsgKHNlcnZpY2Uuc2VydmljZVR5cGUpICsgXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1zcmNcIiwgXCJoZXgtXCIgKyAoc2VydmljZS5zZXJ2aWNlVHlwZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgc2NhbGFibGU9XFxcInRydWVcXFwiIHh0cmE9XFxcIjJcXFwiIGNsYXNzPVxcXCJzaGFkb3ctaWNvblxcXCIvPjwvZGl2PlwiKTtcbn1cbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuaWYgKCBhcHBDb21wb25lbnRzLmxlbmd0aCA+IDQpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInNlcnZpY2UtaWNvbiBlbXB0eVxcXCI+PGltZyBkYXRhLXNyYz1cXFwiaGV4LWVtcHR5XFxcIiBzY2FsYWJsZT1cXFwidHJ1ZVxcXCIgeHRyYT1cXFwiMlxcXCIgY2xhc3M9XFxcInNoYWRvdy1pY29uXFxcIi8+PGRpdiBjbGFzcz1cXFwidHh0XFxcIj48ZGl2IGNsYXNzPVxcXCJudW1cXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGFwcENvbXBvbmVudHMubGVuZ3RoLTMpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIiA8L2Rpdj48c3Bhbj5tb3JlPC9zcGFuPjwvZGl2PjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwic3RhdHNcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm5hdi1ob2xkZXJcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInN1YlxcXCI+PGRpdiBjbGFzcz1cXFwic3ViLWNvbnRlbnRcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImFwcENvbXBvbmVudHNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFwcENvbXBvbmVudHM6dHlwZW9mIGFwcENvbXBvbmVudHMhPT1cInVuZGVmaW5lZFwiP2FwcENvbXBvbmVudHM6dW5kZWZpbmVkLFwibmFtZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubmFtZTp0eXBlb2YgbmFtZSE9PVwidW5kZWZpbmVkXCI/bmFtZTp1bmRlZmluZWQsXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwic2F2ZXJcXFwiPjxkaXYgY2xhc3M9XFxcInNhdmUtYnRuXFxcIj5TYXZlPC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInNwbGl0LWhvbGRlclxcXCI+PGRpdiBjbGFzcz1cXFwidGVtcFxcXCI+VGhlIHByb2Nlc3Mgb2Ygc3BsaXR0aW5nIGEgY29tcG9uZW50IG9udG8gYSBkaWZmZXJlbnQgaG9zdCB3aWxsIGdvIGhlcmUuPC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGtpbmQpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwic3RhdHMtd3JhcHBlclxcXCI+PGRpdiBjbGFzcz1cXFwiaG91cmx5XFxcIj48ZGl2IGNsYXNzPVxcXCJob3VybHktYXZncy13cmFwXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJob3VybHktc3RhdHMtd3JhcFxcXCI+PC9kaXY+PC9kaXY+XCIpO1xuaWYgKCBraW5kID09IFwiaG9zdFwiKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJicmVha2Rvd24td3JhcFxcXCI+PC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJraW5kXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5raW5kOnR5cGVvZiBraW5kIT09XCJ1bmRlZmluZWRcIj9raW5kOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59Il19
