import { useState } from "react";
import { CalendarEvent } from "../../types/calendar";
import { getMonthName } from "@/utils/dateUtils";

import "./index.css";

interface TasksProps {
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
}

interface Task extends CalendarEvent {
    completed?: boolean;
}

export function Tasks({ events }: TasksProps) {
    const [tasks, setTasks] = useState<Task[]>(
        events.map((event) => ({ ...event, completed: Math.random() > 0.4 }))
    );

    const toggleTask = (taskId: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const getStats = () => {
        const categoryTasks = tasks;
        const completed = categoryTasks.filter((t) => t.completed).length;
        const total = categoryTasks.length;
        const percentage =
            total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);

        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        } else {
            return `${getMonthName(date.getMonth())} ${date.getDate()}`;
        }
    };

    return (
        <div className="task-wrapper">
            <div className="task-ok">
                <div className="task-header">
                    <h1>Tasks</h1>
                </div>
                <div className="task-area">
                    <div className="task-top">
                        <div className="task-category">General</div>
                        <div className="task-progress">
                            <div className="task-stats">
                                <span className="task-completed-number">
                                    {getStats().completed} / {getStats().total}{" "}
                                    completed
                                </span>
                                <div className="task-percentage-bar-wrapper">
                                    <div
                                        className="task-percentage-bar"
                                        style={{
                                            width: `${getStats().percentage}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="task-percentage">
                                    {getStats().percentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="tasks-area">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`
                        task
                        ${task.completed ? "opacity-60" : ""}
                        `}
                                onClick={() => toggleTask(task.id)}
                            >
                                <button
                                    className="complete-task"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTask(task.id);
                                    }}
                                >
                                    {task.completed ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="checkmark-svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22Z" />
                                        </svg>
                                    )}
                                </button>
                                <div
                                    className="task-color"
                                    style={{ backgroundColor: task.color }}
                                />
                                <div
                                    className="task-info"
                                    style={{
                                        textDecoration: task.completed
                                            ? "line-through"
                                            : "",
                                    }}
                                >
                                    {task.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {tasks.length === 0 && (
                    <div className="no-tasks">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
                        </svg>
                        <p>No tasks available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
