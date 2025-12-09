"use client";

import { useState } from "react";
import AppContent from "./AppContent";

import Sidebar from "@/components/Sidebar/Sidebar";
import AIAgent from "@/components/AI Agent";

export default function App() {
    const [currentPage, setCurrentPage] = useState<
        "dashboard" | "calendar" | "tasks" | "collection" | "performance"
    >("calendar");

    return (
        <>
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <AppContent currentPage={currentPage} />
            <AIAgent />
        </>
    );
}
