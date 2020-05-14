const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click',(event)=>{
    var window = remote.getCurrentWindow();
    window.close();
});

const updateBtn = document.getElementById('updateBtn');

updateBtn.addEventListener('click',function(event){
    ipc.send('update-notify-value',document.getElementById('notifyVal').value);

    var window = remote.getCurrentWindow();
    window.close();
});