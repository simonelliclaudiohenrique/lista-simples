<template>
  <div class="q-gutter-y-md">
    <q-card v-for="item in listItems" :key="item?.key" class="my-card text-primary">
      <q-card-section>
        <div class="row items-center">
          <div class="col-10 row items-center">
            <div :class="$q.screen.xs || $q.screen.sm ? 'col-12' : 'col-8'">
              <q-checkbox
                color="primary"
                v-model="item.data.done"
                :label="item.data.content"
                @update:model-value="$emit('checkItem', item)"
              />
            </div>
            <div :class="$q.screen.xs || $q.screen.sm ? 'col-6' : 'col-2'">
              {{
                item.data.unit === 'KG'
                  ? item.data?.quantity.toLocaleString('pt-BR', {
                      style: 'decimal',
                      minimumFractionDigits: 3,
                    }) + '/KG'
                  : item.data?.quantity + '/UND'
              }}
            </div>
            <div :class="$q.screen.xs || $q.screen.sm ? 'col-4' : 'col-2'">
              {{
                (+item.data.price || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
            </div>
          </div>
          <div
            :class="$q.screen.xs || $q.screen.sm ? 'col-2' : 'col-2'"
            class="col-2 row items-center justify-end"
          >
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
