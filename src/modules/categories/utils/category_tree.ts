import type { CategoryEntity, CategoryFlowType } from '../models/category'

export const getPrimaryCategories = (
  categories: CategoryEntity[],
  flowType: CategoryFlowType,
): CategoryEntity[] =>
  categories.filter((category) => category.flowType === flowType && category.parentId === null)

export const getChildCategories = (
  categories: CategoryEntity[],
  parentId: string,
): CategoryEntity[] => categories.filter((category) => category.parentId === parentId)

export const findCategory = (
  categories: CategoryEntity[],
  categoryId: string,
): CategoryEntity | undefined => categories.find((category) => category.id === categoryId)

export const getPrimaryCategoryId = (
  categories: CategoryEntity[],
  categoryId: string,
): string => {
  const category = findCategory(categories, categoryId)
  return category?.parentId ?? category?.id ?? ''
}
