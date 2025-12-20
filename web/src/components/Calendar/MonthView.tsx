import { CalendarViewProperties } from "@/types/calendar";
import { generateCalendar } from "@/hooks/calendarGeneration";

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
    } = generateCalendar({
        currentDate,
        setCurrentDate,
        events,
        setEvents,
        onOpenEventEditor,
        editingEvent,
        showEventEditor,
    });

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

                                return (
                                    <div
                                        key={
                                            event.id || "new-event-placeholder"
                                        }
                                        onDoubleClick={(e) =>
                                            handleEditEvent(event, e)
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
