import AIAgent from "@/components/AI Agent";

import { KeydownProvider } from "../contexts/Keydown";

import "../styles/globals.css";

export default function Test({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <KeydownProvider>{children}</KeydownProvider>
            </body>
        </html>
    );
}
