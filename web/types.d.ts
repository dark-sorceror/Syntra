import { Dispatch, SetStateAction } from "react";

export interface Position {
    x: number;
    y: number;
}

export type EventCategory = "work" | "personal" | "health" | "social" | "focus";

export interface CalendarViewProperties {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    events: CalendarEvent[];
    onOpenEventEditor: (
        position?: Position,
        event?: CalendarEvent,
        start?: Date,
        end?: Date,
    ) => void;
    editingEvent: CalendarEvent | null;
    showEventEditor: boolean;
}

export interface CalendarEvent {
    id: number | string;
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
    onDelete?: (eventId: number | string) => void;
    onClose: () => void;
}
