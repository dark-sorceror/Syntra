import { CalendarViewProperties } from "@/types/calendar";
import { generateCalendar } from "@/hooks/calendarGeneration";

export const MonthView: React.FC<CalendarViewProperties> = ({
    currentDate,
    setCurrentDate,
    events,
    setEvents,
    onOpenEventEditor,
}: CalendarViewProperties) => {
    const {
        weekdayNames,
        isToday,
        filterEventsForDay,
        handleCreateNewEvent,
        handleEditEvent,
        days,
    } = generateCalendar({
        currentDate,
        setCurrentDate,
        events,
        setEvents,
        onOpenEventEditor,
    });

    return (
        <>
            <div className="calendar-top">
                {weekdayNames.map((day) => (
                    <div key={day} className="weekday">
                        {day}
                    </div>
                ))}
            </div>

            <div className={`calendar-main ${days.length > 35 ? "extra" : ""}`}>
                {days.map((day, index) => {
                    const dayEvents = day ? filterEventsForDay(day) : [];

                    return (
                        <div
                            key={index}
                            onDoubleClick={(e) =>
                                day && handleCreateNewEvent(day, e)
                            }
                            className={`day ${
                                isToday(day || 0) ? "today" : ""
                            }`}
                        >
                            {day}

                            {dayEvents.map((event) => {
                                return (
                                    <div
                                        key={event.id}
                                        onDoubleClick={(e) =>
                                            handleEditEvent(event, e)
                                        }
                                        className={`event`}
                                    >
                                        {event.title}
                                    </div>
                                );
                            })}

                            {dayEvents.length > 3 && (
                                <div className="text-xs text-gray-500 px-2">
                                    +{dayEvents.length - 3} more
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};
