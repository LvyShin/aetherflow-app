<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
  nextMilestone: string
}>()
</script>

<template>
  <section class="placeholder-view">
    <span class="placeholder-icon">{{ icon }}</span>
    <span class="module-label">后续模块</span>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="milestone-card">
      <span>下一里程碑</span>
      <strong>{{ nextMilestone }}</strong>
    </div>
  </section>
</template>

<style scoped>
.placeholder-view {
  display: grid;
  justify-items: center;
  min-height: 64vh;
  padding: 64px 24px 20px;
  text-align: center;
}

.placeholder-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin-bottom: 18px;
  border: 1px solid var(--line);
  border-radius: 25px;
  background: var(--surface);
  box-shadow: var(--shadow);
  font-size: 2rem;
}

.module-label {
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 0.62rem;
  font-weight: 750;
}

h2 {
  margin: 12px 0 7px;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}

p {
  max-width: 330px;
  margin: 0;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.7;
}

.milestone-card {
  display: grid;
  gap: 5px;
  width: min(100%, 320px);
  margin-top: 28px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  text-align: left;
}

.milestone-card span {
  color: var(--muted);
  font-size: 0.62rem;
}

.milestone-card strong {
  font-size: 0.76rem;
}
</style>
