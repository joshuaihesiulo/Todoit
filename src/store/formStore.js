import { create } from "zustand";

export const useFormStore = create((set) => ({
    text: '',
    setText: (text) => set({text}),
    type: 'Urgent',
    setType: (type) => set({type}),
    reset: () => set({text: '', type: 'Urgent'})
}))