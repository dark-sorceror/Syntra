"use client";

import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { CalendarEvent } from "@/types/calendar";

export default function App() {
    const [currentPage, setCurrentPage] = useState<
        "dashboard" | "calendar" | "tasks"
    >("calendar");

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const renderPage = () => {
        switch (currentPage) {
            case "calendar":
                return <Calendar events={events} setEvents={setEvents} />;
            default:
                return null;
        }
    };

    return renderPage();
}
