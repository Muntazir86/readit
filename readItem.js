const {BrowserWindow} = require('electron')


let offScreenWin

module.exports = (url, callback)=>{
    offScreenWin = new BrowserWindow({
        with: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    offScreenWin.loadURL(url)

    offScreenWin.webContents.on('did-finish-load', e=>{
        let title = offScreenWin.getTitle()
        offScreenWin.webContents.capturePage().then( image=>{
            let screenshot = image.toDataURL()

            callback({title, screenshot, url})
            
            // cleen up
            offScreenWin.close()
            offScreenWin = null
        })
    })



}