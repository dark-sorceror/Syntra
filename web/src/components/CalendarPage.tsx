import { useState } from "react";

import { MonthView } from "./MonthView";
import { EventEditor } from "./EventEditor";

import { CalendarEvent } from "../types/calendar";
import { getMonthName } from "@/utils/dateUtils";
import { eventCrud } from "@/hooks/eventCrud";

import "./index.css";

interface CalendarPageProps {
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
}

export function CalendarPage({ events, setEvents }: CalendarPageProps) {
    const [currentView, setCurrentView] = useState<"day" | "week" | "month">(
        "month"
    );
    const [currentDate, setCurrentDate] = useState(new Date());

    const {
        position,
        showEventEditor,
        editingEvent,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleOpenEventEditor,
        handleCloseEventEditor,
    } = eventCrud({
        events,
        setEvents,
    });

    const renderView = () => {
        switch (currentView) {
            case "day":
                return <></>;
            case "week":
                return <></>;
            case "month":
                return (
                    <MonthView
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        events={events}
                        setEvents={setEvents}
                        onOpenEventEditor={handleOpenEventEditor}
                    />
                );
            default:
                return null;
        }
    };

    const goNextView = () => {
        const newDate = new Date(currentDate);

        switch (currentView) {
            case "day":
                newDate.setDate(newDate.getDate() + 1);

                break;
            case "week":
                newDate.setDate(newDate.getDate() + 7);

                break;
            case "month":
                newDate.setMonth(newDate.getMonth() + 1);

                break;
        }

        setCurrentDate(newDate);
    };

    const goPrevView = () => {
        const newDate = new Date(currentDate);

        switch (currentView) {
            case "day":
                newDate.setDate(newDate.getDate() - 1);

                break;
            case "week":
                newDate.setDate(newDate.getDate() - 7);

                break;
            case "month":
                newDate.setMonth(newDate.getMonth() - 1);

                break;
        }

        setCurrentDate(newDate);
    };

    return (
        <div className="calendar-wrapper">
            <div className="cw-top">
                <div className="month-year">
                    {getMonthName(currentDate.getMonth())}{" "}
                    <span>{currentDate.getFullYear()}</span>
                </div>
                <div className="dwm-switcher">
                    <div
                        className={`day-switcher ${
                            currentView === "day" ? "active" : ""
                        }`}
                        onClick={() => setCurrentView("day")}
                    >
                        d<span>Day</span>
                    </div>
                    <div
                        className={`week-switcher ${
                            currentView === "week" ? "active" : ""
                        }`}
                        onClick={() => setCurrentView("week")}
                    >
                        w<span>Week</span>
                    </div>
                    <div
                        className={`month-switcher ${
                            currentView === "month" ? "active" : ""
                        }`}
                        onClick={() => setCurrentView("month")}
                    >
                        m<span>Month</span>
                    </div>
                </div>
                <div className="bf-switcher">
                    <div onClick={goPrevView} className="back">
                        a
                    </div>

                    <div
                        onClick={() => setCurrentDate(new Date())}
                        className="today"
                    >
                        Today
                    </div>

                    <div onClick={goNextView} className="forward">
                        d
                    </div>
                </div>
            </div>

            <div className="calendar-area">{renderView()}</div>

            {showEventEditor && (
                <EventEditor
                    x={position.x}
                    y={position.y}
                    event={editingEvent}
                    onSave={
                        editingEvent?.id ? handleUpdateEvent : handleCreateEvent
                    }
                    onDelete={editingEvent?.id ? handleDeleteEvent : undefined}
                    onClose={handleCloseEventEditor}
                />
            )}
        </div>
    );
}
