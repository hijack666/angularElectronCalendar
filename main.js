const {app, BrowserWindow, ipcMain} = require('electron');
const url = require("url");
const path = require("path");
var fs = require('fs');

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.loadURL(
    url.format({
        pathname: path.join(__dirname, `/dist/angular-basics/index.html`),
        protocol: "file:",
        slashes: true
    })
    );
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// ipcMain.handle('loadData', async (event, fileName) => {
//     const userDataPath = app.getPath('userData');
//     this.path = path.join(userDataPath, `${fileName}.json`);
  
//     fs.writeFileSync(this.path, '', { flag: 'a' });
  
//     const data = fs.readFileSync(this.path);
  
//     return data.length > 0? JSON.parse(data) : null;
// });
ipcMain.handle('loadData', async (event, fileName) => {
    // const userDataPath = app.getPath('userData');
    // this.path = path.join(userDataPath, `${fileName}.json`);
  
    // fs.writeFileSync(this.path, '', { flag: 'a' });
    fileName = 'data.json';
    var data = fs.readFileSync(fileName); // ВАЖНО юзать writeFileSync 
    // console.log(JSON.parse(data));
    // return 
    return JSON.parse(data); // возвращаем полученные данные в ангуляр
    // return data.length > 0? JSON.parse(data) : null;
});

// ipcMain.handle('saveData', async (event, fileName, data) => {
ipcMain.handle('saveData', async (event, fileName, data) => {
    // const userDataPath = app.getPath('userData');
    // this.path = path.join(userDataPath, `${fileName}.json`);
    // console.log(data);
    fileName = 'data.json';
    fs.writeFileSync(fileName, JSON.stringify(data)); // ВАЖНО юзать writeFileSync 
  
    return 'OK';
  });

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
    if (mainWindow === null) createWindow();
})
