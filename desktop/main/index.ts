import { app, BrowserWindow, ipcMain, ipcRenderer } from "electron";
import path from "path";
import { spawn } from "child_process";

const DEV_SERVER = "http://localhost:3000";

let window: BrowserWindow | null = null;
let pyProcess: any;

const isDev = !app.isPackaged;
const preloadPath = path.join(isDev ? __dirname : process.resourcesPath, "preload.js");

console.log("Using preload script:", preloadPath);

const createWindow = () => {
    window = new BrowserWindow({
        width: 1700,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const devMode = app.isPackaged;

    console.log(`Dev Mode: ${devMode}`);

    if (!devMode) {
        console.log(
            `(Dev Server) Retrieving front-end window from -- ${DEV_SERVER}`
        );

        window.loadURL(`${DEV_SERVER}`).catch((error) => {
            console.log("Could not load dev server", error);
        });
    } else {
        console.log(
            "(Production) Retrieving front-end window from -- client/index.html"
        );

        window
            .loadFile(path.join(__dirname, "client/index.html"))
            .catch((error) => {
                console.log("Could not load file client/index.html", error);
            });
    }

    window.webContents.on(
        "did-fail-load",
        (event, errorCode, errorDescription) => {
            console.error(
                `Page (${event}) failed to load: ${errorDescription} (${errorCode})`
            );
        }
    );

    window.on("closed", () => (window = null));
};

app.on("ready", () => {
    pyProcess = spawn("python", [path.join(__dirname, "../server/app.py")]);

    console.log("Python process started");

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
    if (pyProcess) pyProcess.kill();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
