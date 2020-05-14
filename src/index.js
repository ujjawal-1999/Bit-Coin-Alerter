const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;

const notifyBtn = document.getElementById('notifyBtn');
var price = document.querySelector('h1');
var targetPrice = document.getElementById('targetPrice');
var targetPriceVal;

function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
        .then(res=>{
            const cryptos = res.data.BTC.USD;
            price.innerHTML = '$'+ cryptos.toLocaleString('en');

            if(targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD){
                const notification = {
                    title:'BTC Target Alert',
                    body : `BTC has just exceeded your target price. Your price ${targetPriceVal} and current BTC price is ${res.data.BTC.USD}`,
                    icon: path.join(__dirname,'../assets/images/BTC.png')
                }
                const myNotification = new window.Notification(notification.title, notification);
            }
        })
        .catch(err=> console.error(err));
}

getBTC();
setInterval(getBTC,10000);

notifyBtn.addEventListener('click',function(event){
    const modalpath = path.join('file://',__dirname,'add.html');
    let win = new BrowserWindow({
        frame: false,
        transparent:true,
        alwaysOnTop:true,
        width:400, 
        height:200,
        webPreferences:{
            nodeIntegration:true
        }
    });
    win.on('close',function(){
        win = null
    });
    win.loadURL(modalpath);
    win.show();
});

ipc.on('targetPrice-value',function(event,arg){
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = '$'+ targetPriceVal.toLocaleString('en');
});