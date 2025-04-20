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
      <q-card
        v-if="listItemStore.itemsList?.length === 0 && listItemStore.itemsListDone?.length === 0"
        rounded
        class="text-primary"
      >
        <q-card-section>
          <div class="row items-center justify-center text-subtitle1 text-bold">
            Comece a adicionar itens a sua lista
          </div>
        </q-card-section>
      </q-card>
      <q-card v-for="item in listItemStore?.itemsList" :key="item?.key" class="my-card">
        <q-card-section>
          <div class="row">
            <div class="col-6">
              <q-checkbox
                v-model="item.data.done"
                :label="item.data.content"
                @update:model-value="checkItem(item?.key, item?.data?.done)"
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
                  @click.stop="openModal(item)"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  flat
                  round
                  dense
                  icon="delete"
                  @click.stop="deleteItem(item.key)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card
        bordered
        style="position: sticky; bottom: 0"
        v-if="listItemStore.itemsList.length > 0 || listItemStore.itemsListDone.length > 0"
        rounded
        class="q-pa-md text-primary"
      >
        <div class="text-subtitle1 row items-center q-gutter-md">
          <div class="text-bold">
            Itens: <span class="text-bold">{{ listItemStore.itemsListDone.length }}</span>
          </div>
          <div class="text-bold">
            Total:
            <span class="text-bold">{{
              listItemStore.itemsListDone
                .filter((item) => item.data.done)
                .reduce((acc, item) => acc + item.data.price * item.data.quantity, 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            }}</span>
          </div>
        </div>
      </q-card>
      <q-card
        v-for="item in listItemStore?.itemsListDone"
        :key="item?.key"
        class="my-card bg-light-blue-1"
      >
        <q-card-section>
          <div class="row">
            <div class="col-6">
              <q-checkbox
                color="primary"
                v-model="item.data.done"
                :label="item.data.content"
                @update:model-value="checkItem(item?.key, item?.data?.done)"
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
                  @click.stop="openModal(item)"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  flat
                  round
                  dense
                  icon="delete"
                  @click.stop="deleteItem(item.key)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
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
