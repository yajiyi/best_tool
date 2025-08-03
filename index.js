/* Copyright (C) 2025 yajiyi

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version. */

const { app, BrowserWindow, globalShortcut } = require('electron');
const { Worker, isMainThread } = require('worker_threads');

app.disableHardwareAcceleration();

let win;
const createWindow = () => {
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
    win.resizable = false;

    win.on('minimize', () => {
        win.setSkipTaskbar(true);
    });

    win.on('restore', () => {
        win.setSkipTaskbar(false);
    });

    const topInterval = setInterval(() => {
        if (win && !win.isDestroyed()) {
            win.setAlwaysOnTop(true);
        }
    }, 50);

    win.on('closed', () => {
        clearInterval(topInterval);
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