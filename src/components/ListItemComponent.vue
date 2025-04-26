<template>
  <div class="">
    <div class="row q-pa-md" v-if="($q.screen.xs || $q.screen.sm) && showModal">
      <FormularioItemComponent
        ref="form"
        class="col-12"
        :item="itemForm"
        :item-key="itemKey"
        @update-modal="((showModal = false), (itemKey = ''))"
      />
    </div>
    <ModalComponent
      v-if="!$q.screen.xs && !$q.screen.sm && showModal"
      v-model="showModal as boolean"
    >
      <FormularioItemComponent
        ref="form"
        :item="itemForm"
        :item-key="itemKey"
        @update-modal="((showModal = false), (itemKey = ''))"
      />
    </ModalComponent>

    <div v-if="!showModal" class="q-pa-md q-gutter-md">
      <div
        v-if="listItemStore?.itemsList?.length === 0 && listItemStore?.itemsListDone?.length === 0"
      >
        <q-img src="~/assets/fundo_vazio.png">
          <div class="absolute-bottom text-primary bg-transparent"></div>
        </q-img>
        <div class="text-h6 text-center text-primary">
          Adicione os items que deseja comprar a sua lista
        </div>
        <div class="text-subtitle1 text-center text-secondary">
          Use o botão para adicionar um novo item
        </div>
      </div>

      <CardItemsComponent
        :list-items="listItemStore?.itemsList"
        @delete-item="deleteItem($event.key)"
        @check-item="checkItem($event.key, $event.data.done)"
        @open-modal="openModal($event)"
      />

      <CardTotalComponent
        v-if="listItemStore?.itemsList?.length > 0 || listItemStore?.itemsListDone?.length > 0"
        :quantity="quantityItems()"
        :total="calculateTotal()"
      />

      <CardItemsComponent
        :list-items="listItemStore.itemsListDone"
        @open-modal="openModal($event)"
        @delete-item="deleteItem($event.key)"
        @check-item="checkItem($event.key, $event.data.done)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModalComponent from './ModalComponent.vue';
import { useListaItemStore } from 'src/stores/listaItemStore';
import { useQuasar } from 'quasar';
import { inject, onMounted, ref } from 'vue';
import type { ListItem } from './models';
import { useRoute, useRouter } from 'vue-router';
import { useListaStore } from 'src/stores/listaStore';
import CardItemsComponent from './CardItemsComponent.vue';
import CardTotalComponent from './CardTotalComponent.vue';
import FormularioItemComponent from './FormularioItemComponent.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const listStore = useListaStore();
const listItemStore = useListaItemStore();
const unitItem = ref();
const itemKey = ref('');
const itemForm = ref();
const form = ref();

const titlePage = ref(inject('titlePage'));

const showModal = ref(inject('showModal'));

const calculateTotal = () => {
  const result = listItemStore.itemsListDone
    .filter((item) => item.data.done)
    .reduce((acc, item) => acc + +item.data.price * +item.data.quantity, 0)
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return result;
};

const quantityItems = () => {
  const result = listItemStore.itemsListDone.filter((item) => item.data.done).length;
  return result;
};

const openModal = (item: ListItem) => {
  unitItem.value = item.data.unit || null;
  itemKey.value = item.key;
  itemForm.value = item.data;
  showModal.value = true;
};

const deleteItem = async (key: string) => {
  $q.loading.show();
  await listItemStore.remove(key);
  await listItemStore.get(route?.params?.id as string);
  $q.loading.hide();
};
const checkItem = async (key: string, done: boolean) => {
  $q.loading.show();
  await listItemStore.toggleDone(key, done);
  await listItemStore.get(route?.params?.id as string);
  $q.loading.hide();
};

onMounted(async () => {
  $q.loading.show();
  const list = await listStore.getList(route?.params?.id as string);
  if (!list) await router.push({ name: 'Home' });
  await listItemStore.get(route?.params?.id as string);
  if (list) titlePage.value = list?.description;
  $q.loading.hide();
});
</script>
