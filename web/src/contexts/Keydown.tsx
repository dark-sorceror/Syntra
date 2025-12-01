"use client";

import React, { createContext, useEffect, useRef } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

export const KeydownContext = createContext<{
    register: (handler: KeyHandler) => void;
    unregister: (handler: KeyHandler) => void;
}>({
    register: () => {},
    unregister: () => {},
});

export function KeydownProvider({ children }: { children: React.ReactNode }) {
    const handlers = useRef<Set<KeyHandler>>(new Set());

    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            handlers.current.forEach((h) => h(e));
        };

        window.addEventListener("keydown", handle);

        return () => window.removeEventListener("keydown", handle);
    }, []);

    return (
        <KeydownContext.Provider
            value={{
                register: (h) => handlers.current.add(h),
                unregister: (h) => handlers.current.delete(h),
            }}
        >
            {children}
        </KeydownContext.Provider>
    );
}
