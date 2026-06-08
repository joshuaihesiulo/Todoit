// FilterStore is in a different store because it needed to call diffrent states and diffrent components when a filter is selected. It is also a very small store and it felt cleaner to separate it from the main todo store.

import {create} from 'zustand'

export const useFilterStore = create ((set) => ({
    filter: 'all',
    setFilter: (filter)=> set({filter})
}))