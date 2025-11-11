import { IPCHandler } from "dolt-sql-workbench/main/preload";

declare global {
    interface Window {
        ipc: IPCHandler;
    }
}
