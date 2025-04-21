<template>
  <q-card bordered style="position: sticky; bottom: 0" rounded class="q-pa-md bg-light-blue-1">
    <div class="text-subtitle1 row items-center q-gutter-md">
      <div class="text-bold">
        Itens: <span class="text-bold">{{ quantity }}</span>
      </div>
      <div class="text-bold">
        Total:
        <span class="text-bold">{{ total }}</span>
      </div>
    </div>
  </q-card>
</template>
<script setup lang="ts">
defineProps<{
  total: string | number;
  quantity: string | number;
}>();
</script>
