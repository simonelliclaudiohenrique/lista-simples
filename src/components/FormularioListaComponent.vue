<template>
  <div class="q-gutter-y-md row">
    <q-card style="margin: 0; padding: 0" flat class="col-12">
      <q-card-section>
        <div class="text-subtitle1">Escreva um nome e clique em confirmar para criar uma lista</div>
      </q-card-section>
      <q-separator class="col-12" color="primary" />
    </q-card>
    <q-input
      filled
      class="col-12"
      label="Descrição"
      dense
      v-model="listDescription"
      autofocus
      @keyup.enter="listKey ? alterList() : createList()"
    />
    <q-btn
      v-if="listKey"
      class="col-12 bg-primary text-white"
      flat
      label="confirmar"
      @click="alterList()"
    />
    <q-btn
      v-else
      class="col-12 bg-primary text-white"
      flat
      label="confirmar"
      @click="createList()"
    />
    <q-btn
      class="col-12 bg-negative text-white"
      flat
      label="Cancelar"
      v-close-popup
      @click="$emit('updateModal')"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useListaStore } from 'src/stores/listaStore';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const listStore = useListaStore();
const route = useRoute();
const router = useRouter();

const props = defineProps({
  listKey: {
    type: String,
    default: '',
  },
  item: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['updateModal']);

const listDescription = ref<string>('');

const alterList = async () => {
  $q.loading.show();
  await listStore.updateList(props.listKey, listDescription.value);
  await listStore.carregarListas();
  emit('updateModal');
  listDescription.value = '';
  $q.loading.hide();
};

const createList = async () => {
  if (!listDescription.value) {
    $q.notify({
      color: 'negative',
      message: 'O campo descrição não pode ser vazio',
    });
    return;
  }
  $q.loading.show();
  await listStore.createList(listDescription.value);
  await listStore.carregarListas();

  listDescription.value = '';
  emit('updateModal');
  if (route.name !== 'Lists') await router.push({ name: 'Lists' });
  $q.loading.hide();
};

onMounted(() => {
  if (props.listKey) {
    listDescription.value = props.item.description;
  }
});

defineExpose({
  alterList,
});
</script>
