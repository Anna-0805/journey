import { useTranslation } from 'react-i18next'

interface ConfirmationDialogProps {
	onConfirm: () => void
	onCancel: () => void
}

export const ConfirmationDialog = ({
	onConfirm,
	onCancel
}: ConfirmationDialogProps) => {
	const { t } = useTranslation()

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
			role="dialog"
			aria-modal="true"
		>
			<div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-gray-100 text-center transform transition-all duration-300 scale-100">
				<h3 className="text-base font-bold text-gray-900 mb-6">
					{t('confirm.title', 'Do you want to apply new filter')}
				</h3>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						onClick={onCancel}
						className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
					>
						{t('confirm.cancel', 'Use old filter')}
					</button>
					<button
						onClick={onConfirm}
						className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm text-sm"
					>
						{t('confirm.apply', 'Apply new filter')}
					</button>
				</div>
			</div>
		</div>
	)
}
