import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export interface handler {
    send: (channel: string, data?: any) => void;
    on: (
        channel: string,
        callback: (event: IpcRendererEvent, ...args: any[]) => void
    ) => void;
    invoke: (channel: string, data?: any) => Promise<any>;
    removeAllListeners: (channel: string) => void;
}

const validChannels = ["toMain", "fromMain", "getData"];

const handler: handler = {
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
        ipc: handler;
    }
}

contextBridge.exposeInMainWorld("ipc", handler);

export type IPCHandler = typeof handler;
