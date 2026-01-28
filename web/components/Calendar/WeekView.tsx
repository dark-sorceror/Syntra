import { useState } from "react";
import { CalendarEvent, CalendarViewProperties } from "../../types/calendar";
import { generateCalendar } from "@/hooks/calendarGeneration";
import {
    formatEventTime,
    getWeekdays,
    slotToTime,
    formatSlotTime,
} from "@/utils/dateUtils";

interface EventLayout {
    event: CalendarEvent;
}

export const WeekView: React.FC<CalendarViewProperties> = ({
    currentDate,
    setCurrentDate,
    events,
    setEvents,
    onOpenEventEditor,
    editingEvent,
    showEventEditor,
}: CalendarViewProperties) => {
    const { weekdayNames, isToday, handleCreateNewEvent, handleEditEvent } =
        generateCalendar({
            currentDate,
            setCurrentDate,
            events,
            setEvents,
            onOpenEventEditor,
            editingEvent,
            showEventEditor,
        });

    const [showNightHours, setShowNightHours] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{
        day: Date;
        slot: number;
    } | null>(null);
    const [dragEnd, setDragEnd] = useState<{ day: Date; slot: number } | null>(
        null
    );
    const [resizingEvent, setResizingEvent] = useState<{
        event: CalendarEvent;
        edge: "top" | "bottom";
    } | null>(null);

    const [draggingEvent, setDraggingEvent] = useState<CalendarEvent | null>(
        null
    );
    const [dragOffset, setDragOffset] = useState<{
        day: number;
        slot: number;
    } | null>(null);

    const weekDays = getWeekdays(new Date(currentDate));

    const allSlots = Array.from({ length: 96 }, (_, i) => i);
    const visibleSlots = showNightHours
        ? allSlots
        : allSlots.filter((i) => i >= 28);

    const SLOT_HEIGHT = 20;

    const getEventLayouts = (day: Date): EventLayout[] => {
        const dayEvents = events
            .filter((event) => {
                if (event.isAllDay) return false;
                const eventStart = new Date(event.start);
                return (
                    eventStart.getDate() === day.getDate() &&
                    eventStart.getMonth() === day.getMonth() &&
                    eventStart.getFullYear() === day.getFullYear()
                );
            })
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        const layouts: EventLayout[] = [];

        dayEvents.forEach((event) => {
            layouts.push({ event });
        });

        return layouts;
    };

    const getEventPosition = (event: CalendarEvent, day: Date) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        if (
            eventStart.getDate() !== day.getDate() ||
            eventStart.getMonth() !== day.getMonth() ||
            eventStart.getFullYear() !== day.getFullYear()
        ) {
            return null;
        }

        if (event.isAllDay) return null;

        const firstVisibleSlot = showNightHours ? 0 : 28;

        const startHour = eventStart.getHours();
        const startMinutes = eventStart.getMinutes();
        const startTotalSlots = startHour * 4 + startMinutes / 15;

        const endHour = eventEnd.getHours();
        const endMinutes = eventEnd.getMinutes();
        const endTotalSlots = endHour * 4 + endMinutes / 15;

        const offsetSlots = startTotalSlots - firstVisibleSlot;

        const top = offsetSlots * SLOT_HEIGHT;
        const durationSlots = endTotalSlots - startTotalSlots;
        const height = Math.max(durationSlots * SLOT_HEIGHT, SLOT_HEIGHT);

        return { top, height, startTotalSlots, endTotalSlots };
    };

    const handleMouseDown = (day: Date, slot: number, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest(".event-block")) {
            return;
        }

        setIsDragging(true);
        setDragStart({ day, slot });
        setDragEnd({ day, slot });
    };

    const handleMouseEnter = (day: Date, slot: number) => {
        if (isDragging && dragStart) {
            if (day.getDate() === dragStart.day.getDate()) {
                setDragEnd({ day, slot });
            }
        } else if (resizingEvent) {
            handleResize(day, slot);
        } else if (draggingEvent && dragOffset) {
            handleEventDrag(day, slot);
        }
    };

    const handleMouseUp = () => {
        if (isDragging && dragStart && dragEnd) {
            const startSlot = Math.min(dragStart.slot, dragEnd.slot);
            const endSlot = Math.max(dragStart.slot, dragEnd.slot) + 1;

            const { hours: startHours, minutes: startMinutes } =
                slotToTime(startSlot);
            const { hours: endHours, minutes: endMinutes } =
                slotToTime(endSlot);

            const start = new Date(dragStart.day);

            start.setHours(startHours, startMinutes, 0, 0);

            const end = new Date(dragStart.day);

            end.setHours(endHours, endMinutes, 0, 0);
        }

        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setResizingEvent(null);
        setDraggingEvent(null);
        setDragOffset(null);
    };

    const timeToSlot = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return hours * 4 + Math.floor(minutes / 15);
    };

    const handleEventDragStart = (
        event: CalendarEvent,
        day: Date,
        slot: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();
        const eventStart = new Date(event.start);
        const eventStartSlot = timeToSlot(eventStart);

        const dayIndex = weekDays.findIndex(
            (d) =>
                d.getDate() === day.getDate() &&
                d.getMonth() === day.getMonth() &&
                d.getFullYear() === day.getFullYear()
        );

        setDraggingEvent(event);
        setDragOffset({
            day: dayIndex,
            slot: eventStartSlot,
        });
    };

    const handleEventDrag = (day: Date, slot: number) => {
        if (!draggingEvent || !dragOffset) return;

        const eventStart = new Date(draggingEvent.start);
        const eventEnd = new Date(draggingEvent.end);
        const durationMs = eventEnd.getTime() - eventStart.getTime();

        const { hours, minutes } = slotToTime(slot);
        const newStart = new Date(day);

        newStart.setHours(hours, minutes, 0, 0);

        const newEnd = new Date(newStart.getTime() + durationMs);

        const updatedEvent = {
            ...draggingEvent,
            start: newStart,
            end: newEnd,
        };

        setEvents(
            events.map((e) => (e.id === draggingEvent.id ? updatedEvent : e))
        );
        setDraggingEvent(updatedEvent);
    };

    const handleResizeStart = (
        event: CalendarEvent,
        edge: "top" | "bottom",
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        setResizingEvent({ event, edge });
    };

    const handleResize = (day: Date, slot: number) => {
        if (!resizingEvent) return;

        const { event, edge } = resizingEvent;
        const eventStart = new Date(event.start);
        const eventDay = new Date(
            eventStart.getFullYear(),
            eventStart.getMonth(),
            eventStart.getDate()
        );
        const targetDay = new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate()
        );

        if (eventDay.getTime() !== targetDay.getTime()) return;

        const { hours, minutes } = slotToTime(slot);
        const newTime = new Date(day);

        newTime.setHours(hours, minutes, 0, 0);

        if (edge === "top") {
            if (newTime < event.end) {
                const updatedEvent = { ...event, start: newTime };

                setEvents(
                    events.map((e) => (e.id === event.id ? updatedEvent : e))
                );
                setResizingEvent({ event: updatedEvent, edge });
            }
        } else {
            if (newTime > event.start) {
                const updatedEvent = { ...event, end: newTime };

                setEvents(
                    events.map((e) => (e.id === event.id ? updatedEvent : e))
                );
                setResizingEvent({ event: updatedEvent, edge });
            }
        }
    };

    const isCellInDragSelection = (day: Date, slot: number) => {
        if (!isDragging || !dragStart || !dragEnd) return false;
        if (day.getDate() !== dragStart.day.getDate()) return false;

        const minSlot = Math.min(dragStart.slot, dragEnd.slot);
        const maxSlot = Math.max(dragStart.slot, dragEnd.slot);

        return slot >= minSlot && slot <= maxSlot;
    };

    return (
        <>
            <div className="calendar-top weekview">
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
            <div className="weekview-area">
                <div className="weekview-allday">
                    <div className="weekview-allday-grid weekview-allday-grid-header">
                        All day
                    </div>
                    {weekDays.map((day, dayIndex) => {
                        return (
                            <div
                                key={dayIndex}
                                className={`weekview-allday-grid ${
                                    isToday(day?.getDate() || 0)
                                        ? "bg-indigo-50/30"
                                        : ""
                                }`}
                            ></div>
                        );
                    })}
                </div>

                {!showNightHours && (
                    <div className="weekview-collapsed">
                        <div className="weekview-collapsed-area">
                            <button
                                onClick={() => setShowNightHours(true)}
                                className="weekview-collapsed-button"
                            >
                                Show 12 AM - 7 AM
                            </button>
                        </div>
                    </div>
                )}

                <div
                    className="weekview-grid"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {visibleSlots
                        .filter((slot) => slot % 2 === 0)
                        .map((slot) => {
                            const { hours, minutes } = slotToTime(slot);
                            const showLabel = minutes === 0;

                            return (
                                <div
                                    key={slot}
                                    className="weekview-grid-grid"
                                    style={{
                                        height: `${SLOT_HEIGHT * 2}px`,
                                    }}
                                >
                                    <div className="weekview-grid-grid-time">
                                        {showLabel && formatSlotTime(slot)}
                                    </div>

                                    {weekDays.map((day, dayIndex) => {
                                        const isSelected =
                                            isCellInDragSelection(day, slot);

                                        return (
                                            <div
                                                key={dayIndex}
                                                onDoubleClick={(e) =>
                                                    handleCreateNewEvent(
                                                        new Date(
                                                            day.getFullYear(),
                                                            day.getMonth(),
                                                            day.getDate(),
                                                            hours
                                                        ),
                                                        e
                                                    )
                                                }
                                                onMouseDown={(e) =>
                                                    handleMouseDown(
                                                        day,
                                                        slot,
                                                        e
                                                    )
                                                }
                                                onMouseEnter={() =>
                                                    handleMouseEnter(day, slot)
                                                }
                                                className={`
                                                    weekview-grid-grid-grid
                                                    ${
                                                        isToday(
                                                            day?.getDate() || 0
                                                        )
                                                            ? "today"
                                                            : ""
                                                    }
                                                `}
                                            ></div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    <div className="weekview-grid-events">
                        <div className="weekview-grid-events-area">
                            <div></div>
                            {weekDays.map((day, dayIndex) => {
                                const eventLayouts = getEventLayouts(day);

                                return (
                                    <div key={dayIndex} className="relative">
                                        {eventLayouts.map(({ event }) => {
                                            const position = getEventPosition(
                                                event,
                                                day
                                            );

                                            if (!position) return null;

                                            const isPlaceholder =
                                                event.id === "" &&
                                                event.title === "New Event";

                                            return (
                                                <div
                                                    key={
                                                        event.id ||
                                                        "new-event-placeholder"
                                                    }
                                                    className={`event-block ${
                                                        isPlaceholder
                                                            ? "placeholder-event"
                                                            : ""
                                                    } `}
                                                    onDoubleClick={(e) =>
                                                        handleEditEvent(
                                                            event,
                                                            e
                                                        )
                                                    }
                                                    onMouseDown={(e) => {
                                                        const target =
                                                            e.target as HTMLElement;
                                                        if (
                                                            !target.classList.contains(
                                                                "resize-handle"
                                                            )
                                                        ) {
                                                            handleEventDragStart(
                                                                event,
                                                                day,
                                                                position.startTotalSlots,
                                                                e
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        top: `${position.top}px`,
                                                        height: `${position.height}px`,
                                                        left: "0",
                                                        zIndex: 2000,
                                                        backgroundColor:
                                                            event.color,
                                                    }}
                                                >
                                                    <div
                                                        className="resize-handle absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/30"
                                                        onMouseDown={(e) =>
                                                            handleResizeStart(
                                                                event,
                                                                "top",
                                                                e
                                                            )
                                                        }
                                                    ></div>
                                                    <div className="event-block-title">
                                                        {event.title}
                                                    </div>

                                                    {position.height >= 40 && (
                                                        <div className="event-block-desc">
                                                            {formatEventTime(
                                                                event.start
                                                            )}
                                                        </div>
                                                    )}
                                                    <div
                                                        className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/30"
                                                        onMouseDown={(e) =>
                                                            handleResizeStart(
                                                                event,
                                                                "bottom",
                                                                e
                                                            )
                                                        }
                                                    ></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
