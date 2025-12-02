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

        const eventRect = e.currentTarget.getBoundingClientRect();

        const dateKey = getDateKey(day.date);

        const position = {
            x: eventRect.right + 16,
            y: eventRect.top,
        };

        onEventEdit(dateKey, eventIndex, position);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!cellRef.current) return;

        // :sob:
        const eventRect = e.currentTarget.children.length
            ? e.currentTarget.lastElementChild?.getBoundingClientRect()
            : e.currentTarget.getBoundingClientRect();

        const position = {
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
