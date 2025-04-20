<template>
  <q-page class="">
    <list-component title="Example component" active :lists="lists" />
  </q-page>
</template>

<script setup lang="ts">
import ListComponent from 'src/components/ListComponent.vue';
import { reactive } from 'vue';

const lists = reactive([]);
</script>
