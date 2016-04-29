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