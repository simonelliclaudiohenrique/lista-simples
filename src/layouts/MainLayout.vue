<template>
  <q-layout id="layout" view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-grey-2 text-primary">
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title> {{ titlePage }} </q-toolbar-title>
        <div class="q-gutter-md">
          <q-btn v-if="$route.meta.backButton" flat round dense icon="arrow_back" to="/lists" />
          <q-btn
            v-if="!$q.screen.xs && !$q.screen.sm"
            color="primary"
            :label="$route.name === 'ListItems' ? 'Adicionar item' : 'Criar Nova Lista'"
            @click="showModal = true"
          />
        </div>
      </q-toolbar>
      <q-separator />
    </q-header>

    <DrawerComponent v-model="drawer" :menu-list="menuList" />

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

    <q-page-container class="row justify-center bg-grey-2">
      <div style="width: 600px">
        <router-view />
      </div>
    </q-page-container>

    <q-footer class="bg-transparent row justify-end items-center q-pa-md">
      <q-btn
        v-if="$q.screen.xs || $q.screen.sm"
        size="lg"
        round
        color="primary"
        icon="add"
        @click="showModal = true"
      />
      <CookieBanner />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import ModalComponent from 'src/components/ModalComponent.vue';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import { useQuasar } from 'quasar';
import type { ListItem, MenuList } from 'src/components/models';
import { useListaItemStore } from 'src/stores/listaItemStore';
import { useListaStore } from 'src/stores/listaStore';
import { onMounted, provide, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DrawerComponent from 'src/components/DrawerComponent.vue';
import CookieBanner from 'src/components/CookieBanner.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const listStore = useListaStore();
const itemsList = useListaItemStore();
const showModal = ref(false);
const listDescription = ref('');
const titlePage = ref();
const drawer = ref(false);

const menuList: MenuList[] = [
  {
    icon: 'draw',
    label: 'Lista Simples App',
    to: '/',
    separator: true,
  },
  {
    icon: 'edit_note',
    label: 'Lista de compras',
    to: '/lists',
    separator: false,
  },
  {
    icon: 'description',
    label: 'Termos de uso',
    to: '/termos-de-uso',
    separator: false,
  },
  {
    icon: 'policy',
    label: 'Politicas de privacidade',
    to: '/politicas-de-privacidade',
    separator: false,
  },
];

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

onMounted(async () => {
  $q.loading.show();
  await listStore.carregarListas();
  if (listStore?.lists?.length > 0) {
    await router.push({ name: 'Lists' });
  }
  $q.loading.hide();
});

const createList = async () => {
  if (!listDescription.value) {
    return;
  }
  await listStore.createList(listDescription.value);
  await listStore.carregarListas();

  listDescription.value = '';
  showModal.value = false;
  if (route.name !== 'Lists') await router.push({ name: 'Lists' });
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

provide('titlePage', titlePage);
</script>
