<script setup lang="ts">
import { ref } from 'vue'

const tutorialOpen = ref(false)
</script>

<template>
  <section class="guide-card">
    <div class="platform-icons" aria-hidden="true">
      <span class="wechat">微</span>
      <span class="alipay">支</span>
    </div>
    <div class="guide-copy">
      <span class="eyebrow">双平台官方账单</span>
      <h2>导入微信 / 支付宝流水</h2>
      <p>本地解析，预览确认后才会写入账本。相同流水会自动跳过。</p>
    </div>
    <button class="tutorial-button" @click="tutorialOpen = !tutorialOpen">
      {{ tutorialOpen ? '收起教程' : '查看导出教程' }}
    </button>
    <div v-if="tutorialOpen" class="tutorial-content">
      <p><strong>微信：</strong>我 → 服务 → 钱包 → 账单 → 常见问题 → 下载账单。</p>
      <p><strong>支付宝：</strong>我的 → 账单 → 开具交易流水证明。</p>
      <p>下载后选择 `.xlsx`、`.xls` 或 `.csv` 文件，单次上限 1MB。</p>
    </div>
  </section>
</template>

<style scoped>
.guide-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 20px;
  overflow: hidden;
  border: 1px solid #d9e5fb;
  border-radius: 24px;
  background: linear-gradient(135deg, #e7f0ff, #f6f9ff);
}

.platform-icons {
  display: flex;
}

.platform-icons span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 3px solid #eef4ff;
  border-radius: 13px;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
}

.wechat {
  z-index: 1;
  background: #21b66f;
}

.alipay {
  margin-left: -10px;
  background: #1677ff;
}

.guide-copy {
  min-width: 0;
}

.eyebrow {
  color: #1c6ed5;
  font-size: 0.64rem;
  font-weight: 800;
}

h2 {
  margin: 5px 0 6px;
  color: #1f324f;
  font-size: 1.05rem;
}

p {
  margin: 0;
  color: #65758e;
  font-size: 0.7rem;
  line-height: 1.65;
}

.tutorial-button {
  grid-column: 1 / -1;
  justify-self: start;
  padding: 7px 12px;
  border: 0;
  border-radius: 999px;
  background: #1f6fd8;
  color: white;
  cursor: pointer;
  font-size: 0.66rem;
  font-weight: 750;
}

.tutorial-content {
  grid-column: 1 / -1;
  display: grid;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(44, 91, 156, 0.13);
}

.tutorial-content p {
  color: #405774;
}

@media (prefers-color-scheme: dark) {
  .guide-card {
    border-color: #243c66;
    background: linear-gradient(135deg, #17243a, #131b2a);
  }

  h2 {
    color: #edf3ff;
  }

  p,
  .tutorial-content p {
    color: #a4b0c3;
  }
}
</style>
