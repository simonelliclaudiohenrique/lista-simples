<template>
  <q-drawer
    v-model="drawerProxy"
    show-if-above
    :width="300"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'"
  >
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item clickable to="/lists">
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="menuItem.separator" />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MenuList } from './models';

const props = defineProps<{
  modelValue: boolean;
  menuList: MenuList[];
}>();

const emit = defineEmits(['update:modelValue']);

const drawerProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
