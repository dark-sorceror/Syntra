import { useState } from "react";

import {
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
} from "@/hooks/useEvents";

import { CalendarEvent, Position } from "@/types";

export const calendarEventCrud = () => {
    const [showEventEditor, setShowEventEditor] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(
        null,
    );
    const [position, setPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const createEvent = useCreateEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();

    const handleSaveEvent = (event: any) => {
        if (event.id && event.id !== "") {
            updateEvent.mutate({
                id: Number(event.id),
                title: event.title,
                category: event.category || "work",
                start_time: new Date(event.start).toISOString(),
                end_time: new Date(event.end).toISOString(),
            });
        } else {
            createEvent.mutate({
                title: event.title,
                category: event.category || "work",
                start_time: new Date(event.start).toISOString(),
                end_time: new Date(event.end).toISOString(),
            });
        }

        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = (eventId: string | number) => {
        deleteEvent.mutate(Number(eventId));

        setShowEventEditor(false);
        setEditingEvent(null);
    };

    const handleOpenEventEditor = (
        position?: Position,
        event?: CalendarEvent,
        start?: Date,
        end?: Date,
    ) => {
        setPosition(position || { x: 0, y: 0 });

        if (event) {
            setEditingEvent(event);
        } else if (start && end) {
            const placeholder = {
                id: "",
                title: "New Event",
                start,
                end,
                color: "#87cefa",
                category: "work",
            };
            setEditingEvent(placeholder);
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
        handleSaveEvent,
        handleDeleteEvent,
        handleOpenEventEditor,
        handleCloseEventEditor,
    };
};
