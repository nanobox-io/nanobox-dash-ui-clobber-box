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