import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window {
        api: {
            send: (channel: string, data?: any) => void;
            on: (
                channel: string,
                callback: (
                    ...args: any[]
                ) => void
            ) => void;
            invoke: (channel: string, data?: any) => Promise<any>;
        };
    }
}

contextBridge.exposeInMainWorld("api", {
    send: (channel: string, data?: any) => {
        const validChannels = ["toMain"];

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (
        channel: string,
        callback: (...args: any[]) => void
    ) => {
        const validChannels = ["fromMain"];

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, callback);
        }
    },
    invoke: async (channel: string, data?: any) => {
        const validChannels = ["getData"];

        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, data);
        }
    },
});
