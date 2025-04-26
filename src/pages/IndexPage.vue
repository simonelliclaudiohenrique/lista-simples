<template>
  <q-page class="row justify-center items-center">
    <div>
      <q-img src="~/assets/fundo_vazio.png">
        <div class="absolute-bottom text-primary bg-transparent"></div>
      </q-img>
      <div class="text-h6 text-center text-primary">
        Comece a criar suas listas e planejar suas compras
      </div>
      <div class="text-subtitle1 text-center text-secondary">Use o botão par criar uma lista</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useListaStore } from 'src/stores/listaStore';
import { inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const listStore = useListaStore();

const titlePage = ref(inject('titlePage'));
onMounted(() => {});
onMounted(async () => {
  $q.loading.show();
  await listStore.carregarListas();
  if (listStore?.lists?.length > 0) {
    await router.push({ name: 'Lists' });
  }
  titlePage.value = route.meta.title;
  $q.loading.hide();
});
</script>
