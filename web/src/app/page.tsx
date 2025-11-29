"use client";

import { useMemo, useState } from "react";

import "./home.css";

interface CalendarDay {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    date: Date;
}

type CalendarView = "day" | "week" | "month";

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

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getMonthName = (monthIndex: number): string => {
        return new Date(2025, monthIndex, 1).toLocaleString("default", {
            month: "long",
        });
    };

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

        return calendarDays;
    }, [viewDate, today]);

    const handleActiveView = (view: CalendarView): void => {
        setActiveView(view);
    };

    return (
        <div className="calendar-wrapper">
            <div className="top">
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
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                        >
                            <path d="M22.047,6.313c-.686-2.044-2.315-3.674-4.361-4.361-3.773-1.266-7.6-1.266-11.373,0h0c-2.045,.688-3.675,2.317-4.36,4.361-1.266,3.773-1.266,7.6,0,11.373,.686,2.044,2.315,3.674,4.361,4.361,1.887,.633,3.786,.949,5.687,.949s3.8-.316,5.687-.949c2.045-.688,3.675-2.317,4.36-4.361,1.266-3.773,1.266-7.6,0-11.373Zm-1.896,10.736c-.487,1.454-1.646,2.613-3.1,3.102-3.352,1.125-6.75,1.125-10.101,0-1.454-.488-2.613-1.647-3.101-3.102-1.125-3.351-1.125-6.749,0-10.1,.487-1.454,1.646-2.613,3.101-3.102,3.352-1.125,6.75-1.125,10.101,0,1.454,.488,2.613,1.647,3.101,3.102,1.125,3.351,1.125,6.749,0,10.1Z" />
                            <path d="M13.607,9.057c.526-.169,.814-.732,.645-1.259-.17-.524-.732-.813-1.259-.644-4.269,1.378-4.882,4.535-4.907,4.669-.021,.117-.021,.236,0,.354,.024,.134,.638,3.291,4.907,4.669,.102,.033,.206,.049,.307,.049,.422,0,.815-.27,.952-.692,.169-.526-.119-1.09-.645-1.259-2.578-.833-3.319-2.409-3.5-2.941,.186-.544,.93-2.114,3.5-2.945Z" />
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
                            <path d="M22.047,6.313c-.686-2.044-2.315-3.674-4.361-4.361-3.773-1.266-7.6-1.266-11.374,0-2.045,.688-3.675,2.317-4.36,4.361-1.266,3.773-1.266,7.6,0,11.373,.686,2.044,2.315,3.674,4.361,4.361,1.887,.633,3.787,.949,5.687,.949s3.8-.316,5.687-.949h0c2.045-.688,3.675-2.317,4.36-4.361,1.266-3.773,1.266-7.6,0-11.373Zm-1.896,10.736c-.487,1.454-1.646,2.613-3.101,3.102-3.352,1.125-6.75,1.125-10.101,0-1.454-.488-2.613-1.647-3.101-3.102-1.125-3.351-1.125-6.749,0-10.1,.487-1.454,1.646-2.613,3.1-3.102,1.676-.562,3.363-.843,5.051-.843s3.375,.28,5.05,.843c1.454,.488,2.613,1.647,3.101,3.102,1.125,3.351,1.125,6.749,0,10.1Z" />
                            <path d="M11.007,7.154c-.525-.17-1.089,.119-1.259,.644-.169,.526,.119,1.09,.645,1.259,2.578,.833,3.319,2.409,3.5,2.941-.186,.544-.93,2.114-3.5,2.945-.526,.169-.814,.732-.645,1.259,.137,.423,.529,.692,.952,.692,.102,0,.205-.016,.307-.049,4.269-1.378,4.882-4.535,4.907-4.669,.021-.117,.021-.236,0-.354-.024-.134-.638-3.291-4.907-4.669Z" />
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
                            <div
                                key={index}
                                className={`day ${
                                    day.isCurrentMonth
                                        ? day.isToday
                                            ? "today"
                                            : ""
                                        : "pm"
                                }`}
                            >
                                {day.day}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
