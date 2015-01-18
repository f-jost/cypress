require("coffee-script/register")
// require("./js/main.coffee");

var gui, Updater;

(function(){
  var fs         = require("fs")
  var AutoLaunch = require('auto-launch')
  gui            = require('nw.gui')
  Updater        = require("./nw/js/updater.js")

  var win = gui.Window.get()

  // prevent from flickering on boot
  win.hide()

  var width = win.width

  window.tray = new gui.Tray({ title: 'Cy' })

  tray.on("click", function(coords){
    win.moveTo(coords.x, coords.y)
    win.moveBy(-(width / 2), 5)
    win.show()
  })

  win.on("blur", win.hide)

  var autoLaunch = function(title){
    var nwAppLauncher = new AutoLaunch({
        name: JSON.parse(fs.readFileSync("package.json", "utf8")).name
    })

    nwAppLauncher.isEnabled(function(enabled){
      if(enabled) return

      nwAppLauncher.enable(function(err){

      })

    })
  }

  autoLaunch(win.title)

})()

var idGenerator = function(path) {
  if(!path){
    throw new Error("Missing http path to ID Generator.  Cannot start ID Generator.")
  }
  idWin = gui.Window.open(path)
  idWin.hide()
}

var checkUpdates = function(){
  Updater.check()
}

var runProject = function() {
  require('./lib/server')({
    projectRoot: '/Users/bmann/Dev/WebApp-Node'
  }).then(function(config){
    idGenerator(config.idGeneratorPath)
  })
}