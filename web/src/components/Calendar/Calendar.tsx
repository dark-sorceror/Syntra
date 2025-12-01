"use client";

import { CalendarDay } from "@/types/calendar";
import { calendarEvents } from "@/hooks/calendarEvents";
import { generateCalendar } from "@/hooks/calendarGeneration";
import { getMonthName, getDateKey } from "@/utils/dateUtils";
import { CalendarView } from "@/types/calendar";
import CalendarDayCell from "./Day";

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function Calendar() {
    const {
        events,
        editingEvent,
        eventTitle,
        handleEventEdit,
        handleEventCancelEdit,
        handleEventSaveEdit,
        setEventTitle,
    } = calendarEvents();

    const {
        viewDate,
        activeView,
        generateDaysInMonth,
        changeMonth,
        goToToday,
        handleActiveView,
    } = generateCalendar();

    const eventsForThisDay = (day: CalendarDay) =>
        events.filter(
            (event) => event.date.split("/")[0] === getDateKey(day.date)
        );

    return (
        <div className="calendar-wrapper">
            <div className="cw-top">
                <div className="month-year">
                    {getMonthName(viewDate.getMonth())}{" "}
                    <span>{viewDate.getFullYear()}</span>
                </div>

                <div className="dwm-switcher">
                    {["day", "week", "month"].map((view) => (
                        <div
                            key={view}
                            className={`${view}-switcher ${
                                activeView === view ? "active" : ""
                            }`}
                            onClick={() =>
                                handleActiveView(view as CalendarView)
                            }
                        >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                        </div>
                    ))}
                </div>

                <div className="bf-switcher">
                    <div className="back" onClick={() => changeMonth("prev")}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M24,12A12,12,0,1,0,12,24,12.013,12.013,0,0,0,24,12ZM2,12A10,10,0,1,1,12,22,10.011,10.011,0,0,1,2,12Z" />
                            <path d="M8,12a2.993,2.993,0,0,1,.752-1.987l.777-.84L12.353,6.3a1,1,0,1,1,1.426,1.4l-2.829,2.879-.7.759a1,1,0,0,0,0,1.323l.693.752L13.779,16.3a1,1,0,0,1-1.426,1.4L9.524,14.822l-.769-.833A2.99,2.99,0,0,1,8,12Z" />
                        </svg>
                    </div>

                    <div className="today" onClick={goToToday}>
                        Today
                    </div>

                    <div
                        className="forward"
                        onClick={() => changeMonth("next")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M0,12A12,12,0,1,0,12,0,12.013,12.013,0,0,0,0,12Zm22,0A10,10,0,1,1,12,2,10.011,10.011,0,0,1,22,12Z" />
                            <path d="M16,12a2.993,2.993,0,0,1-.752,1.987l-.777.84-3.647,3.873a1,1,0,1,1-1.426-1.4l2.829-2.879.7-.759a1,1,0,0,0,0-1.323l-.693-.752L10.221,7.7a1,1,0,1,1,1.426-1.4l2.829,2.879c.2.2.48.507.769.833A2.99,2.99,0,0,1,16,12Z" />
                        </svg>
                    </div>
                </div>

                <div className="add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M14.824,11h-1.824v-1.825c0-.552-.447-1-1-1s-1,.448-1,1v1.825h-1.824c-.553,0-1,.448-1,1s.447,1,1,1h1.824v1.825c0,.552,.447,1,1,1s1-.448,1-1v-1.825h1.824c.553,0,1-.448,1-1s-.447-1-1-1Z" />
                        <path d="M11.994,1C4.929,1.044,1,5.011,1,12.019c0,6.891,3.933,10.94,11.006,10.981,7.162-.042,10.861-3.737,10.994-11.017-.122-7.037-4.026-10.938-11.006-10.983Zm.012,20c-6.026-.035-8.888-2.895-9.006-9,.113-6.019,3.059-8.963,8.994-9,5.874,.038,8.904,3.072,9.006,8.981-.112,6.117-2.974,8.983-8.994,9.019Z" />
                    </svg>
                </div>
            </div>

            <div className="calendar-area">
                <div className="calendar-top">
                    {weekdays.map((day, index) => (
                        <div key={index} className="weekday">
                            {day}
                        </div>
                    ))}
                </div>

                <div
                    className={`calendar-main ${
                        generateDaysInMonth.length > 35 ? "extra" : ""
                    }`}
                >
                    {generateDaysInMonth.map((day, index) => (
                        <CalendarDayCell
                            key={index}
                            day={day}
                            events={eventsForThisDay(day)}
                            editingEvent={editingEvent}
                            eventTitle={eventTitle}
                            onEventEdit={handleEventEdit}
                            onEventCancelEdit={handleEventCancelEdit}
                            onEventSaveEdit={handleEventSaveEdit}
                            onTitleChange={setEventTitle}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
