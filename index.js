const rantscript = require('rantscript');
rantscript.httpSettings.SET_DEBUG(false);

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./rantscript');
}

let auth = JSON.parse(localStorage.getItem('token'));
let authwin;
let rantWatcher;
let notifs = {};

if(auth == undefined || auth == null) {
  app.on('ready', () => {
    authwin = new BrowserWindow({width: 300, height: 300, frame: false, resizable: true});
    authwin.loadURL(url.format({
      pathname: path.join(__dirname, 'login.html'),
      protocol: 'file:',
      slashes: true
    }))
    authwin.on('closed', () => {
      authwin = null
    })
  })
} else {
  registerRantListener();
}

let win = []

function createNotif (data, user) {
  win.push(new BrowserWindow({width: 450, height: 120, frame: false, resizable: true, show: false}));
  var i = win.length-1;
  var w = win[i];

  w.loadURL(url.format({
    pathname: path.join(__dirname, 'notification.html'),
    protocol: 'file:',
    slashes: true
  }))

  w.once('ready-to-show', () => {
    w.show();
    w.setAlwaysOnTop(true);
    w.webContents.send('notifData', [data, user]);
  })

  w.on('closed', () => {
    win[i] = null
    console.log('closed')
  })
}

app.on('window-all-closed', () => {

})

function login(username, password) {
  rantscript
    .login(username, password)
    .then((resp) => {
      console.log(resp)
      localStorage.setItem('token', JSON.stringify(resp.auth_token));
      auth = resp.auth_token;
      registerRantListener();
      authwin.close()
    })
    .catch((err)=>{
      authwin.webContents.send('loginError' , err);
    })
}

let newNotifs = [];
let lastCheck = Math.floor(new Date() / 1000) - 2000;
function registerRantListener() {
  rantWatcher = setInterval(()=>{
    rantscript
      .notifications(auth, lastCheck)
      .then((resp)=>{
        lastCheck = resp.data.check_time;
        for (var i = 0; i < resp.data.items.length; i++) {
          var data = resp.data.items[i];
          var user = resp.data.username_map[data.uid];
          createNotif(data, user)
        }
      })
  },5000);
}

exports.login = login;
exports.quitApp = app.quit;
