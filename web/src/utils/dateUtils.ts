export const getDateKey = (date: Date): string => {
    return date.toISOString().slice(0, 10);
};

export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (monthIndex: number): string => {
    return new Date(2025, monthIndex, 1).toLocaleString("default", {
        month: "long",
    });
};
