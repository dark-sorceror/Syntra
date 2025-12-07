"use client";

import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { CalendarEvent } from "@/types/calendar";
import { Tasks } from "./tasks/page";

export default function App() {
    const [currentPage, setCurrentPage] = useState<
        "dashboard" | "calendar" | "tasks"
    >("tasks");

    // Too lazy to adapt sidebar to render page for now
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: "1",
            title: "Hello",
            start: new Date(2025, 11, 5, 17, 0),
            end: new Date(2025, 11, 5, 18, 0),
            color: "blue",
            category: "Study",
        },
    ]);

    const renderPage = () => {
        switch (currentPage) {
            case "calendar":
                return <Calendar events={events} setEvents={setEvents} />;
            case "tasks":
                return <Tasks events={events} setEvents={setEvents} />;
            default:
                return null;
        }
    };

    return renderPage();
}
