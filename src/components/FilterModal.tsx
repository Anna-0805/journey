/* eslint-disable i18next/no-literal-string */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/* eslint-disable func-style */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'lucide-react'

import { FilterItem } from '../shared/api/types/Filter/FilterItem'
import { SearchRequestFilter } from '../shared/api/types/SearchRequest/SearchRequestFilter'
import { ConfirmationDialog } from './ConfirmationDialog'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
	filterData: FilterItem[] | any
	initialFilters: SearchRequestFilter | any
	onApply: (filters: any) => void
}

export function FilterModal({
	isOpen,
	onClose,
	filterData,
	initialFilters,
	onApply
}: FilterModalProps) {
	const { t } = useTranslation()
	const [localFilters, setLocalFilters] = useState<any>({})
	const [showConfirm, setShowConfirm] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setLocalFilters(JSON.parse(JSON.stringify(initialFilters || {})))
		}
	}, [isOpen, initialFilters])

	const handleCheckboxChange = (
		groupId: string,
		optionId: string,
		checked: boolean
	) => {
		setLocalFilters((prev: any) => {
			const currentOptions = prev[groupId] || []
			if (checked) {
				return { ...prev, [groupId]: [...currentOptions, optionId] }
			} else {
				const updated = currentOptions.filter((id: string) => id !== optionId)
				const newFilters = { ...prev, [groupId]: updated }
				if (updated.length === 0) {
					delete newFilters[groupId]
				}
				return newFilters
			}
		})
	}

	const handleConfirmSave = () => {
		onApply(localFilters)
		setShowConfirm(false)
		onClose()
	}

	if (!isOpen) {
		return null
	}

	return (
		<>
			<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
				<div className="relative flex h-full max-h-[85vh] w-full max-w-[1280px] flex-col rounded-2xl bg-white shadow-xl overflow-y-auto border border-gray-100">
					<div className="p-6 pb-0 w-full">
						<header className="relative flex w-full items-center justify-center bg-white border-b-[2px] border-[#B4B4B4] pb-6 min-h-[64px]">
							<h2 className="text-center text-3xl md:text-4xl font-medium tracking-tight text-[#31393C] font-sans">
								{t('filter.title', 'Filter')}
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
					</div>

					<div className="p-6 pt-0 bg-white flex-1">
						{Array.isArray(filterData) &&
							filterData.map((group: any) => {
								const titleLower = (group.title || '').toLowerCase()
								const isTwoColumns =
									titleLower.includes('cancellation') ||
									titleLower.includes('prepayment') ||
									titleLower.includes('payment')

								const isFlexRow = titleLower.includes('special offers')
								const itemsList = group.variants || group.options || []

								return (
									<section
										key={group.id}
										className="border-b-[2px] border-[#B4B4B4] pb-8 last:border-0 last:pb-0 mt-8 first:mt-16"
									>
										<h3 className="text-2xl font-medium leading-[29px] text-[#31393C] font-sans mb-4">
											{group.title}
										</h3>

										<div
											className={
												isFlexRow
													? 'flex flex-col sm:flex-row sm:items-center justify-between gap-y-4 gap-x-6'
													: titleLower.includes('form of payment')
														? 'grid grid-cols-1 gap-y-4'
														: isTwoColumns
															? 'grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6'
															: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6'
											}
										>
											{itemsList.map((option: any) => {
												const isChecked =
													localFilters[group.id]?.includes(option.id) || false
												return (
													<label
														key={option.id}
														className="flex min-h-[24px] h-6 items-start space-x-4 cursor-pointer group select-none"
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
															{option.label || option.name}
														</span>
													</label>
												)
											})}
										</div>
									</section>
								)
							})}
					</div>

					<footer className="grid grid-cols-3 items-start mx-6 pb-6 bg-white w-[calc(100%-48px)] border-t-[2px] border-[#B4B4B4] mt-16">
						<div></div>

						<div className="flex justify-center mt-6">
							<button
								onClick={() => setShowConfirm(true)}
								className="w-[184px] h-[64px] rounded-2xl font-sans text-base font-medium text-white transition-colors duration-200 bg-[#FF5F00] hover:bg-[#FF9E59] active:bg-[#FF3D00] disabled:bg-[#F4F4F4] disabled:text-[#B4B4B4] flex items-center justify-center cursor-pointer border-none outline-none select-none"
							>
								{t('filter.apply', 'Apply')}
							</button>
						</div>

						<div className="flex justify-end mt-[46px]">
							<button
								onClick={() => setLocalFilters({})}
								className="text-sm font-normal text-sky-600 hover:text-sky-700 hover:underline transition-colors font-sans cursor-pointer bg-transparent border-none"
							>
								Clear all parameters
							</button>
						</div>
					</footer>
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
