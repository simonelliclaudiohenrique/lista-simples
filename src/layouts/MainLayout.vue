<template>
  <q-layout id="layout" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white text-primary">
        <q-toolbar-title> {{ titlePage }} </q-toolbar-title>
        <q-btn v-if="$route.meta.backButton" flat round dense icon="arrow_back" to="/" />
      </q-toolbar>
    </q-header>

    <ModalComponent v-model="showModal">
      <template #title> {{ $route?.params?.id ? 'Adicionar item' : 'Adicionar lista' }} </template>

      <template #actions>
        <q-btn flat label="confirmar" @click="!!$route?.params?.id ? criarItem() : createList()" />
      </template>

      <q-input
        v-if="!$route?.params?.id"
        dense
        filled
        label="Descrição"
        v-model="listDescription"
        autofocus
        @keyup.enter="createList"
      />
      <div v-else class="q-pa-md q-gutter-md">
        <q-input
          filled
          dense
          v-model="formItem.data.content"
          label="Descrição"
          autofocus
          @keyup.enter="criarItem"
        />
        <q-input
          filled
          dense
          v-model="formItem.data.quantity"
          label="Quantidade"
          autofocus
          @keyup.enter="criarItem"
        />
        <CurrencyInput
          filled
          v-model="formItem.data.price"
          label="Preço"
          @keyup.enter="criarItem"
        />
      </div>
    </ModalComponent>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent row justify-end items-center q-pa-md">
      <q-btn size="lg" round color="primary" icon="add" @click="showModal = true" />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import ModalComponent from 'src/components/ModalComponent.vue';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import { useQuasar } from 'quasar';
import type { ListItem } from 'src/components/models';
import { useListaItemStore } from 'src/stores/listaItemStore';
import { useListaStore } from 'src/stores/listaStore';
import { provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const listStore = useListaStore();
const itemsList = useListaItemStore();
const showModal = ref(false);
const listDescription = ref('');
const titlePage = ref();

provide('titlePage', titlePage);

const formItem = reactive<ListItem>({
  key: '',
  data: {
    content: '',
    listKey: '',
    price: 0,
    quantity: 1,
    done: false,
  },
});

const createList = async () => {
  if (!listDescription.value) {
    return;
  }
  await listStore.createList(listDescription.value);
  await listStore.carregarListas();

  listDescription.value = '';
  showModal.value = false;
};

const criarItem = async () => {
  $q.loading.show();
  if (!formItem.data.content || !formItem.data.quantity) {
    $q.notify({
      color: 'negative',
      message: 'Campos descrição e quantidade são obrigatórios',
    });
    $q.loading.hide();
    return;
  }
  formItem.data.listKey = route?.params?.id as string;
  await itemsList.create(formItem.data);
  $q.loading.hide();
  formItem.data.content = '';
  formItem.data.quantity = 1;
  formItem.data.price = 0;
  await itemsList.get(formItem.data.listKey);
};
</script>
