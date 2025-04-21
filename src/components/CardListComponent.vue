<template>
  <div class="q-gutter-y-md">
    <q-card
      v-for="list in lists"
      :key="list?.key"
      class="my-card cursor-pointer"
      @click="$emit('toItemsList', list.key)"
    >
      <q-card-section>
        <div class="row">
          <div class="col-8">
            <div class="text-subtitle1">{{ list?.data?.description }}</div>
          </div>
          <div class="col-4 row items-center justify-end q-gutter-xs">
            <div class="text-caption">
              {{ quantiItemsListDoneInfo(list) }}/{{ quantiItemslistTotal(list) }}
            </div>
            <div>
              <q-btn
                size="sm"
                color="primary"
                flat
                round
                dense
                icon="edit"
                @click.stop="$emit('openModal', list)"
              />
              <q-btn
                size="sm"
                color="negative"
                flat
                round
                dense
                icon="delete"
                @click.stop="$emit('deleteList', list.key)"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-linear-progress animation-speed="0" size="10px" :value="percentDone(list)" />
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import type { List, ListItem } from './models';

defineEmits(['openModal', 'deleteList', 'toItemsList']);
const props = defineProps<{
  lists: List[];
  listItems: ListItem[];
}>();

const quantiItemsListDoneInfo = (list: List) => {
  const result =
    props.listItems
      .filter((item) => item?.data?.listKey === list.key)
      .filter((item) => item?.data?.done).length || 0;
  return result;
};

const quantiItemslistTotal = (list: List) => {
  const result = props.listItems.filter((item) => item.data?.listKey === list.key).length || 0;
  return result;
};

const percentDone = (list: List) => {
  const result =
    (props?.listItems
      .filter((item) => item?.data?.listKey === list.key)
      .filter((item) => item?.data?.done).length || 0) /
      (props?.listItems.filter((item) => item.data?.listKey === list.key).length || 0) || 0;
  return result;
};
</script>
