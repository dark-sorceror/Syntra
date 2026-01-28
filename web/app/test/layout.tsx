import type { Metadata } from "next";

import "./styles.css";

export const metadata: Metadata = {
    title: "Syntra",
    description: "Refine your rhythm",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
