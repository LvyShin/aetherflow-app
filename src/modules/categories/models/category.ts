export type CategoryFlowType = 'EXPENSE' | 'INCOME'

export interface CategoryEntity {
  id: string
  parentId: string | null
  name: string
  flowType: CategoryFlowType
  icon: string
  sortOrder: number
}

export interface CategoryDefinition {
  slug: string
  name: string
  icon: string
  children: string[]
}
