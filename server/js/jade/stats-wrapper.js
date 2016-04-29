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