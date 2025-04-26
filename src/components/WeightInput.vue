<template>
  <q-input
    :model-value="formatted"
    @update:model-value="onInput"
    @keypress="onlyAllowNumbers"
    :label="label"
    :filled="filled"
    :dense="dense"
    :autofocus="autofocus"
    :hint="hint"
    :mask="mask"
    :rules="rules"
    :disable="disable"
    :readonly="readonly"
    :class="className"
    :style="style"
    :type="'text'"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps<{
  modelValue: number | null;
  label?: string;
  filled?: boolean;
  dense?: boolean;
  autofocus?: boolean;
  hint?: string;
  mask?: string;
  rules?: ((val: unknown) => boolean | string)[];
  disable?: boolean;
  readonly?: boolean;
  className?: string;
  style?: string | object;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const { modelValue } = toRefs(props);

// Valor formatado (R$ ...)
const formatted = computed(() => {
  const value = modelValue.value ?? 0;
  return value.toLocaleString('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 3,
  });
});

// Atualiza valor numérico ao digitar
function onInput(val: string | number | null) {
  const str = String(val ?? '');
  const clean = str.replace(/[^\d]/g, '');
  const number = parseFloat(clean) / 1000 || 0;
  emit('update:modelValue', number);
}

function onlyAllowNumbers(event: KeyboardEvent) {
  const allowed = /[0-9]/;
  if (!allowed.test(event.key)) {
    event.preventDefault();
  }
}
</script>
