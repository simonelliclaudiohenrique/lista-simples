<template>
  <div class="">
    <div class="row q-pa-md" v-if="($q.screen.xs || $q.screen.sm) && showModal">
      <FormularioListaComponent :item="listForm" :list-key="listKey" @update-modal="cancel" />
    </div>
    <ModalComponent
      v-if="!$q.screen.xs && !$q.screen.sm && showModal"
      v-model="showModal as boolean"
    >
      <FormularioListaComponent :item="listForm" :list-key="listKey" @update-modal="cancel" />
    </ModalComponent>

    <div v-if="!showModal" class="q-pa-md q-gutter-md">
      <CardListComponent
        :lists="listStore?.lists || []"
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
import FormularioListaComponent from './FormularioListaComponent.vue';

const $q = useQuasar();
const listStore = useListaStore();
const listItemStore = useListaItemStore();
const router = useRouter();
const route = useRoute();
const listForm = ref();

const titlePage = ref(inject('titlePage'));

const showModal = ref(inject('showModal'));
const listKey = ref<string>('');

onMounted(async () => {
  $q.loading.show();
  await listStore.carregarListas();
  await listItemStore.getAll();
  titlePage.value = route.meta.title;
  $q.loading.hide();
  if (!listStore?.lists?.length && !showModal.value) await router.push({ name: 'Home' });
});

const toItemsList = async (key: string) => {
  await router.push({ name: 'ListItems', params: { id: key } });
};

const openModal = (list: List) => {
  listKey.value = list.key;
  listForm.value = list?.data;
  showModal.value = true;
};

const deleteList = async (key: string) => {
  $q.loading.show();
  await listStore.removeList(key);
  await listStore.carregarListas();
  $q.loading.hide();
  if (!listStore?.lists?.length) await router.push({ name: 'Home' });
};

const cancel = async () => {
  showModal.value = false;
  listKey.value = '';
  if (!listStore?.lists?.length) await router.push({ name: 'Home' });
};
</script>
