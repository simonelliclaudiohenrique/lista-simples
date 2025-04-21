<template>
  <div class="q-gutter-y-md">
    <q-card v-for="item in listItems" :key="item?.key" class="my-card text-primary">
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-checkbox
              color="primary"
              v-model="item.data.done"
              :label="item.data.content"
              @update:model-value="$emit('checkItem', item)"
            />
          </div>
          <div class="col-6 row items-center justify-end">
            <div class="col-2">{{ item.data?.quantity }}</div>
            <div class="col-2">
              {{
                (+item.data.price || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
            </div>
            <div class="col-8 row items-center justify-end">
              <q-btn
                size="sm"
                color="primary"
                flat
                round
                dense
                icon="edit"
                @click.stop="$emit('openModal', item)"
              />
              <q-btn
                size="sm"
                color="negative"
                flat
                round
                dense
                icon="delete"
                @click.stop="$emit('deleteItem', item)"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import type { ListItem } from './models';

defineEmits(['openModal', 'deleteItem', 'checkItem']);
defineProps<{
  listItems: ListItem[];
}>();
</script>
