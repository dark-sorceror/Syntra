import { useState } from "react";

import { CalendarEvent, EventProperties, Position } from "@/types/calendar";

export const calendarEventCrud = ({ events, setEvents }: EventProperties) => {
    const [showEventEditor, setShowEventEditor] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(
        null
    );
    const [position, setPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const handleCreateEvent = (newEvent: Omit<CalendarEvent, "id">) => {
        const event: CalendarEvent = {
            ...newEvent,
            id: "",
        };

        setEvents([event, ...events]);
        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleSaveEvent = (
        event: CalendarEvent | Omit<CalendarEvent, "id">
    ) => {
        const cleanEvents = events.filter((e) => e.id);

        if ("id" in event && event.id !== "" && event.id) {
            const updatedList = cleanEvents.map((e) =>
                e.id === event.id ? (event as CalendarEvent) : e
            );

            setEvents(updatedList);
        } else {
            const newRealEvent: CalendarEvent = {
                ...event,
                id: Date.now().toString(),
            };

            setEvents([...cleanEvents, newRealEvent]);
        }

        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
        setEvents(
            events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(events.filter((e) => e.id !== eventId));
        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleOpenEventEditor = (
        position?: Position,
        event?: CalendarEvent,
        start?: Date,
        end?: Date
    ) => {
        setPosition(position || { x: 0, y: 0 });

        if (event) {
            setEditingEvent(event);
        } else if (start && end) {
            const placeholder: CalendarEvent = {
                id: "",
                title: "New Event",
                start,
                end,
                color: "#87cefa",
                category: "Work",
            };

            setEditingEvent(placeholder);
            setEvents((prev) => [...prev, placeholder]);
        }

        setShowEventEditor(true);
    };

    const handleCloseEventEditor = () => {
        const filtered = events.filter((e) => e.id);

        setEvents(filtered);
        setShowEventEditor(false);
        setEditingEvent(null);
    };

    return {
        position,
        showEventEditor,
        editingEvent,
        handleCreateEvent,
        handleSaveEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleOpenEventEditor,
        handleCloseEventEditor,
    };
};
