const { app, BrowserWindow, globalShortcut } = require('electron');

app.disableHardwareAcceleration();

let win;
const createWindow = () => {
    win = new BrowserWindow({
        width: 300,
        height: 500,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    win.setMenuBarVisibility(false);
    win.loadFile('index.html');
    win.resizable = false;

    win.on('minimize', () => {
        win.setSkipTaskbar(true);
    });

    win.on('restore', () => {
        win.setSkipTaskbar(false);
    });
};

app.whenReady().then(() => {
    createWindow();

    const success = globalShortcut.register('Alt+C', () => {
        if (win.isMinimized()) {
            win.restore();
        } else {
            win.minimize();
        }
    });

    if (!success) {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});