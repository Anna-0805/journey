import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { FilterModal } from '../../../components/FilterModal'
import { FilterItem } from '../../../shared/api/types/Filter/FilterItem'
import { useFilterStore } from '../../../store/useFilterStore'

export const App = () => {
	const { t } = useTranslation()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const { globalFilters, setGlobalFilters } = useFilterStore()

	const {
		data: filterData,
		isLoading,
		error
	} = useQuery<FilterItem[]>({
		queryKey: ['filters'],
		queryFn: async () => {
			const res = await fetch('/filterData.json')
			if (!res.ok) {
				throw new Error('Failed to fetch filter data')
			}
			return res.json()
		}
	})

	return (
		<section className="w-full h-dvh flex flex-col items-center justify-center bg-white p-4 font-sans">
			<h1 className="text-6xl text-gray-600 mb-8 text-center font-light tracking-tight">
				{t('main.app_title', 'WinWinTravel frontend test task')}
			</h1>

			<div className="w-full max-w-xl flex flex-col items-center gap-6">
				<button
					onClick={() => setIsModalOpen(true)}
					className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
				>
					{t('main.open_filters', 'Open Filters')}
				</button>

				<div className="w-full bg-gray-900 rounded-xl p-5 shadow-inner border border-gray-800">
					<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-mono">
						{t('main.json_output', 'SearchRequestFilter (JSON Output):')}
					</h2>
					<pre className="text-emerald-400 text-xs font-mono overflow-x-auto min-h-[100px]">
						{JSON.stringify(globalFilters, null, 2)}
					</pre>
				</div>
			</div>

			{isLoading && (
				<p className="mt-4 text-sm text-gray-400 font-mono">
					{t('main.loading', 'Loading data...')}
				</p>
			)}
			{error && (
				<p className="mt-4 text-sm text-red-400 font-mono">
					{t('main.error', 'Error loading filterData.json')}
				</p>
			)}

			{isModalOpen && filterData && (
				<FilterModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					filterData={filterData}
					initialFilters={globalFilters}
					onApply={setGlobalFilters}
				/>
			)}
		</section>
	)
}
