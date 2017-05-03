const rantscript = require('rantscript');

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./rantscript');
}

let auth = localStorage.getItem('token');
if(auth == undefined || auth == null) {
  app.on('ready', () => {
    var authwin = new BrowserWindow({width: 350, height: 275, frame: false, resizable: false});
    authwin.loadURL(url.format({
      pathname: path.join(__dirname, 'login.html'),
      protocol: 'file:',
      slashes: true
    }))
    authwin.on('closed', () => {
      win[i] = null
    })
  })
}

let win = []

function createNotif () {
  win.push(new BrowserWindow({width: 350, height: 120, frame: false, resizable: false}));
  var i = win.length-1;
  win[i].setAlwaysOnTop(true);
  win[i].loadURL(url.format({
    pathname: path.join(__dirname, 'notification.html'),
    protocol: 'file:',
    slashes: true
  }))


  win[i].on('closed', () => {
    win[i] = null
  })
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
