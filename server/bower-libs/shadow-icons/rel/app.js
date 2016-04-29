var ShadowIcons, castShadows, pxicons, shadowIcons,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ShadowIcons = (function() {
  function ShadowIcons() {
    this.svgReplaceWithString = __bind(this.svgReplaceWithString, this);
    window.shadowIconsInstance = this;
  }

  ShadowIcons.prototype.svgReplaceWithString = function($jqueryContext, svgString) {
    if (svgString == null) {
      svgString = pxSvgIconString;
    }
    return this.replacePlaceholdersWithSVGs(svgString, $jqueryContext);
  };

  ShadowIcons.prototype.svgReplaceWithExternalFile = function(url, $jqueryContext) {
    return $.ajax({
      url: url,
      type: "GET",
      dataType: "xml",
      success: (function(_this) {
        return function(svgData, status, jqXHR) {
          return _this.replacePlaceholdersWithSVGs(svgData, $jqueryContext);
        };
      })(this)
    });
  };

  ShadowIcons.prototype.replacePlaceholdersWithSVGs = function(svg, $jqueryContext) {
    var $svg, image, images, _i, _len, _results;
    $svg = $(this.buildSvg(svg, "main"));
    images = $("img.shadow-icon", $jqueryContext);
    _results = [];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      _results.push(this.createSvg(image, $svg));
    }
    return _results;
  };

  ShadowIcons.prototype.createSvg = function(image, $svg) {
    var $g, $holder, $targetSvg, id, lockToMax, modBox, newNode, rawHtml, scalable, serializer, size, usesSymbols, _ref, _ref1, _ref2, _ref3;
    id = $(image).attr("data-src");
    scalable = ((_ref = $(image).attr("scalable")) != null ? _ref.toUpperCase() : void 0) === 'TRUE';
    lockToMax = ((_ref1 = $(image).attr("lock-to-max")) != null ? _ref1.toUpperCase() : void 0) === 'TRUE';
    lockToMax || (lockToMax = ((_ref2 = $(image).attr("data-lock-to-max")) != null ? _ref2.toUpperCase() : void 0) === 'TRUE');
    scalable || (scalable = ((_ref3 = $(image).attr("data-scalable")) != null ? _ref3.toUpperCase() : void 0) === 'TRUE');
    $g = $("#" + id, $svg);
    if ($g[0] == null) {
      console.log("Shadow Icons : Tried to add an SVG with the id '" + id + "', but an SVG with id doesn't exist in the library SVG.");
      return;
    } else if ($g.attr("data-size") == null) {
      console.log("Unable to find the size attribute on '" + id + "'");
      return;
    }
    size = $g.attr("data-size").split('x');
    modBox = {
      width: size[0],
      height: size[1]
    };
    $targetSvg = $g[0];
    usesSymbols = false;
    serializer = new XMLSerializer();
    rawHtml = serializer.serializeToString($targetSvg);
    if (usesSymbols) {
      newNode = $(this.buildSvg(rawHtml, id, pxSymbolString));
    } else {
      newNode = $(this.buildSvg(rawHtml, id));
    }
    $('body').append(newNode);
    if (scalable) {
      newNode.get(0).setAttribute("viewBox", "0 0 " + modBox.width + " " + modBox.height);
      $holder = $("<div class='holder'><div>");
      $holder.css({
        "width": "100%",
        "display": "inline-block"
      });
      if (lockToMax) {
        $holder.css({
          "max-width": "" + modBox.width + "px",
          "max-height": "" + modBox.height + "px"
        });
      }
      $holder.append(newNode);
      return $(image).replaceWith($holder);
    } else {
      newNode.attr({
        width: "" + modBox.width + "px",
        height: "" + modBox.height + "px"
      });
      return $(image).replaceWith(newNode);
    }
  };

  ShadowIcons.prototype.buildSvg = function(svgSubElement, id, symbols) {
    if (symbols == null) {
      symbols = "";
    }
    return "<svg id=\"" + id + "\" preserveAspectRatio= \"xMinYMin meet\" class=\"pagoda-icon\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n  " + symbols + "\n  " + svgSubElement + "\n</svg>";
  };

  return ShadowIcons;

})();

pxicons = {};

pxicons.ShadowIcons = ShadowIcons;

shadowIcons = new pxicons.ShadowIcons();

castShadows = shadowIcons.svgReplaceWithString;
