export type CalendarView = "day" | "week" | "month";

export type EditingEvent = {
    dateKey: string;
    index: number;
    position: { x: number; y: number };
} | null;

export interface CalendarDay {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    date: Date;
}

export interface Event {
    date: string;
    title: string;
}

export interface CalendarDayCellProperties {
    day: CalendarDay;
    events: Event[];
    editingEvent: EditingEvent | null;
    eventTitle: string;
    onEventEdit: (
        dateKey: string,
        index: number,
        position: { x: number; y: number }
    ) => void;
    onEventCancelEdit: () => void;
    onEventSaveEdit: () => void;
    onTitleChange: (title: string) => void;
}

export interface EventEditorProperties {
    x: number;
    y: number;
    eventTitle: string;
    onTitleChange: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
}
