"use client";

import { useState } from "react";
import { CalendarPage } from "@/components/CalendarPage";
import { CalendarEvent } from "@/types/calendar";

export default function App() {
    const [currentPage, setCurrentPage] = useState<
        "dashboard" | "calendar" | "tasks"
    >("calendar");

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const renderPage = () => {
        switch (currentPage) {
            case "calendar":
                return <CalendarPage events={events} setEvents={setEvents} />;
            default:
                return null;
        }
    };

    return renderPage();
}
