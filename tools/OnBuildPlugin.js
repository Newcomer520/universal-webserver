/**
 * webpack onbuild plugin. currently use this plugin to trigger the dev. server restarting as the app code changed
 */


export default function OnBuildPlugin(callback) {
  this.callback = callback;
}
OnBuildPlugin.prototype.apply = function(compiler) {
  compiler.plugin("done", this.callback)
}
