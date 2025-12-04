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

                    if (
                        day &&
                        showEventEditor &&
                        editingEvent &&
                        editingEvent.id === ""
                    ) {
                        const eventStartDay = new Date(
                            editingEvent.start
                        ).getDate();
                        const eventStartMonth = new Date(
                            editingEvent.start
                        ).getMonth();

                        if (
                            day === eventStartDay &&
                            currentDate.getMonth() === eventStartMonth
                        ) {
                            dayEvents = [editingEvent, ...dayEvents];
                        }
                    }

                    return (
                        <div
                            key={index}
                            onDoubleClick={(e) =>
                                day && handleCreateNewEvent(day, e)
                            }
                            className={`day ${
                                isToday(day || 0) && isToday(index + 1 || 0)
                                    ? "today"
                                    : ""
                            } ${
                                day > index + 1 || day <= index - 7 ? "pm" : ""
                            }`}
                        >
                            {day}

                            {dayEvents.map((event) => {
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
