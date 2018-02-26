import { app, BrowserWindow, Menu, ipcMain} from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;
const mainMenuTemplate = [
  {
    label:'文件',
    submenu:[
      {
        label:'添加任务',
        click:function(){
          // Create the browser window.
          addWindow = new BrowserWindow({
            width: 400,
            height: 300,
          });

          // and load the index.html of the app.
          addWindow.loadURL(`file://${__dirname}/add.html`);
          addWindow.setMenu(null);//去掉菜单

          ipcMain.once('item:add',function(e,item){
            mainWindow.webContents.send('item:add',item);
            addWindow.hide();
          })
        }
      },
      {
        label: '清除任务',
        click:function(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: '退出',
        accelerator:'Ctrl+Q',
        click:function(){
          app.quit();
        }
      },
    ]
  },
  {
    label:'帮助',
    submenu:[
      {
        label: '切换开发人员工具',
        accelerator: 'Ctrl+shift+I',
        click:function(){
          mainWindow.webContents.openDevTools();//开启开发人员工具
        }
      }
    ]
  }
]
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  //创建菜单
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
