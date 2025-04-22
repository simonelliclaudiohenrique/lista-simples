<template>
  <div class="">
    <ModalComponent v-model="showModal">
      <template #title> Atualizar lista </template>

      <template #actions>
        <q-btn flat label="confirmar" @click="alterList" />
      </template>

      <q-input
        filled
        label="Descrição"
        dense
        v-model="listDescription"
        autofocus
        @keyup.enter="alterList"
      />
    </ModalComponent>

    <div class="q-pa-md q-gutter-md">
      <CardListComponent
        :lists="listStore.lists"
        :list-items="listItemStore.itemsList"
        @delete-list="deleteList($event)"
        @open-modal="openModal($event)"
        @to-items-list="toItemsList($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModalComponent from 'src/components/ModalComponent.vue';
import { useQuasar } from 'quasar';
import { useListaStore } from 'src/stores/listaStore';
import { inject, onMounted, ref } from 'vue';
import type { List } from './models';
import { useListaItemStore } from 'src/stores/listaItemStore';
import { useRoute, useRouter } from 'vue-router';
import CardListComponent from './CardListComponent.vue';

const $q = useQuasar();
const listStore = useListaStore();
const listItemStore = useListaItemStore();
const router = useRouter();
const route = useRoute();

const titlePage = ref(inject('titlePage'));

const showModal = ref(false);
const listDescription = ref<string>('');
const listKey = ref<string>('');

onMounted(async () => {
  $q.loading.show();
  await listStore.carregarListas();
  await listItemStore.getAll();
  titlePage.value = route.meta.title;
  $q.loading.hide();
  if (!listStore.lists.length) await router.push({ name: 'Home' });
});

const toItemsList = async (key: string) => {
  await router.push({ name: 'ListItems', params: { id: key } });
};

const openModal = (list: List) => {
  listKey.value = list.key;
  listDescription.value = list.data.description;
  showModal.value = true;
};
const alterList = async () => {
  $q.loading.show();
  await listStore.updateList(listKey.value, listDescription.value);
  await listStore.carregarListas();
  showModal.value = false;
  listDescription.value = '';
  $q.loading.hide();
};

const deleteList = async (key: string) => {
  $q.loading.show();
  await listStore.removeList(key);
  await listStore.carregarListas();
  $q.loading.hide();
  if (!listStore.lists.length) await router.push({ name: 'Home' });
};
</script>
