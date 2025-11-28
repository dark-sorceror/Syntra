import Sidebar from "@/components/Sidebar/Sidebar";

import "../styles/globals.css";

export default function Test({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Sidebar />
                <div className="wrapper">{children}</div>
            </body>
        </html>
    );
}
