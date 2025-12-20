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
        const startTotalSlots = (startHour * 4) + (startMinutes / 15);

        const endHour = eventEnd.getHours();
        const endMinutes = eventEnd.getMinutes();
        const endTotalSlots = (endHour * 4) + (endMinutes / 15);

        const offsetSlots = startTotalSlots - firstVisibleSlot;

        const top = offsetSlots * SLOT_HEIGHT;
        const durationSlots = endTotalSlots - startTotalSlots;
        const height = Math.max(durationSlots * SLOT_HEIGHT, SLOT_HEIGHT);

        return { top, height };
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

                <div className="weekview-grid">
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

                                            console.log(event);

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
                                                    style={{
                                                        top: `${position.top}px`,
                                                        height: `${position.height}px`,
                                                        left: "0",
                                                        zIndex: 200,
                                                        backgroundColor:
                                                            event.color,
                                                    }}
                                                >
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
