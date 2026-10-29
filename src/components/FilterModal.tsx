import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'lucide-react'

import { FilterItem } from '../shared/api/types/Filter/FilterItem'
import { FilterType } from '../shared/api/types/Filter/FilterType'
import {
	SearchRequestFilter,
	SearchRequestOptions
} from '../shared/api/types/SearchRequest/SearchRequestFilter'
import { ConfirmationDialog } from './ConfirmationDialog'

type LocalFiltersMap = Record<string, string[]>

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
	filterData: FilterItem[]
	initialFilters: SearchRequestFilter
	onApply: (filters: SearchRequestFilter) => void
}

export const FilterModal: React.FC<FilterModalProps> = ({
	isOpen,
	onClose,
	filterData,
	initialFilters,
	onApply
}) => {
	const { t } = useTranslation()
	const [localFilters, setLocalFilters] = useState<LocalFiltersMap>({})
	const [showConfirm, setShowConfirm] = useState(false)

	useEffect(() => {
		if (isOpen) {
			const map: LocalFiltersMap = {}
			if (Array.isArray(initialFilters)) {
				initialFilters.forEach(item => {
					map[item.id] = item.optionsIds
				})
			}
			setLocalFilters(map)
		}
	}, [isOpen])

	const handleCheckboxChange = (
		groupId: string,
		optionId: string,
		checked: boolean
	) => {
		setLocalFilters(prev => {
			const currentOptions = prev[groupId] || []
			if (checked) {
				return { ...prev, [groupId]: [...currentOptions, optionId] }
			} else {
				const updated = currentOptions.filter(id => id !== optionId)

				if (updated.length === 0) {
					const newFilters = { ...prev }
					delete newFilters[groupId]
					return newFilters
				}

				return { ...prev, [groupId]: updated }
			}
		})
	}

	const handleConfirmSave = () => {
		const transformedFilters: SearchRequestFilter = Object.entries(
			localFilters
		).map(([groupId, optionsIds]): SearchRequestOptions => ({
			id: groupId,
			type: FilterType.OPTION,
			optionsIds: optionsIds
		}))
		onApply(transformedFilters)
		setShowConfirm(false)
		onClose()
	}

	if (!isOpen) {
		return null
	}

	const getGridClasses = (columns: number | string) => {
		if (columns === 'flex') {
			return 'flex flex-col sm:flex-row sm:items-center justify-between gap-y-4 gap-x-6'
		}
		if (columns === 2) {
			return 'grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6'
		}
		if (columns === 1) {
			return 'grid grid-cols-1 gap-y-4'
		}
		return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6'
	}

	return (
		<>
			<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
				<div className="relative flex max-h-[85vh] w-full max-w-[1280px] flex-col rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
					<div className="p-6 bg-white overflow-y-auto flex-1 flex flex-col">
						<header className="relative flex w-full items-center justify-center bg-white border-b-[2px] border-[#B4B4B4] pb-6 min-h-[64px] mb-8 shrink-0">
							<h2 className="text-center text-3xl md:text-4xl font-medium tracking-tight text-[#31393C] font-sans">
								{t('title', 'Filter')}
							</h2>
							<button
								onClick={onClose}
								className="absolute right-0 top-1/2 -translate-y-1/2 text-[#31393C] hover:opacity-70 transition-opacity p-2 flex items-center justify-center cursor-pointer border-none bg-transparent outline-none"
								aria-label="Close modal"
							>
								<X
									size={20}
									className="w-5 h-5"
								/>
							</button>
						</header>

						<div className="flex-1">
							{filterData.map(group => {
								const itemsList = group.options || []

								return (
									<section
										key={group.id}
										className="border-b-[2px] border-[#B4B4B4] pb-8 last:border-0 last:pb-0 mb-8"
									>
										<h3 className="text-2xl font-medium leading-[29px] text-[#31393C] font-sans mb-4">
											{t(`groups.${group.id}`, group.title)}
										</h3>

										<div className={getGridClasses(group.columns)}>
											{itemsList.map(option => {
												const isChecked =
													localFilters[group.id]?.includes(option.id) || false

												return (
													<label
														key={option.id}
														className="flex min-h-[24px] items-start space-x-4 cursor-pointer group select-none"
													>
														<div className="relative w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
															<input
																type="checkbox"
																checked={isChecked}
																onChange={e =>
																	handleCheckboxChange(
																		group.id,
																		option.id,
																		e.target.checked
																	)
																}
																className="w-5 h-5 bg-white border-[2px] border-[#31393C] rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer transition-colors shrink-0"
															/>
														</div>

														<span className="text-base font-normal leading-none text-[#31393C] transition-colors group-hover:text-black pt-0.5 break-words">
															{t(`options.${option.id}`, option.label)}
														</span>
													</label>
												)
											})}
										</div>
									</section>
								)
							})}
						</div>

						<footer className="grid grid-cols-3 items-start px-6 pb-6 bg-white w-full border-t-[2px] border-[#B4B4B4] shrink-0 mt-12">
							<div></div>

							<div className="flex justify-center mt-6">
								<button
									onClick={() => setShowConfirm(true)}
									className="w-[184px] h-[64px] rounded-2xl font-sans text-base font-medium text-white transition-colors duration-200 bg-[#FF5F00] hover:bg-[#FF9E59] active:bg-[#FF3D00] disabled:bg-[#F4F4F4] disabled:text-[#B4B4B4] flex items-center justify-center cursor-pointer border-none outline-none select-none"
								>
									{t('apply', 'Apply')}
								</button>
							</div>

							<div className="flex justify-end mt-[46px]">
								<button
									onClick={() => setLocalFilters({})}
									className="text-sm font-normal text-sky-600 hover:text-sky-700 hover:underline transition-colors font-sans cursor-pointer bg-transparent border-none"
								>
									{t('clearAll', 'Clear all parameters')}
								</button>
							</div>
						</footer>
					</div>
				</div>
			</div>

			{showConfirm && (
				<ConfirmationDialog
					onConfirm={handleConfirmSave}
					onCancel={() => setShowConfirm(false)}
				/>
			)}
		</>
	)
}
