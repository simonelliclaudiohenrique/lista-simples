<template>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          <slot name="title" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <slot />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const [prompt] = defineModel<boolean>({ default: false });
</script>
