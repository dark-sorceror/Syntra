export interface Position {
    x: number;
    y: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color: string;
    description?: string;
    category?: string;
    isAllDay?: boolean;
}

export interface EventEditorProperties {
    x: number;
    y: number;
    event: CalendarEvent | null;
    onSave: (event: CalendarEvent | Omit<CalendarEvent, "id">) => void;
    onDelete?: (eventId: string) => void;
    onClose: () => void;
}

interface CalendarViewProperties {
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
}

interface EventProperties {
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
}
