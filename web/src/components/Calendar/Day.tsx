import React, { useRef } from "react";

import { CalendarDayCellProperties } from "@/types/calendar";
import { getDateKey } from "@/utils/dateUtils";
import EventEditor from "./EventEditor";

const CalendarDayCell: React.FC<CalendarDayCellProperties> = ({
    day,
    events,
    editingEvent,
    eventTitle,
    onEventEdit,
    onEventCancelEdit,
    onEventSaveEdit,
    onTitleChange,
}) => {
    const cellRef = useRef<HTMLDivElement>(null);

    const handleEventDoubleClick = (
        e: React.MouseEvent<HTMLDivElement>,
        eventIndex: number
    ) => {
        e.stopPropagation();

        if (!cellRef.current) return;

        const cellRect = cellRef.current.getBoundingClientRect();
        const eventRect = e.currentTarget.getBoundingClientRect();

        const dateKey = getDateKey(day.date);

        const position = {
            x: eventRect.left - cellRect.left,
            y: eventRect.top - cellRect.top,
        };

        onEventEdit(dateKey, eventIndex, position);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!cellRef.current) return;

        const eventRect = e.currentTarget.getBoundingClientRect();

        const position = {
            x: eventRect.right,
            y: eventRect.top + 35,
        };

        const dateKey = getDateKey(day.date);
        const newIndex = events.length;

        onEventEdit(dateKey, newIndex, position);
    };

    return (
        <div
            ref={cellRef}
            className={`day ${
                day.isCurrentMonth ? (day.isToday ? "today" : "") : "pm"
            }`}
            onDoubleClick={handleDoubleClick}
            style={{ position: "relative" }}
        >
            {day.day}

            {events.map((event, index) => {
                const isEditing =
                    editingEvent &&
                    editingEvent.dateKey === getDateKey(day.date) &&
                    editingEvent.index === index;

                return (
                    <div
                        key={index}
                        className="event"
                        style={{ position: "relative" }}
                        onDoubleClick={(e) => handleEventDoubleClick(e, index)}
                    >
                        {event.title}

                        {isEditing && (
                            <EventEditor
                                x={editingEvent.position.x}
                                y={editingEvent.position.y}
                                eventTitle={eventTitle}
                                onTitleChange={onTitleChange}
                                onSave={onEventSaveEdit}
                                onCancel={onEventCancelEdit}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarDayCell;
