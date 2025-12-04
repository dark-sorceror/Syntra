import React, { useState, useEffect } from "react";

import { EventEditorProperties, CalendarEvent } from "@/types/calendar";

export const EventEditor: React.FC<EventEditorProperties> = ({
    x,
    y,
    event,
    onSave,
    onDelete,
    onClose,
}: EventEditorProperties) => {
    const [title, setTitle] = useState(event?.title || "");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [category, setCategory] = useState(event?.category || "Work");
    const [color, setColor] = useState(event?.color || "bg-blue-500");
    const [description, setDescription] = useState(event?.description || "");
    const [isAllDay, setIsAllDay] = useState(event?.isAllDay || false);

    useEffect(() => {
        if (event) {
            const start = new Date(event.start);
            const end = new Date(event.end);

            setStartDate(start.toISOString().split("T")[0]);
            setStartTime(start.toTimeString().slice(0, 5));
            setEndDate(end.toISOString().split("T")[0]);
            setEndTime(end.toTimeString().slice(0, 5));
        }
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let start: Date;
        let end: Date;

        start = new Date(`${startDate}T${startTime}`);
        end = new Date(`${endDate}T${endTime}`);

        const eventData = {
            ...(event?.id ? { id: event.id } : {}),
            title,
            start,
            end,
            color,
            category,
            description,
            isAllDay,
        };

        onSave(eventData as CalendarEvent);
    };

    return (
        <>
            <div className="editor-overlay" onClick={onClose} />
            <div
                className="event-editor-popup"
                style={{
                    top: y,
                    left: x,
                }}
            >
                <div className="ee-title">
                    {event?.id ? "Edit Event" : "Create Event"}
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Title"
                        required
                    />

                    <div className="buttons">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            {event?.id ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
