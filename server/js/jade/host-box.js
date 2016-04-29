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