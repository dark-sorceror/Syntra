import { useState } from "react";
import { CalendarEvent, CalendarViewProperties } from "../../types/calendar";
import { generateCalendar } from "@/hooks/calendarGeneration";

interface EventLayout {
    event: CalendarEvent;
    column: number;
    totalColumns: number;
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

    const getWeekDays = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        const sunday = new Date(date.setDate(diff));

        const days = [];
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(sunday);
            weekDay.setDate(sunday.getDate() + i);
            days.push(weekDay);
        }
        return days;
    };

    const weekDays = getWeekDays(new Date(currentDate));

    const allSlots = Array.from({ length: 96 }, (_, i) => i);
    const visibleSlots = showNightHours
        ? allSlots
        : allSlots.filter((i) => i >= 28);

    const SLOT_HEIGHT = 20;

    const slotToTime = (slot: number) => {
        const hours = Math.floor(slot / 4);
        const minutes = (slot % 4) * 15;
        return { hours, minutes };
    };

    const timeToSlot = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours * 4 + Math.floor(minutes / 15);
    };

    const formatSlotTime = (slot: number) => {
        const { hours, minutes } = slotToTime(slot);
        if (minutes !== 0 && minutes !== 30) return ""; // Only show on 30-minute marks
        if (hours === 0) return `12:${minutes.toString().padStart(2, "0")} AM`;
        if (hours === 12) return `12:${minutes.toString().padStart(2, "0")} PM`;
        return hours > 12
            ? `${hours - 12}:${minutes.toString().padStart(2, "0")} PM`
            : `${hours}:${minutes.toString().padStart(2, "0")} AM`;
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
                                                    handleCreateNewEvent(day, e)
                                                }
                                                className={`
                                                    weekview-grid-grid-grid
                                                    ${
                                                        isToday(
                                                            day?.getDate() || 0
                                                        )
                                                            ? "bg-indigo-50/30"
                                                            : ""
                                                    }
                                                `}
                                            ></div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};
