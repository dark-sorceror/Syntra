import { useState } from "react";

import { MonthView } from "./MonthView";
import { EventEditor } from "./EventEditor";

import { CalendarEvent } from "../types/calendar";
import { getMonthName } from "@/utils/dateUtils";
import { calendarEventCrud } from "@/hooks/calendarEventCrud";

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
        handleSaveEvent,
        handleDeleteEvent,
        handleOpenEventEditor,
        handleCloseEventEditor,
    } = calendarEventCrud({
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
                        editingEvent={editingEvent}
                        showEventEditor={showEventEditor}
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
                        Day
                    </div>
                    <div
                        className={`week-switcher ${
                            currentView === "week" ? "active" : ""
                        }`}
                        onClick={() => setCurrentView("week")}
                    >
                        Week
                    </div>
                    <div
                        className={`month-switcher ${
                            currentView === "month" ? "active" : ""
                        }`}
                        onClick={() => setCurrentView("month")}
                    >
                        Month
                    </div>
                </div>
                <div className="bf-switcher">
                    <div onClick={goPrevView} className="back">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Outline"
                            viewBox="0 0 24 24"
                            width="512"
                            height="512"
                        >
                            <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z" />
                        </svg>
                    </div>

                    <div
                        onClick={() => setCurrentDate(new Date())}
                        className="today"
                    >
                        Today
                    </div>

                    <div onClick={goNextView} className="forward">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Outline"
                            viewBox="0 0 24 24"
                            width="512"
                            height="512"
                        >
                            <path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z" />
                        </svg>
                    </div>
                </div>
                <div className="add">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        viewBox="0 0 24 24"
                        width="512"
                        height="512"
                    >
                        <path d="M17,11H13V7a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1v4H7a1,1,0,0,0-1,1H6a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13h4a1,1,0,0,0,1-1h0A1,1,0,0,0,17,11Z" />
                    </svg>
                </div>
            </div>

            <div className="calendar-area">{renderView()}</div>

            {showEventEditor && (
                <EventEditor
                    x={position.x}
                    y={position.y}
                    event={editingEvent}
                    onSave={handleSaveEvent}
                    onDelete={editingEvent?.id ? handleDeleteEvent : undefined}
                    onClose={handleCloseEventEditor}
                />
            )}
        </div>
    );
}
