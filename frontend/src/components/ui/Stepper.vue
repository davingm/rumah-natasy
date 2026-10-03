<script setup lang="ts">
withDefaults(defineProps<{
  steps: string[]
  currentStep: number
  disableStepIndicators?: boolean
}>(), {
  disableStepIndicators: false,
})

const emit = defineEmits<{
  stepSelect: [step: number]
}>()
</script>

<template>
  <ol class="stepper" aria-label="Progres pengajuan">
    <li
      v-for="(label, index) in steps"
      :key="label"
      class="step"
      :class="{ done: currentStep > index + 1, current: currentStep === index + 1 }"
      :aria-current="currentStep === index + 1 ? 'step' : undefined"
    >
      <button
        v-if="currentStep > index + 1"
        type="button"
        class="step-btn"
        :disabled="disableStepIndicators"
        @click="emit('stepSelect', index + 1)"
      >
        <span class="step-dot" aria-hidden="true">✓</span>
        <span class="step-label">{{ label }}</span>
        <span class="sr-only">, selesai. Kembali ke langkah ini</span>
      </button>
      <span v-else class="step-btn">
        <span class="step-dot" aria-hidden="true">{{ index + 1 }}</span>
        <span class="step-label">{{ label }}</span>
      </span>
    </li>
  </ol>
</template>

<style scoped>
.stepper {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 30px 0 22px;
  padding: 0;
  list-style: none;
}

.step { position: relative; min-width: 0; }
.step:not(:last-child)::after {
  position: absolute;
  top: 16px;
  left: 44px;
  right: 10px;
  height: 1px;
  background: var(--line);
  content: '';
}
.step.done:not(:last-child)::after { background: var(--accent); }
.step-btn {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: var(--background);
  color: var(--muted);
  font: inherit;
  text-align: left;
}
button.step-btn { cursor: pointer; }
button.step-btn:disabled { cursor: default; }
.step-dot {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--background);
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}
.current .step-dot { border-color: var(--accent); background: var(--accent); color: var(--inverse-text, #fff); }
.done .step-dot { border-color: var(--accent); color: var(--accent); }
.current .step-label,
.done .step-label { color: var(--text); font-weight: 650; }
.step-label { padding-right: 8px; font-size: 12px; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 520px) {
  .stepper { margin: 22px 0 16px; }
  .step-label { display: none; }
  .step:not(:last-child)::after { left: 38px; right: 8px; }
}
</style>
