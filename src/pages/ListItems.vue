<template>
  <q-page class="">
    <list-item-component title="Example component" active :lists="lists" />
  </q-page>
</template>

<script setup lang="ts">
import ListItemComponent from 'src/components/ListItemComponent.vue';
import { reactive } from 'vue';

const lists = reactive([]);
</script>
