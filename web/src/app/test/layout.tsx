import Sidebar from "@/components/Sidebar";

import "../../styles/globals.css";

export default function Test({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Sidebar />
            <main>{children}</main>
        </>
    );
}
