<script setup lang="ts">
import AppIcon from '../../../../shared/components/AppIcon.vue'

defineProps<{
  todayExpense: string
  monthExpense: string
  monthIncome: string
  monthBalance: string
  balanceNegative: boolean
  privacyMode: boolean
}>()

const emit = defineEmits<{ togglePrivacy: [] }>()
</script>

<template>
  <section class="asset-card" aria-label="本月资产概览">
    <div class="asset-card-head">
      <div>
        <span class="asset-eyebrow">今日支出 (元)</span>
        <strong class="asset-today">¥{{ todayExpense }}</strong>
      </div>
      <button class="privacy-button" :aria-label="privacyMode ? '显示金额' : '隐藏金额'" @click="emit('togglePrivacy')">
        <AppIcon :name="privacyMode ? 'eye-off' : 'eye'" />
      </button>
    </div>
    <div class="asset-summary-grid">
      <div>
        <span>本月支出</span>
        <strong>¥{{ monthExpense }}</strong>
      </div>
      <div>
        <span>本月收入</span>
        <strong>¥{{ monthIncome }}</strong>
      </div>
    </div>
    <div class="asset-balance">
      <span>本月结余</span>
      <strong :class="{ negative: balanceNegative }">{{ balanceNegative ? '-' : '+' }}¥{{ monthBalance }}</strong>
    </div>
  </section>
</template>

<style scoped>
.asset-card {
  position: relative;
  overflow: hidden;
  padding: 20px;
  border: 1px solid rgba(225, 184, 104, 0.3);
  border-radius: 26px;
  background:
    radial-gradient(circle at 96% 5%, rgba(255, 255, 255, 0.72), transparent 32%),
    linear-gradient(135deg, #fff8e9 0%, #ffedca 100%);
  box-shadow: 0 12px 30px rgba(163, 119, 42, 0.08);
  color: #342718;
}

.asset-card::after {
  position: absolute;
  width: 150px;
  height: 150px;
  right: -52px;
  bottom: -82px;
  border: 1px solid rgba(150, 103, 31, 0.12);
  border-radius: 50%;
  content: "";
}

.asset-card-head,
.asset-balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.asset-eyebrow {
  display: block;
  color: #89672f;
  font-size: 0.72rem;
  font-weight: 650;
}

.asset-today {
  display: block;
  margin-top: 4px;
  font-size: 1.85rem;
  letter-spacing: -0.04em;
}

.privacy-button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.58);
  color: #775a2b;
  cursor: pointer;
}

.asset-summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 18px;
}

.asset-summary-grid div {
  display: grid;
  gap: 4px;
}

.asset-summary-grid span,
.asset-balance span {
  color: #8d6b33;
  font-size: 0.7rem;
  font-weight: 600;
}

.asset-summary-grid strong {
  font-size: 0.98rem;
  font-weight: 800;
}

.asset-balance {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(112, 78, 25, 0.12);
  font-size: 0.78rem;
}

.asset-balance strong {
  color: #197a5d;
}

.asset-balance strong.negative {
  color: #c8504f;
}

@media (prefers-color-scheme: dark) {
  .asset-card {
    border-color: #493a21;
    background:
      radial-gradient(circle at 96% 5%, rgba(255, 255, 255, 0.08), transparent 32%),
      linear-gradient(135deg, #3b2e17 0%, #2a210f 100%);
    color: #fff0d3;
  }

  .asset-eyebrow,
  .asset-summary-grid span,
  .asset-balance span {
    color: #c6a66b;
  }

  .privacy-button {
    background: rgba(255, 255, 255, 0.08);
    color: #e7c993;
  }
}
</style>
