import { useState, useMemo, useCallback } from "react";

import { CalendarView, CalendarDay } from "../types/calendar";
import { getDaysInMonth } from "../utils/dateUtils";

export const generateCalendar = () => {
    const today = useMemo(() => new Date(), []);

    const [activeView, setActiveView] = useState<CalendarView>("month");
    const [viewDate, setViewDate] = useState(new Date());

    const changeMonth = useCallback((direction: "prev" | "next"): void => {
        setViewDate((prevDate) => {
            const newDate = new Date(prevDate);

            newDate.setMonth(
                prevDate.getMonth() + (direction === "next" ? 1 : -1)
            );

            return newDate;
        });
    }, []);

    const goToToday = useCallback((): void => {
        setViewDate(new Date());
    }, []);

    const handleActiveView = useCallback((view: CalendarView): void => {
        setActiveView(view);
    }, []);

    const generateDaysInMonth: CalendarDay[] = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const totalDays = getDaysInMonth(year, month);
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

    return {
        viewDate,
        activeView,
        generateDaysInMonth,
        changeMonth,
        goToToday,
        handleActiveView,
    };
};
