<template>
  <div class="">
    <ModalComponent v-if="showModal" v-model="showModal">
      <template #title> Atualizar lista </template>

      <template #actions>
        <q-btn flat label="confirmar" @click="updateItem" />
      </template>

      <div class="q-pa-md q-gutter-md">
        <q-input
          filled
          dense
          v-model="formItem.content"
          label="Descrição"
          autofocus
          @keyup.enter="updateItem"
        />
        <q-input
          filled
          dense
          type="number"
          v-model="formItem.quantity"
          label="Quantidade"
          autofocus
          @keyup.enter="updateItem"
        />
        <CurrencyInput filled v-model="formItem.price" label="Preço" @keyup.enter="updateItem" />
      </div>
    </ModalComponent>

    <div class="q-pa-md q-gutter-md">
      <q-img
        v-if="listItemStore.itemsList?.length === 0 && listItemStore.itemsListDone?.length === 0"
        src="/src/assets/fundo_vazio.png"
      >
        <div class="absolute-bottom text-primary bg-transparent"></div>
      </q-img>
      <div class="text-h6 text-center text-primary">
        Adicione os items que deseja comprar a sua lista
      </div>
      <div class="text-subtitle1 text-center text-secondary">
        Use o botão para adicionar um novo item
      </div>
      <!-- <CardInfoComponent
        v-if="listItemStore.itemsList?.length === 0 && listItemStore.itemsListDone?.length === 0"
      >
        Comece a adicionar items a sua lista
      </CardInfoComponent> -->

      <CardItemsComponent
        :list-items="listItemStore?.itemsList"
        @delete-item="deleteItem($event.key)"
        @check-item="checkItem($event.key, $event.data.done)"
        @open-modal="openModal($event)"
      />

      <CardTotalComponent
        v-if="listItemStore.itemsList.length > 0 || listItemStore.itemsListDone.length > 0"
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
import CurrencyInput from './CurrencyInput.vue';
import ModalComponent from './ModalComponent.vue';
import { useListaItemStore } from 'src/stores/listaItemStore';
import { useQuasar } from 'quasar';
import { inject, onMounted, reactive, ref } from 'vue';
import type { ListItem } from './models';
import { useRoute } from 'vue-router';
import { useListaStore } from 'src/stores/listaStore';
import CardItemsComponent from './CardItemsComponent.vue';
import CardTotalComponent from './CardTotalComponent.vue';
// import CardInfoComponent from './CardInfoComponent.vue';

const $q = useQuasar();
const route = useRoute();
const listStore = useListaStore();
const listItemStore = useListaItemStore();

const titlePage = ref(inject('titlePage'));

const showModal = ref(false);
const itemKey = ref('');

const formItem = reactive({
  content: '',
  listKey: '',
  price: 0,
  quantity: 0,
  done: false,
});

const calculateTotal = () => {
  const result = listItemStore.itemsListDone
    .filter((item) => item.data.done)
    .reduce((acc, item) => acc + +item.data.price * +item.data.quantity, 0)
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return result;
};

const quantityItems = () => {
  const result = listItemStore.itemsListDone
    .filter((item) => item.data.done)
    .reduce((acc, item) => acc + +item.data.quantity, 0);
  return result;
};

const openModal = (item: ListItem) => {
  itemKey.value = item.key;
  formItem.content = item.data.content;
  formItem.listKey = item.data.listKey;
  formItem.quantity = item.data.quantity;
  formItem.price = item.data.price;
  formItem.done = item.data.done;
  showModal.value = true;
};

const updateItem = async () => {
  $q.loading.show();
  await listItemStore.update(itemKey.value, formItem);
  await listItemStore.get(route?.params?.id as string);
  showModal.value = false;
  $q.loading.hide();
};

const checkItem = async (key: string, done: boolean) => {
  $q.loading.show();
  await listItemStore.toggleDone(key, done);
  await listItemStore.get(route?.params?.id as string);
  $q.loading.hide();
};

const deleteItem = async (key: string) => {
  $q.loading.show();
  await listItemStore.remove(key);
  await listItemStore.get(route?.params?.id as string);
  $q.loading.hide();
};

onMounted(async () => {
  $q.loading.show();
  const list = await listStore.getList(route?.params?.id as string);
  await listItemStore.get(route?.params?.id as string);
  if (list.description) titlePage.value = list.description;
  $q.loading.hide();
});
</script>
