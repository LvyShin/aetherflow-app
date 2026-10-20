<template>
  <div class="settings-page">
    <section class="settings-intro">
      <span class="eyebrow">数据与配置</span>
      <h2>让账本更贴合你的使用方式</h2>
      <p>当前先开放账单导入，其余设置模块将按里程碑继续接入。</p>
    </section>

    <section class="settings-list">
      <RouterLink class="settings-item" to="/settings/import">
        <span class="item-icon">⇩</span>
        <span>
          <strong>导入数据</strong>
          <small>导入微信、支付宝官方账单</small>
        </span>
        <b>›</b>
      </RouterLink>
      <div class="settings-item disabled">
        <span class="item-icon">⌁</span>
        <span><strong>自动记账</strong><small>下一设置里程碑</small></span>
        <b>›</b>
      </div>
      <div class="settings-item disabled">
        <span class="item-icon">!</span>
        <span><strong>记账通知</strong><small>下一设置里程碑</small></span>
        <b>›</b>
      </div>
    </section>
  </div>
</template>

<style scoped>
.settings-page {
  display: grid;
  gap: 14px;
}

.settings-intro {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
}

.eyebrow {
  color: var(--primary);
  font-size: 0.64rem;
  font-weight: 800;
}

h2 {
  margin: 7px 0 6px;
  font-size: 1.12rem;
}

p {
  margin: 0;
  color: var(--muted);
  font-size: 0.7rem;
  line-height: 1.65;
}

.settings-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
}

.settings-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  color: inherit;
  text-decoration: none;
}

.settings-item:last-child {
  border-bottom: 0;
}

.settings-item.disabled {
  color: var(--muted);
}

.item-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 800;
}

.settings-item > span:nth-child(2) {
  display: grid;
  gap: 3px;
}

.settings-item strong {
  font-size: 0.78rem;
}

.settings-item small {
  color: var(--muted);
  font-size: 0.62rem;
}

.settings-item b {
  color: var(--muted);
  font-weight: 500;
}
</style>
