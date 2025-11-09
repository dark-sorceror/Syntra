import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { spawn } from "child_process";

let mainWindow: BrowserWindow | null = null;
let pyProcess: any;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 1100,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    const isDev = !app.isPackaged;
    if (isDev) {
        mainWindow.loadURL("http://localhost:3000");
    } else 
        mainWindow.loadFile(
            path.join(__dirname, "client/index.html")
        );

    mainWindow.on("closed", () => (mainWindow = null));
};

app.on("ready", () => {
    pyProcess = spawn("python", ["../Backend/app.py"]);
    console.log("Python process started");

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
    if (pyProcess) pyProcess.kill();
});
