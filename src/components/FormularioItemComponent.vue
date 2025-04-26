<template>
  <div class="q-gutter-y-md row">
    <q-card style="margin: 0; padding: 0" flat class="col-12">
      <q-card-section>
        <div class="text-subtitle1">
          Preencha os campos e clique em <strong>confimar</strong> para adicionar um item e
          <strong>cancelar</strong>
          para voltar a lista de itens
        </div>
      </q-card-section>
      <q-separator class="col-12" color="primary" />
    </q-card>
    <span>Campos obrigatorios com</span>&nbsp; <span class="text-red">*</span>
    <q-input
      class="col-12"
      filled
      dense
      v-model="formItem.content"
      label="Descrição *"
      autofocus
      @keyup.enter="itemKey ? updateItem() : criarItem()"
    />
    <q-select class="col-12" filled v-model="unitItem" :options="optionsUnit" label="Unidade *" />
    <WeightInput
      v-if="unitItem === 'KG'"
      v-model="formItem.quantity"
      class="col-12"
      filled
      label="Quantidade *"
      @keyup.enter="itemKey ? updateItem() : criarItem()"
    />
    <q-input
      v-else
      filled
      class="col-12"
      dense
      type="number"
      v-model="formItem.quantity"
      label="Quantidade *"
      autofocus
      @keyup.enter="itemKey ? updateItem() : criarItem()"
    />
    <CurrencyInput
      class="col-12"
      filled
      v-model="formItem.price"
      label="Preço"
      @keyup.enter="itemKey ? updateItem() : criarItem()"
    />
    <q-btn
      v-if="itemKey"
      class="col-12 bg-primary text-white"
      flat
      label="confirmar"
      @click="updateItem()"
    />
    <q-btn
      v-else
      class="col-12 bg-primary text-white"
      flat
      label="confirmar"
      @click="criarItem()"
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
import { onMounted, reactive, ref } from 'vue';
import type { PropType } from 'vue';
import WeightInput from './WeightInput.vue';
import CurrencyInput from './CurrencyInput.vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useListaItemStore } from 'src/stores/listaItemStore';
import type { ListItemData } from './models';

const $q = useQuasar();
const route = useRoute();
const listItemStore = useListaItemStore();

const props = defineProps({
  itemKey: {
    type: String,
    default: '',
  },
  item: {
    type: Object as PropType<ListItemData>,
    default: () => {},
  },
});

const emit = defineEmits(['updateModal']);

const unitItem = ref();

const optionsUnit = ['UND', 'KG'];

const formItem = reactive({
  content: '',
  listKey: '',
  price: 0,
  quantity: 0,
  unit: '',
  done: false,
});

const updateItem = async () => {
  $q.loading.show();
  await listItemStore.update(props.itemKey, formItem);
  await listItemStore.get(route?.params?.id as string);
  emit('updateModal');
  $q.loading.hide();
};

const criarItem = async () => {
  $q.loading.show();
  if (!formItem.content || !formItem.quantity) {
    $q.notify({
      color: 'negative',
      message: 'Campos descrição, Unidade e quantidade são obrigatórios',
    });
    $q.loading.hide();
    return;
  }
  formItem.listKey = route?.params?.id as string;
  formItem.unit = unitItem.value;
  await listItemStore.create(formItem);
  $q.loading.hide();
  formItem.content = '';
  formItem.quantity = 0;
  formItem.price = 0;
  await listItemStore.get(formItem.listKey);
};

onMounted(() => {
  if (props.itemKey) {
    formItem.content = props.item.content;
    formItem.done = props.item.done as boolean;
    formItem.listKey = props.item.listKey;
    formItem.price = props.item.price as number;
    formItem.quantity = props.item.quantity;
    formItem.unit = props.item.unit;
    unitItem.value = props.item.unit;
  }
});
defineExpose({
  updateItem,
});
</script>
