import { useSyncExternalStore } from "react";

export type ToastKind = "info" | "success" | "warning" | "error";
export interface Toast {
    id: number;
    message: string;
    kind: ToastKind;
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => {
    for (const l of listeners) l();
};

export const getToasts = (): Toast[] => toasts;

export const dismissToast = (id: number): void => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
};

export const toast = (message: string, kind: ToastKind = "info"): void => {
    const id = nextId++;
    toasts = [...toasts, { id, message, kind }];
    emit();
    setTimeout(() => dismissToast(id), 3000);
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useToasts = (): Toast[] =>
    useSyncExternalStore(subscribe, getToasts, getToasts);
