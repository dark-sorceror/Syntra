import { useState, useCallback } from "react";

import { Event } from "../types/calendar";
import { EditingEvent } from "../types/calendar";

export const calendarEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [editingEvent, setEditingEvent] = useState<EditingEvent>(null);
    const [eventTitle, setEventTitle] = useState("New Event");

    const handleEventEdit = useCallback(
        (
            dateKey: string,
            index: number,
            position: { x: number; y: number }
        ) => {
            setEditingEvent({ dateKey, index, position });

            const found = events.find(
                (ev) => ev.date === `${dateKey}/${index}`
            );

            setEventTitle(found ? found.title : "New Event");

            if (!found) {
                setEvents((prev) => [
                    ...prev,
                    { date: `${dateKey}/${index}`, title: "New Event" },
                ]);
            }
        },
        [events]
    );

    const handleEventCancelEdit = useCallback(() => {
        setEvents((prev) =>
            prev.filter((ev) => {
                if (!editingEvent) return true;
                if (ev.date !== `${editingEvent.dateKey}/${editingEvent.index}`)
                    return true;

                return ev.title !== "New Event";
            })
        );
        setEditingEvent(null);
        setEventTitle("");
    }, [editingEvent]);

    const handleEventSaveEdit = useCallback(() => {
        if (!editingEvent || !eventTitle.trim()) {
            handleEventCancelEdit();

            return;
        }

        const targetDate = `${editingEvent.dateKey}/${editingEvent.index}`;

        setEvents((prev) =>
            prev.map((ev) =>
                ev.date === targetDate
                    ? { ...ev, title: eventTitle.trim() }
                    : ev
            )
        );

        setEditingEvent(null);
        setEventTitle("");
    }, [editingEvent, eventTitle, handleEventCancelEdit]);

    return {
        events,
        editingEvent,
        eventTitle,
        handleEventEdit,
        handleEventCancelEdit,
        handleEventSaveEdit,
        setEventTitle,
    };
};
