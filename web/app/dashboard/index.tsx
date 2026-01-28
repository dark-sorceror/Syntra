import { formatEventTime, monthNames } from "@/utils/dateUtils";
import { CalendarEvent } from "../../types/calendar";

import "./index.css";

interface DashboardProps {
    events: CalendarEvent[];
}

export function Dashboard({ events }: DashboardProps) {
    const today = new Date();

    const todayEvents = events
        .filter((event) => {
            const eventDate = new Date(event.start);

            return (
                eventDate.getDate() === today.getDate() &&
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getFullYear() === today.getFullYear()
            );
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    const upcomingEvents = events
        .filter((event) => {
            const eventDate = new Date(event.start);
            const nextWeek = new Date();

            nextWeek.setDate(today.getDate() + 7);

            return eventDate > today && eventDate <= nextWeek;
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    const categoryStats = events.reduce((acc, event) => {
        const category = event.category || "Uncategorized";

        acc[category] = (acc[category] || 0) + 1;

        return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryStats).map(([name, count]) => ({
        name,
        count,
    }));

    const totalTasks = events.length;
    const completedTasks = Math.floor(totalTasks * 0.65); // Change
    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="dashboard-wrapper">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="dashboard-area">
                <div className="dashboard-stat">
                    <div className="dashboard-stat-area">
                        <div className="dashboard-stat-icon d-events">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                data-name="Layer 1"
                                viewBox="0 0 24 24"
                                style={{ width: "40px" }}
                            >
                                <path d="M22.208,5.821c-.289-1.155-1.212-2.036-2.354-2.245-.333-.061-.668-.117-1.005-.17v-.932c0-.552-.448-1-1-1s-1,.448-1,1v.667c-3.193-.345-6.504-.345-9.697,0v-.667c0-.552-.448-1-1-1s-1,.448-1,1v.932c-.337,.053-.672,.109-1.005,.17-1.141,.208-2.065,1.089-2.354,2.244-1.062,4.246-1.062,9.521,0,13.768,.289,1.155,1.213,2.036,2.354,2.244,2.532,.462,5.193,.694,7.854,.694s5.321-.231,7.854-.694c1.141-.208,2.065-1.089,2.354-2.244,1.062-4.246,1.062-9.521,0-13.767Zm-17.702-.277c2.417-.441,4.955-.662,7.494-.662s5.078,.221,7.494,.662c.371,.067,.674,.367,.773,.762,.086,.345,.164,.699,.235,1.06H3.498c.071-.361,.149-.715,.235-1.06,.099-.395,.402-.694,.773-.762Zm15.761,13.559c-.099,.395-.402,.694-.773,.762-4.833,.883-10.155,.883-14.988,0-.371-.067-.674-.367-.773-.762-.732-2.925-.912-6.494-.543-9.737H20.81c.37,3.244,.189,6.812-.543,9.737Z" />
                                <g>
                                    <circle cx="7.691" cy="13.002" r="1" />
                                    <circle cx="7.691" cy="16.736" r="1" />
                                    <circle cx="12.005" cy="12.994" r="1" />
                                    <circle cx="12.005" cy="16.728" r="1" />
                                    <circle cx="16.311" cy="12.994" r="1" />
                                    <circle cx="16.311" cy="16.728" r="1" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <h3 className="dashboard-stat-stat">{events.length}</h3>
                    <p className="dashboard-stat-title">Total Events</p>
                </div>

                <div className="dashboard-stat">
                    <div className="dashboard-stat-area">
                        <div className="dashboard-stat-icon d-tasks">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                viewBox="0 0 24 24"
                                data-name="Layer 1"
                                style={{ width: "40px" }}
                            >
                                <path d="m17.305 9.539c-1.312 2.053-3.18 4.626-6.001 6.319-.324.195-.731.19-1.05-.013-1.52-.963-2.661-1.995-3.594-3.248-.33-.443-.238-1.069.205-1.399.442-.33 1.069-.237 1.398.205.674.905 1.488 1.679 2.536 2.405 2.16-1.46 3.644-3.507 4.819-5.346.299-.466.917-.602 1.381-.304.466.298.602.916.305 1.381zm5.695 2.461c0 7.71-3.29 11-11 11s-11-3.29-11-11 3.29-11 11-11 11 3.29 11 11zm-2 0c0-6.561-2.439-9-9-9s-9 2.439-9 9 2.439 9 9 9 9-2.439 9-9z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="dashboard-stat-stat">{completionRate}%</h3>
                    <p className="dashboard-stat-title">Completion Rate</p>
                </div>

                <div className="dashboard-stat">
                    <div className="dashboard-stat-area">
                        <div className="dashboard-stat-icon d-tevents">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                data-name="Layer 1"
                                viewBox="0 0 24 24"
                                style={{ width: "40px" }}
                            >
                                <path d="M13,11.697V6c0-.552-.447-1-1-1s-1,.448-1,1v6c0,.197,.059,.391,.168,.555l2,3c.517,.679,1.216,.391,1.387,.277,.46-.306,.584-.927,.277-1.387l-1.832-2.748Z" />
                                <path d="M11.994,1C4.929,1.044,1,5.016,1,11.982s3.932,11.018,11.006,11.018c7.162,0,10.861-3.737,10.994-11.017-.122-7.037-4.026-10.938-11.006-10.983Zm.012,20c-6.026-.035-8.888-2.895-9.006-9,.113-6.019,3.059-8.963,8.994-9,5.873,.038,8.903,3.072,9.006,8.981-.112,6.117-2.974,8.983-8.994,9.019Z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="dashboard-stat-stat">
                        {todayEvents.length}
                    </h3>
                    <p className="dashboard-stat-title">Today's Events</p>
                </div>

                <div className="dashboard-stat">
                    <div className="dashboard-stat-area">
                        <div className="dashboard-stat-icon d-uevents">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                data-name="Layer 1"
                                viewBox="0 0 24 24"
                                style={{ width: "40px" }}
                            >
                                <path d="M21.991,6.324c-.065-.099-.148-.185-.244-.255-.144-.104-3.571-2.516-8.761,.258-.486,.26-.671,.866-.41,1.353,.26,.488,.866,.671,1.354,.411,2.484-1.328,4.389-1.2,5.51-.889l-6.204,5.94c-.373,.361-.83,.547-1.356,.528-.501-.021-.967-.249-1.311-.642-.708-.809-1.678-1.278-2.73-1.322-1.047-.046-2.057,.341-2.83,1.087-.027,.026-3.779,4.571-3.779,4.571-.352,.426-.304,1.072,.135,1.408,.619,.474,1.21,.104,1.408-.135l3.662-4.439c.369-.339,.834-.511,1.32-.493,.501,.021,.966,.249,1.31,.642,.708,.809,1.678,1.278,2.731,1.322,1.042,.041,2.059-.342,2.826-1.084l6.188-5.924c.3,1.192,.418,3.204-.864,5.82-.243,.496-.051,1.121,.457,1.338,.665,.284,1.165-.104,1.338-.458,2.629-5.361,.351-8.888,.252-9.036Z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="dashboard-stat-stat">
                        {upcomingEvents.length}
                    </h3>
                    <p className="dashboard-stat-title">Upcoming</p>
                </div>
            </div>

            <div className="dashboard-bottom">
                <div className="dashboard-bottom-today">
                    <h3 className="dashboard-bottom-today-title">
                        Today's Schedule
                    </h3>

                    {todayEvents.length > 0 ? (
                        <div className="dashboard-events-today">
                            {todayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="dashboard-events-today-event"
                                >
                                    <div
                                        className="dashboard-events-today-event-color"
                                        style={{ backgroundColor: event.color }}
                                    ></div>
                                    <div className="dashboard-events-today-event-desc">
                                        <h4 className="dashboard-events-today-event-title">
                                            {event.title}
                                        </h4>
                                        <p className="dashboard-events-today-event-time">
                                            {formatEventTime(event.start)} -{" "}
                                            {formatEventTime(event.end)}
                                        </p>
                                    </div>
                                    <div
                                        className={`px-3 py-1 ${event.color} bg-opacity-10 rounded-full`}
                                    >
                                        <span className="text-gray-700">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-events-today default">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                data-name="Layer 1"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22.208,5.821c-.289-1.155-1.212-2.036-2.354-2.245-.333-.061-.668-.117-1.005-.17v-.932c0-.552-.448-1-1-1s-1,.448-1,1v.667c-3.193-.345-6.504-.345-9.697,0v-.667c0-.552-.448-1-1-1s-1,.448-1,1v.932c-.337,.053-.672,.109-1.005,.17-1.141,.208-2.065,1.089-2.354,2.244-1.062,4.246-1.062,9.521,0,13.768,.289,1.155,1.213,2.036,2.354,2.244,2.532,.462,5.193,.694,7.854,.694s5.321-.231,7.854-.694c1.141-.208,2.065-1.089,2.354-2.244,1.062-4.246,1.062-9.521,0-13.767Zm-17.702-.277c2.417-.441,4.955-.662,7.494-.662s5.078,.221,7.494,.662c.371,.067,.674,.367,.773,.762,.086,.345,.164,.699,.235,1.06H3.498c.071-.361,.149-.715,.235-1.06,.099-.395,.402-.694,.773-.762Zm15.761,13.559c-.099,.395-.402,.694-.773,.762-4.833,.883-10.155,.883-14.988,0-.371-.067-.674-.367-.773-.762-.732-2.925-.912-6.494-.543-9.737H20.81c.37,3.244,.189,6.812-.543,9.737Z" />
                                <g>
                                    <circle cx="7.691" cy="13.002" r="1" />
                                    <circle cx="7.691" cy="16.736" r="1" />
                                    <circle cx="12.005" cy="12.994" r="1" />
                                    <circle cx="12.005" cy="16.728" r="1" />
                                    <circle cx="16.311" cy="12.994" r="1" />
                                    <circle cx="16.311" cy="16.728" r="1" />
                                </g>
                            </svg>
                            No events scheduled for today
                        </div>
                    )}
                </div>

                <div className="dashboard-bottom-today-cat">
                    <h3 className="dashboard-bottom-today-title">Categories</h3>

                    {categories.map(({ name, count }) => {
                        const percentage = Math.round(
                            (count / totalTasks) * 100
                        );

                        return (
                            <div key={name}>
                                <div className="dashboard-bottom-today-cat-desc">
                                    <span>{name}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="dashboard-bottom-today-cat-prog">
                                    <div
                                        className="dashboard-bottom-today-cat-prog-in"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="dashboard-bottom-up">
                    <h3 className="dashboard-bottom-up-title">
                        Upcoming Events (Next 7 Days)
                    </h3>

                    {upcomingEvents.length > 0 ? (
                        <div className="dashboard-events-up">
                            {upcomingEvents.slice(0, 6).map((event) => (
                                <div
                                    key={event.id}
                                    className="dashboard-events-up-event"
                                >
                                    <div
                                        className="dashboard-events-up-event-color"
                                        style={{ backgroundColor: event.color }}
                                    ></div>
                                    <h4 className="dashboard-events-up-event-title">
                                        {event.title}
                                    </h4>
                                    <p className="dashboard-events-up-event-date">
                                        {monthNames[event.start.getMonth()]}{" "}
                                        {event.start.getDate()},{" "}
                                        {event.start.getFullYear()}
                                    </p>
                                    <p className="dashboard-events-up-event-time">
                                        {formatEventTime(event.start)} -{" "}
                                        {formatEventTime(event.end)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-events-up default">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                data-name="Layer 1"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13,11.697V6c0-.552-.447-1-1-1s-1,.448-1,1v6c0,.197,.059,.391,.168,.555l2,3c.517,.679,1.216,.391,1.387,.277,.46-.306,.584-.927,.277-1.387l-1.832-2.748Z" />
                                <path d="M11.994,1C4.929,1.044,1,5.016,1,11.982s3.932,11.018,11.006,11.018c7.162,0,10.861-3.737,10.994-11.017-.122-7.037-4.026-10.938-11.006-10.983Zm.012,20c-6.026-.035-8.888-2.895-9.006-9,.113-6.019,3.059-8.963,8.994-9,5.873,.038,8.903,3.072,9.006,8.981-.112,6.117-2.974,8.983-8.994,9.019Z" />
                            </svg>
                            <p>No upcoming events</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
