const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const path = require('path');
const url = require('url');
const shell = require('electron').shell;

process.env.NODE_ENV = 'production';

let win;

function createWindow(){
    win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname,'src/index.html'),
        protocol : 'file:',
        slashes : true
    }));
    
win.on('closed',()=>{
    // app.quit();
    win = null;
});

var mainMenuTemplate = [
    {
        label:'Menu',
        submenu:[
            {
                label:'Coin Market Cap',
                accelerator : process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){
                    shell.openExternal('http://coinmarketcap.com')
                }
            },
            {type:'separator'},
            {
                label:'Exit',
                accelerator : process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];
if(process.env.NODE_ENV !== 'production'){
        mainMenuTemplate.push({
            label:'Developer Tools',
            submenu:[
                {
                    label:'Toogle Dev Tools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item,focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role:'reload'
                }
            ]
        })
    }

    var menu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(menu);
}
app.on('ready',createWindow);

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin')
        app.quit();
});
app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
});

ipcMain.on('update-notify-value',function(event,arg){
    win.webContents.send('targetPrice-value',arg);
})