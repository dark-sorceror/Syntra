import path from "path";
import express from "express";

import { app, BrowserWindow } from "electron";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

const DEV_PORT = 3000;
const DEV_SERVER = `http://localhost:${DEV_PORT}`;

const devMode = !app.isPackaged;

let win: BrowserWindow | null = null;
let pyProc: ChildProcessWithoutNullStreams | null = null;

function createWindow() {
    win = new BrowserWindow({
        width: 1500,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            scrollBounce: true,
        },
    });

    const expressApp = express();

    const outPath = devMode
        ? path.join(process.resourcesPath, "app", "out")
        : path.join(__dirname, "..", "out");

    expressApp.use(express.static(outPath));

    expressApp.listen(DEV_PORT, () => {
        console.log(`Using static files from ${outPath}`);

        win?.loadURL(`${DEV_SERVER}/`);
    });
}

app.on("ready", () => {
    console.log(`Dev Mode: ${devMode}`);

    if (!devMode) {
        const backendPath = path.join(
            process.resourcesPath,
            "server",
            "app.exe"
        );

        console.log("(Production) Starting backend in path: ", backendPath);

        pyProc = spawn(backendPath);

        pyProc.stdout.on("data", (data) => {
            console.log(`[Python]: ${data.toString()}`);
        });

        pyProc.stderr.on("data", (data) => {
            console.error(`[Python Error]: ${data.toString()}`);
        });

        pyProc.on("exit", (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    }

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
    if (pyProc) {
        pyProc.kill();
        pyProc = null;
    }
});
