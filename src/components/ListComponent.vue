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
      <q-card v-if="listStore.lists.length === 0" rounded class="text-primary">
        <q-card-section>
          <div class="row items-center justify-center text-subtitle1 text-bold">
            Comece a adicionar listas e planejar suas compras
          </div>
        </q-card-section>
      </q-card>

      <q-card
        v-for="list in listStore.lists"
        :key="list?.key"
        class="my-card cursor-pointer"
        @click="toItemsList(list.key)"
      >
        <q-card-section>
          <div class="row">
            <div class="col-8">
              <div class="text-subtitle1">{{ list?.data?.description }}</div>
            </div>
            <div class="col-4 row items-center justify-end q-gutter-xs">
              <div class="text-caption">
                {{
                  listItemStore?.itemsList
                    .filter((item) => item?.data?.listKey === list.key)
                    .filter((item) => item?.data?.done).length || 0
                }}/{{
                  listItemStore.itemsList.filter((item) => item.data?.listKey === list.key)
                    .length || 0
                }}
              </div>
              <div>
                <q-btn
                  size="sm"
                  color="primary"
                  flat
                  round
                  dense
                  icon="edit"
                  @click.stop="openModal(list)"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  flat
                  round
                  dense
                  icon="delete"
                  @click.stop="deleteList(list.key)"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-linear-progress
            animation-speed="0"
            size="10px"
            :value="
              (listItemStore?.itemsList
                .filter((item) => item?.data?.listKey === list.key)
                .filter((item) => item?.data?.done).length || 0) /
                (listItemStore.itemsList.filter((item) => item.data?.listKey === list.key).length ||
                  0) || 0
            "
          />
        </q-card-section>
      </q-card>
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
};
</script>
