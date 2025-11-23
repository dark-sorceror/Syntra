import type { Metadata } from "next";

import "../styles/globals.css";

export const metadata: Metadata = {
    title: "Syntra",
    description: "Refine your rhythm",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="wrapper">{children}</div>
            </body>
        </html>
    );
}
