import { create } from "zustand";

export const useFormStore = create((set) => ({
    text: '',
    setText: (text) => set({text}),
    type: 'Urgent',
    setType: (type) => set({type}),
    dueDate: '',
    setDueDate: (dueDate) => set({dueDate}),
    reset: () => set({text: '', type: 'Urgent', dueDate: ''})
}))