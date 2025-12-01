"use client";

import { useMemo, useState } from "react";

import "./home.css";

type CalendarView = "day" | "week" | "month";

interface CalendarDay {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    date: Date;
}

interface Event {
    date: Date;
    title: string;
}

interface CalendarDayCellType {
    day: CalendarDay;
}

export const CalendarDayCell: React.FC<CalendarDayCellType> = ({ day }) => {
    // Import from database
    const [events, setEvents] = useState<Event[]>([]);

    const dayClass = day.isCurrentMonth ? (day.isToday ? "today" : "") : "pm";

    const createNewEvent = (): void => {
        const newEvent: Event = {
            date: day.date,
            title: "event",
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    const dayEvents = events.filter((eventData) => {
        return eventData.date.toDateString() === day.date.toDateString();
    });

    return (
        <div
            key={day.date.toDateString()}
            className={`day ${dayClass}`}
            onDoubleClick={createNewEvent}
        >
            {day.day}
            {dayEvents.map((eventData, index) => (
                <div key={index} className={`event ${eventData.title}`}>
                    New Event
                </div>
            ))}
        </div>
    );
};

const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

const getMonthName = (monthIndex: number): string => {
    return new Date(2025, monthIndex, 1).toLocaleString("default", {
        month: "long",
    });
};

export default function Home() {
    const weekdays: string[] = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ];

    const [activeView, setActiveView] = useState<CalendarView>("month");
    const [viewDate, setViewDate] = useState(new Date());

    const today = new Date();

    const changeMonth = (direction: "prev" | "next"): void => {
        setViewDate((prevDate) => {
            const newDate = new Date(prevDate);

            newDate.setMonth(
                prevDate.getMonth() + (direction === "next" ? 1 : -1)
            );

            return newDate;
        });
    };

    const goToToday = (): void => {
        setViewDate(new Date());
    };

    const generateDaysInMonth: CalendarDay[] = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const firstDayOfWeek = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();

        // First day to add to list
        const prevMonthOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        const prevMonthDaysCount = getDaysInMonth(year, month - 1);

        const calendarDays: CalendarDay[] = [];

        for (let i = 0; i < prevMonthOffset; i++) {
            const day = prevMonthDaysCount - prevMonthOffset + 1 + i;

            calendarDays.push({
                day: day,
                isCurrentMonth: false,
                isToday: false,
                date: new Date(year, month - 1, day),
            });
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const isToday = date.toDateString() === today.toDateString();

            calendarDays.push({
                day: i,
                isCurrentMonth: true,
                isToday: isToday,
                date: date,
            });
        }

        let remainingDays;

        if (calendarDays.length < 35) {
            remainingDays = 35 - calendarDays.length;
        } else if (calendarDays.length > 35) {
            remainingDays = 42 - calendarDays.length;
        } else {
            remainingDays = 0;
        }

        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i);

            calendarDays.push({
                day: i,
                isCurrentMonth: false,
                isToday: false,
                date: date,
            });
        }

        return calendarDays;
    }, [viewDate, today]);

    const handleActiveView = (view: CalendarView): void => {
        setActiveView(view);
    };

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
                                activeView == view ? "active" : ""
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
                            id="arrow-circle-down"
                            viewBox="0 0 24 24"
                        >
                            <path d="M24,12A12,12,0,1,0,12,24,12.013,12.013,0,0,0,24,12ZM2,12A10,10,0,1,1,12,22,10.011,10.011,0,0,1,2,12Z" />
                            <path d="M8,12a2.993,2.993,0,0,1,.752-1.987c.291-.327.574-.637.777-.84L12.353,6.3a1,1,0,0,1,1.426,1.4L10.95,10.58c-.187.188-.441.468-.7.759a1,1,0,0,0,0,1.323c.258.29.512.57.693.752L13.779,16.3a1,1,0,0,1-1.426,1.4L9.524,14.822c-.2-.2-.48-.507-.769-.833A2.99,2.99,0,0,1,8,12Z" />
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
                            id="arrow-circle-down"
                            viewBox="0 0 24 24"
                        >
                            <path d="M0,12A12,12,0,1,0,12,0,12.013,12.013,0,0,0,0,12Zm22,0A10,10,0,1,1,12,2,10.011,10.011,0,0,1,22,12Z" />
                            <path d="M16,12a2.993,2.993,0,0,1-.752,1.987c-.291.327-.574.637-.777.84L11.647,17.7a1,1,0,1,1-1.426-1.4L13.05,13.42c.187-.188.441-.468.7-.759a1,1,0,0,0,0-1.323c-.258-.29-.512-.57-.693-.752L10.221,7.7a1,1,0,1,1,1.426-1.4l2.829,2.879c.2.2.48.507.769.833A2.99,2.99,0,0,1,16,12Z" />
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
                    {weekdays.map((day: string, index: number) => (
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
                    {generateDaysInMonth.map(
                        (day: CalendarDay, index: number) => (
                            <CalendarDayCell key={index} day={day} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
