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
            id: Date.now().toString(),
        };

        setEvents([event, ...events]);
        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleSaveEvent = (
        event: CalendarEvent | Omit<CalendarEvent, "id">
    ) => {
        if ("id" in event && event.id !== "") {
            handleUpdateEvent(event as CalendarEvent);
        } else {
            handleCreateEvent(event as Omit<CalendarEvent, "id">);
        }
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
            setEditingEvent({
                id: "",
                title: "New Event",
                start,
                end,
                color: "#87cefa",
                category: "Work",
            });
        }

        setShowEventEditor(true);
    };

    const handleCloseEventEditor = () => {
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
