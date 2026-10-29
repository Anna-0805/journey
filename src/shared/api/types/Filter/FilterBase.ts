import { FilterType } from '.'

export interface FilterBase {
	title: string
	columns: number | string
	id: string
	label?: string
	type?: FilterType
	description?: string
	image?: string
	icon?: string
}
