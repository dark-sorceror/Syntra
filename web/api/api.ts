import { EventCategory } from "@/types";

const BASE = "http://127.0.0.1:8000";

// DTO representing raw backend
export interface EventDTO {
    id: number;
    user_id: number;
    title: string;
    category: EventCategory;
    start_time: string;
    end_time: string;
    created_at: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    return res.json();
}

export const api = {
    events: {
        list: (userId: number, start: Date, end: Date) =>
            request<EventDTO[]>(
                `/events/?user_id=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`,
            ),

        create: (
            userId: number,
            data: Omit<EventDTO, "id" | "user_id" | "created_at">,
        ) =>
            request<EventDTO>(`/events/?user_id=${userId}`, {
                method: "POST",
                body: JSON.stringify(data),
            }),

        update: (userId: number, eventId: number, data: Partial<EventDTO>) =>
            request<EventDTO>(`/events/${eventId}?user_id=${userId}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),

        delete: (userId: number, eventId: number) =>
            request<void>(`/events/${eventId}?user_id=${userId}`, {
                method: "DELETE",
            }),
    },

    agent: {
        chat: (userId: number, message: string) =>
            request<{ response: string }>("/agent/chat", {
                method: "POST",
                body: JSON.stringify({ user_id: userId, message }),
            }),
    },
};
