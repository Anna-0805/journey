import React from 'react'
import { useTranslation } from 'react-i18next'

export const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation()

	const toggleLanguage = () => {
		const nextLang = i18n.language === 'en' ? 'uk' : 'en'
		i18n.changeLanguage(nextLang)
	}

	return (
		<button
			onClick={toggleLanguage}
			data-lang={i18n.language}
			className="fixed top-4 left-4 z-50 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-xl text-sm shadow-sm transition-colors cursor-pointer select-none"
		>
			{i18n.language === 'en' ? '🌐 EN ➔ UK' : '🌐 UK ➔ EN'}
		</button>
	)
}
