"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContent from "./AppContent";

import Sidebar from "@/components/Sidebar";
import AIAgent from "@/components/AI Agent";

export default function App() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            }),
    );

    const [currentPage, setCurrentPage] = useState<
        "dashboard" | "calendar" | "tasks" | "collection" | "performance"
    >("calendar");

    return (
        <QueryClientProvider client={queryClient}>
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <AppContent currentPage={currentPage} />
            <AIAgent />
        </QueryClientProvider>
    );
}
