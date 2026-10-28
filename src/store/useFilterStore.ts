import { create } from 'zustand'

import { SearchRequestFilter } from '../shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterState {
	globalFilters: SearchRequestFilter
	setGlobalFilters: (filters: SearchRequestFilter) => void
}

export const useFilterStore = create<FilterState>(set => ({
	globalFilters: [],
	setGlobalFilters: filters => set({ globalFilters: filters })
}))
