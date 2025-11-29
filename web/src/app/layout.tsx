import Sidebar from "@/components/Sidebar/Sidebar";
import AIAgent from "@/components/AI Agent";

import "../styles/globals.css";

export default function Test({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Sidebar />
                <div className="wrapper">{children}</div>
                <AIAgent />
            </body>
        </html>
    );
}
