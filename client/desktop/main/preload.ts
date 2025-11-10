import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export interface api {
    send: (channel: string, data?: any) => void;
    on: (
        channel: string,
        callback: (event: IpcRendererEvent, ...args: any[]) => void
    ) => void;
    invoke: (channel: string, data?: any) => Promise<any>;
    removeAllListeners: (channel: string) => void;
}

const validChannels = ["toMain", "fromMain", "getData"];

const api: api = {
    send: (channel: string, data?: any) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel: string, callback: (...args: any[]) => void) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, callback);
        }
    },
    invoke: async (channel: string, data?: any) => {
        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, data);
        }
    },
    removeAllListeners: (channel: string) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.removeAllListeners(channel);
        }
    },
};

declare global {
    interface Window {
        api: api;
    }
}

contextBridge.exposeInMainWorld("api", api);
