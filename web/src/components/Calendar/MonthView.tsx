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
            newStart.setDate(newStart.getDate() + dayDifference);

            const newEnd = new Date(draggedEvent.end);
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

            <div className={`calendar-main ${days.length > 35 ? "extra" : ""}`}>
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
                                        {event.title}
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
