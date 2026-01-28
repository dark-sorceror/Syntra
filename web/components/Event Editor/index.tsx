import React, { useState, useEffect } from "react";

import { EventEditorProperties, CalendarEvent } from "@/types/calendar";

import "./index.css";

const colors = [
    { name: "Blue", value: "#87cefa" },
    { name: "Green", value: "#90ee90" },
    { name: "Red", value: "#f08080" },
    { name: "Yellow", value: "#fafad2" },
];

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
    const [color, setColor] = useState(event?.color || "#87cefa");
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
            description,
            color,
            isAllDay,
            start,
            end,
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

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                        rows={1}
                    />
                    <div className="all-day">
                        All Day
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isAllDay}
                                onChange={(e) => setIsAllDay(e.target.checked)}
                                className="all-day-checkbox"
                            />
                            <div className="slider"></div>
                        </label>
                    </div>

                    <div className="starts-row">
                        Starts
                        <div className="inputs">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                            {!isAllDay && (
                                <input
                                    type="text"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="ends-row">
                        Ends
                        <div className="inputs">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            {!isAllDay && (
                                <input
                                    type="text"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="colors-row">
                        Color
                        <div className="event-colors">
                            {colors.map((c) => (
                                <div
                                    key={c.value}
                                    onClick={() => setColor(c.value)}
                                    className={`event-color ${
                                        color === c.value ? "active" : ""
                                    }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="holder-area"></div>

                    <div className="buttons">
                        <div className="trash">
                            {event?.id && onDelete ? (
                                <button
                                    className="delete-button"
                                    onClick={() => onDelete(event.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        id="Outline"
                                        viewBox="0 0 24 24"
                                        width="512"
                                        height="512"
                                    >
                                        <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" />
                                        <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
                                        <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
                                    </svg>
                                </button>
                            ) : (
                                ""
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="cu-button">
                            {event?.id ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
