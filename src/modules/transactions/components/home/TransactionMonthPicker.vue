<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import BaseSheet from '../../../../shared/components/BaseSheet.vue'

const ITEM_HEIGHT = 44

const props = defineProps<{
  open: boolean
  initialMonth: string
  months: string[]
}>()

const emit = defineEmits<{ close: []; confirm: [monthKey: string] }>()

const selectedYear = ref<number>(0)
const selectedMonth = ref<number>(0)
const yearRail = ref<HTMLElement | null>(null)
const monthRail = ref<HTMLElement | null>(null)

const years = computed(() => {
  const set = new Set(props.months.map((month) => Number(month.split('-')[0])))
  return [...set].sort((left, right) => right - left)
})

const availableMonths = computed(() => {
  return props.months
    .filter((month) => Number(month.split('-')[0]) === selectedYear.value)
    .map((month) => Number(month.split('-')[1]))
    .sort((left, right) => right - left)
})

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    const [year, month] = props.initialMonth.split('-').map(Number)
    selectedYear.value = years.value.includes(year) ? year : years.value[0] ?? year
    await nextTick()
    selectedMonth.value = availableMonths.value.includes(month)
      ? month
      : availableMonths.value[0] ?? month
    await nextTick()
    scrollRail(yearRail.value, years.value.indexOf(selectedYear.value), 'auto')
    scrollRail(monthRail.value, availableMonths.value.indexOf(selectedMonth.value), 'auto')
  },
  { immediate: true },
)

function scrollRail(rail: HTMLElement | null, index: number, behavior: ScrollBehavior): void {
  if (!rail || index < 0) return
  rail.scrollTo({ top: index * ITEM_HEIGHT, behavior })
}

function selectYear(year: number, scroll = true): void {
  selectedYear.value = year
  if (!availableMonths.value.includes(selectedMonth.value)) {
    selectedMonth.value = availableMonths.value[0] ?? selectedMonth.value
  }
  nextTick(() => {
    if (scroll) {
      scrollRail(yearRail.value, years.value.indexOf(year), 'smooth')
    }
    scrollRail(monthRail.value, availableMonths.value.indexOf(selectedMonth.value), 'smooth')
  })
}

function handleYearScroll(event: Event): void {
  const rail = event.currentTarget as HTMLElement
  const index = Math.max(0, Math.round(rail.scrollTop / ITEM_HEIGHT))
  const year = years.value[index]
  if (year && year !== selectedYear.value) selectYear(year, false)
}

function handleMonthScroll(event: Event): void {
  const rail = event.currentTarget as HTMLElement
  const index = Math.max(0, Math.round(rail.scrollTop / ITEM_HEIGHT))
  const month = availableMonths.value[index]
  if (month) selectedMonth.value = month
}

function selectMonth(month: number): void {
  selectedMonth.value = month
  nextTick(() => {
    scrollRail(monthRail.value, availableMonths.value.indexOf(month), 'smooth')
  })
}

function confirm(): void {
  if (!availableMonths.value.includes(selectedMonth.value)) return
  emit('confirm', `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}`)
}
</script>

<template>
  <BaseSheet :open="open" content-class="month-picker-sheet" label="选择年月" @close="$emit('close')">
    <section class="month-picker">
      <h2>{{ selectedYear }} 年 {{ selectedMonth }} 月</h2>

      <div class="picker-grid">
        <div class="picker-column">
          <span class="picker-label">年份</span>
          <div
            ref="yearRail"
            class="picker-rail"
            role="listbox"
            aria-label="选择年份"
            @scroll.passive="handleYearScroll"
          >
            <span class="rail-spacer" aria-hidden="true" />
            <button
              v-for="year in years"
              :key="year"
              type="button"
              class="rail-option"
              role="option"
              :class="{ active: year === selectedYear }"
              :aria-selected="year === selectedYear"
              @click="selectYear(year)"
            >
              {{ year }}年
            </button>
            <span class="rail-spacer" aria-hidden="true" />
          </div>
        </div>

        <div class="picker-column">
          <span class="picker-label">月份</span>
          <div
            ref="monthRail"
            class="picker-rail"
            role="listbox"
            aria-label="选择月份"
            @scroll.passive="handleMonthScroll"
          >
            <span class="rail-spacer" aria-hidden="true" />
            <button
              v-for="month in availableMonths"
              :key="month"
              type="button"
              class="rail-option"
              role="option"
              :class="{ active: month === selectedMonth }"
              :aria-selected="month === selectedMonth"
              @click="selectMonth(month)"
            >
              {{ String(month).padStart(2, '0') }}月
            </button>
            <span class="rail-spacer" aria-hidden="true" />
          </div>
        </div>
      </div>

      <footer>
        <button class="confirm" @click="confirm">确定</button>
        <button class="cancel" @click="$emit('close')">取消</button>
      </footer>
    </section>
  </BaseSheet>
</template>

<style scoped>
.month-picker {
  padding: 4px 2px;
  text-align: center;
}

h2 {
  margin: 0 0 18px;
  font-size: 1rem;
}

.picker-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.picker-column {
  display: grid;
  gap: 10px;
}

.picker-label {
  color: var(--muted);
  font-size: 0.62rem;
}

.picker-rail {
  display: flex;
  height: 220px;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface-soft);
}

.picker-rail::-webkit-scrollbar {
  display: none;
}

.rail-spacer {
  flex: 0 0 88px;
  pointer-events: none;
}

.rail-option {
  flex: 0 0 44px;
  width: calc(100% - 12px);
  margin: 0 6px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--muted-strong);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 720;
  scroll-snap-align: center;
  transition:
    background 0.16s ease,
    color 0.16s ease;
}

.rail-option.active {
  background: var(--primary);
  color: white;
}

footer {
  display: grid;
  gap: 10px;
}

.confirm {
  padding: 12px;
  border: 2px solid var(--primary);
  border-radius: 999px;
  background: transparent;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 760;
  cursor: pointer;
}

.cancel {
  padding: 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted-strong);
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
