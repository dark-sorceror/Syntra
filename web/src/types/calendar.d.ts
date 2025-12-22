import { Dispatch, SetStateAction } from "react";

export interface Position {
    x: number;
    y: number;
}

export interface CalendarProperties {
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
}

export interface CalendarViewProperties {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
    onOpenEventEditor: (
        position?: Position,
        event?: CalendarEvent,
        start?: Date,
        end?: Date
    ) => void;
    editingEvent: CalendarEvent | null;
    showEventEditor: boolean;
}

export interface EventProperties {
    events: CalendarEvent[];
    setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    category?: string;
    color: string;
    isAllDay?: boolean;
    start: Date;
    end: Date;
}

export interface EventEditorProperties {
    x: number;
    y: number;
    event: CalendarEvent | null;
    onSave: (event: CalendarEvent | Omit<CalendarEvent, "id">) => void;
    onDelete?: (eventId: string) => void;
    onClose: () => void;
}
