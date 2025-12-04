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

export const formatEventTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};
