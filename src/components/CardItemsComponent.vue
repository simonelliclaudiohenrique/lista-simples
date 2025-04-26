<template>
  <div class="q-gutter-y-md">
    <q-card v-for="item in listItems" :key="item?.key" class="my-card">
      <q-card-section horizontal>
        <div class="col row itens-center">
          <q-checkbox
            color="primary"
            v-model="item.data.done"
            :label="item.data.content"
            @update:model-value="$emit('checkItem', item)"
          />
          <div class="col row items-center justify-center">
            <span class="q-mr-md">
              {{
                item.data.unit === 'KG'
                  ? item.data?.quantity.toLocaleString('pt-BR', {
                      style: 'decimal',
                      minimumFractionDigits: 3,
                    }) + '/KG'
                  : item.data?.quantity + '/UND'
              }}
            </span>
            <span>
              {{
                (+item.data.price || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
            </span>
          </div>
        </div>

        <q-card-actions vertical class="justify-around">
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
        </q-card-actions>
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
