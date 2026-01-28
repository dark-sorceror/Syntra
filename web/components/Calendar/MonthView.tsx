import { useState } from "react";

import { CalendarViewProperties } from "@/types/calendar";
import { generateCalendar } from "@/hooks/calendarGeneration";

import { CalendarEvent } from "@/types/calendar";

export const MonthView: React.FC<CalendarViewProperties> = ({
    currentDate,
    setCurrentDate,
    events,
    setEvents,
    onOpenEventEditor,
    editingEvent,
    showEventEditor,
}: CalendarViewProperties) => {
    const {
        weekdayNames,
        isToday,
        filterEventsForDay,
        handleCreateNewEvent,
        handleEditEvent,
        days,
        isEventStart,
    } = generateCalendar({
        currentDate,
        setCurrentDate,
        events,
        setEvents,
        onOpenEventEditor,
        editingEvent,
        showEventEditor,
    });

    const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(
        null
    );
    const [dragStartDay, setDragStartDay] = useState<number | null>(null);
    const [resizingEvent, setResizingEvent] = useState<{
        event: CalendarEvent;
        edge: "left" | "right";
    } | null>(null);

    const handleEventDragStart = (
        event: CalendarEvent,
        day: number,
        e: React.DragEvent
    ) => {
        e.stopPropagation();
        setDraggedEvent(event);
        setDragStartDay(day);
    };

    const handleDayDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDayDrop = (day: number, e: React.DragEvent) => {
        e.preventDefault();

        if (draggedEvent && dragStartDay !== null) {
            const dayDifference = day - dragStartDay;

            const newStart = new Date(draggedEvent.start);
            const newEnd = new Date(draggedEvent.end);

            newStart.setDate(newStart.getDate() + dayDifference);
            newEnd.setDate(newEnd.getDate() + dayDifference);

            const updatedEvent = {
                ...draggedEvent,
                start: newStart,
                end: newEnd,
            };

            setEvents(
                events.map((e) => (e.id === draggedEvent.id ? updatedEvent : e))
            );
            setDraggedEvent(null);
            setDragStartDay(null);
        }
    };

    const handleResizeStart = (
        event: CalendarEvent,
        edge: "left" | "right",
        e: React.MouseEvent
    ) => {
        e.stopPropagation();
        e.preventDefault();

        setResizingEvent({ event, edge });
    };

    const handleDayMouseEnter = (day: number) => {
        if (resizingEvent) {
            const { event, edge } = resizingEvent;
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            const targetDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );

            if (edge === "left") {
                if (targetDate <= eventEnd) {
                    const newStart = new Date(targetDate);

                    newStart.setHours(
                        eventStart.getHours(),
                        eventStart.getMinutes(),
                        0,
                        0
                    );

                    const updatedEvent = { ...event, start: newStart };

                    setEvents(
                        events.map((e) =>
                            e.id === event.id ? updatedEvent : e
                        )
                    );
                    setResizingEvent({ event: updatedEvent, edge });
                }
            } else {
                if (targetDate >= eventStart) {
                    const newEnd = new Date(targetDate);

                    newEnd.setHours(
                        eventEnd.getHours(),
                        eventEnd.getMinutes(),
                        0,
                        0
                    );

                    const updatedEvent = { ...event, end: newEnd };

                    setEvents(
                        events.map((e) =>
                            e.id === event.id ? updatedEvent : e
                        )
                    );
                    setResizingEvent({ event: updatedEvent, edge });
                }
            }
        }
    };

    const handleMouseUp = () => {
        setResizingEvent(null);
    };

    return (
        <>
            <div className="calendar-top">
                {weekdayNames.map((day, index) => (
                    <div
                        key={day}
                        className={`${
                            isToday((index + 1) % 7 || 0) ? "today" : ""
                        } weekday`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div
                className={`calendar-main ${days.length > 35 ? "extra" : ""}`}
                onMouseUp={handleMouseUp}
            >
                {days.map((day, index) => {
                    let dayEvents = day ? filterEventsForDay(day) : [];

                    const isCurrentMonth =
                        day && day.getMonth() === currentDate.getMonth();

                    return (
                        <div
                            key={index}
                            onDoubleClick={(e) =>
                                day && handleCreateNewEvent(day, e)
                            }
                            onDragOver={day ? handleDayDragOver : undefined}
                            onDrop={
                                day
                                    ? (e) => handleDayDrop(day.getDate(), e)
                                    : undefined
                            }
                            onMouseEnter={() =>
                                day && handleDayMouseEnter(day.getDate())
                            }
                            className={`day ${
                                isToday(day?.getDate() || 0) && isCurrentMonth
                                    ? "today"
                                    : ""
                            } 
                    ${!isCurrentMonth ? "pm" : ""}`}
                        >
                            {day?.getDate()}

                            {dayEvents.slice(0, 4).map((event) => {
                                const isPlaceholder =
                                    event.id === "" &&
                                    event.title === "New Event";

                                const isStart = isEventStart(
                                    event,
                                    day?.getDate() || 0
                                );

                                return (
                                    <div
                                        key={
                                            event.id || "new-event-placeholder"
                                        }
                                        draggable={isStart}
                                        onDoubleClick={(e) =>
                                            handleEditEvent(event, e)
                                        }
                                        onDragStart={
                                            isStart
                                                ? (e) =>
                                                      handleEventDragStart(
                                                          event,
                                                          day?.getDate() || 0,
                                                          e
                                                      )
                                                : undefined
                                        }
                                        className={`event ${
                                            isPlaceholder
                                                ? "placeholder-event"
                                                : ""
                                        }`}
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {isStart && !event.isAllDay && (
                                            <div
                                                className="resize-handle absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 opacity-0 group-hover:opacity-100"
                                                onMouseDown={(e) =>
                                                    handleResizeStart(
                                                        event,
                                                        "left",
                                                        e
                                                    )
                                                }
                                            ></div>
                                        )}
                                        {event.title}
                                        {!event.isAllDay && (
                                            <div
                                                className="resize-handle absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 opacity-0 group-hover:opacity-100"
                                                onMouseDown={(e) =>
                                                    handleResizeStart(
                                                        event,
                                                        "right",
                                                        e
                                                    )
                                                }
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}

                            {dayEvents.length > 4 && (
                                <div className="extra-text">
                                    +{dayEvents.length - 4} more
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};
