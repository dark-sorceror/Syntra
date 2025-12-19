export const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();

    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();

    return new Date(year, month, 1).getDay();
};

export const getMonthName = (monthIndex: number): string => {
    return new Date(2025, monthIndex, 1).toLocaleString("default", {
        month: "long",
    });
};

export const getWeekdayName = (weekdayIndex: number): string => {
    return new Date(2025, 0, weekdayIndex - 1).toLocaleString("default", {
        weekday: "long",
    });
};

export const monthNames: string[] = Array(12)
    .fill(0)
    .map((_, i) => getMonthName(i));

export const weekdayNames: string[] = Array(7)
    .fill(0)
    .map((_, i) => getWeekdayName(i));

export const get12HourTime = (hours: number, minutes: number) => {
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12; // Handles 0 -> 12 and 13 -> 1
    const displayMinutes = minutes.toString().padStart(2, "0");

    return `${displayHours}:${displayMinutes} ${suffix}`;
};

export const formatEventTime = (date: Date) => {
    return get12HourTime(date.getHours(), date.getMinutes());
};

export const getWeekdays = (date: Date) => {
    const current = new Date(date);
    const currentDayOfWeek = new Date(date);
    const firstDayOfWeek = current.setDate(
        date.getDate() - currentDayOfWeek.getDay() + 1
    );

    const days = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(firstDayOfWeek);

        days.push(day);
        day.setDate(current.getDate() + i);
    }

    return days;
};

export const slotToTime = (slot: number) => {
    const hours = Math.floor(slot / 4);
    const minutes = (slot % 4) * 15;

    return { hours, minutes };
};

export const timeToSlot = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours * 4 + Math.floor(minutes / 15);
};

export const formatSlotTime = (slot: number) => {
    const { hours, minutes } = slotToTime(slot);

    if (minutes !== 0 && minutes !== 30) return "";

    return get12HourTime(hours, minutes);
};
