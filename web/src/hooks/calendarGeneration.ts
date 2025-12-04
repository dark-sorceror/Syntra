import { useState, useMemo } from "react";

import {
    CalendarViewProperties,
    CalendarEvent,
    Position,
} from "@/types/calendar";

import {
    getDaysInMonth,
    getFirstDayOfMonth,
    weekdayNames,
    monthNames,
} from "../utils/dateUtils";

export const generateCalendar = ({
    currentDate,
    setCurrentDate,
    events,
    onOpenEventEditor,
}: CalendarViewProperties) => {
    const today = useMemo(() => new Date(), []);

    const [position, setPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const filterEventsForDay = (day: number) => {
        return events
            .filter((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                const date = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                );

                const startDate = new Date(
                    eventStart.getFullYear(),
                    eventStart.getMonth(),
                    eventStart.getDate()
                );
                const endDate = new Date(
                    eventEnd.getFullYear(),
                    eventEnd.getMonth(),
                    eventEnd.getDate()
                );

                return (
                    date >= startDate &&
                    date <= endDate &&
                    eventStart.getMonth() === currentDate.getMonth() &&
                    eventStart.getFullYear() === currentDate.getFullYear()
                );
            })
            .sort((a, b) => {
                return a.start.getTime() - b.start.getTime();
            });
    };

    const isEventStart = (event: CalendarEvent, day: number) => {
        const eventStart = new Date(event.start);

        return (
            eventStart.getDate() === day &&
            eventStart.getMonth() === currentDate.getMonth() &&
            eventStart.getFullYear() === currentDate.getFullYear()
        );
    };

    const handleCreateNewEvent = (day: number, e: React.MouseEvent) => {
        const start = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day,
            9,
            0
        );

        const end = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day,
            10,
            0
        );

        const eventRect = e.currentTarget.children.length
            ? e.currentTarget.lastElementChild?.getBoundingClientRect()
            : e.currentTarget.getBoundingClientRect();

        const newPosition = {
            x: eventRect
                ? e.currentTarget.children.length >= 1
                    ? eventRect?.right + 16
                    : eventRect?.right
                : 0,
            y: eventRect
                ? e.currentTarget.children.length == 1
                    ? eventRect?.top + 25
                    : e.currentTarget.children.length > 1
                    ? eventRect?.top + 25
                    : eventRect?.top + 35
                : 0,
        };

        setPosition(newPosition);

        onOpenEventEditor(newPosition, undefined, start, end);
    };

    const handleEditEvent = (event: CalendarEvent, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("resize-handle")) {
            return;
        }

        e.stopPropagation();

        const eventRect = e.currentTarget.getBoundingClientRect();

        const newPosition = {
            x: eventRect.right + 16,
            y: eventRect.top,
        };

        setPosition(newPosition);

        onOpenEventEditor(newPosition, event);
    };

    const daysInPrevMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
    );
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const days = [];

    for (let i = 1; i < firstDay; i++) {
        days.push(daysInPrevMonth.getDate() - (firstDay - 1) + i);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    if (days.length > 28) {
        for (let i = 1; days.length < 35; i++) {
            days.push(i);
        }
    }

    return {
        monthNames,
        weekdayNames,
        nextMonth,
        previousMonth,
        isToday,
        filterEventsForDay,
        isEventStart,
        handleCreateNewEvent,
        handleEditEvent,
        days,
    };
};
