import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { EventDTO, api } from "@/api/api";

const USER_ID = 1;

export function useEvents(start: Date, end: Date) {
    return useQuery({
        queryKey: ["events", start.toISOString(), end.toISOString()],
        queryFn: () => api.events.list(USER_ID, start, end),
    });
}

export function useCreateEvent() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<EventDTO, "id" | "user_id" | "created_at">) =>
            api.events.create(USER_ID, data),

        onMutate: async (newEvent) => {
            await qc.cancelQueries({ queryKey: ["events"] });

            qc.setQueriesData({ queryKey: ["events"] }, (oldData: any) => {
                if (!oldData) return [];

                return [
                    ...oldData,
                    {
                        ...newEvent,
                        id: Date.now(),
                        created_at: new Date().toISOString(),
                    },
                ];
            });
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

export function useUpdateEvent() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: Partial<EventDTO> & { id: number }) =>
            api.events.update(USER_ID, id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
    });
}

export function useDeleteEvent() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.events.delete(USER_ID, id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
    });
}
