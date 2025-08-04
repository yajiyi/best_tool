/*
Copyright (C) 2025 yajiyi
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const child_process = require('child_process');
const { title } = require('process');

app.disableHardwareAcceleration();

let win, alwaysOnTop, messageBoxWin, passwordBoxWin, messageBoxTitle, messageBoxMessage;
function createWindow() {
    win = new BrowserWindow({
        width: 300,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    win.setMenuBarVisibility(false);
    win.loadFile('index.html');
    win.setResizable(false);

    win.on('minimize', () => {
        win.setSkipTaskbar(true);
    });

    win.on('restore', () => {
        win.setSkipTaskbar(false);
    });

    alwaysOnTop = true;

    const topInterval = setInterval(() => {
        if (win && !win.isDestroyed()) {
            win.setAlwaysOnTop(alwaysOnTop);
        }
    }, 50);

    win.on('closed', () => {
        clearInterval(topInterval);
    });
};

function messageBox(title, message) {
    alwaysOnTop = false;
    win.setEnabled(false);
    messageBoxTitle = title;
    messageBoxMessage = message;
    height = 200;
    if (message === '') {
        height = 150;
    }
    messageBoxWin = new BrowserWindow({
        width: 300,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    messageBoxWin.setMenuBarVisibility(false);
    messageBoxWin.loadFile('messagebox.html');
    messageBoxWin.setResizable(false);
    messageBoxWin.setAlwaysOnTop(true);

    messageBoxWin.on('close', () => {
        alwaysOnTop = true;
        win.setEnabled(true);
        messageBoxWin = null;
    });
}

ipcMain.on('getMessage', (event) => {
    event.sender.send('message', messageBoxTitle, messageBoxMessage);
});

function passwordBox() {
    alwaysOnTop = false;
    win.setEnabled(false);
    passwordBoxWin = new BrowserWindow({
        width: 400,
        height: 550,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    passwordBoxWin.setMenuBarVisibility(false);
    passwordBoxWin.loadFile('passwordbox.html');
    passwordBoxWin.setResizable(false);
    passwordBoxWin.setAlwaysOnTop(true);

    passwordBoxWin.on('close', () => {
        alwaysOnTop = true;
        win.setEnabled(true);
        passwordBoxWin = null;
    });
}

ipcMain.on('getPasswordData', (event) => {
    const rawData = [
        { '极域': 'bcsy(一室) qwer1234(二三室)' },
        { '联想': 'qwer1234(一二三室)' },
        { '体育馆/游泳馆': 'qwer1234' },
        { '宿舍': '未知' },
        { '地下车库': '115830' },
        { '监控': 'Hik12345' }
    ];
    const passwordData = rawData.map(item => {
        const key = Object.keys(item)[0];
        return { key, value: item[key] };
    });
    event.sender.send('passwordData', passwordData);
});

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

ipcMain.on('operation', (event, operation) => {
    if (operation === 'killMythware') {
        child_process.exec('taskkill /f /im studentmain.exe', (stdout) => {
            console.log(`${stdout}`);
        });
        messageBox('操作完成', '');
    } else if (operation === 'killLenovo') {

        messageBox('操作完成', '');
    } else if (operation === 'removeRestrictions') {
        child_process.exec('sc stop TDFileFilter', (stdout) => {
            console.log(`${stdout}`);
        });
        child_process.exec('sc stop TDNetFilter', (stdout) => {
            console.log(`${stdout}`);
        });
        messageBox('操作完成', '需要重启网络适配器或重新插拔网线才能解除上网限制');
    } else if (operation === 'enableWinKey') {
        child_process.exec('reg delete "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout" /v Scancode Map /f', (stdout) => {
            console.log(`${stdout}`);
        });
        messageBox('操作完成', '需要注销才能生效');
    } else if (operation === 'getPassword') {
        passwordBox();
    }
})