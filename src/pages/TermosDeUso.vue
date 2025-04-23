<template>
  <div class="q-pa-md">
    <h3>Termos de Uso</h3>

    <p>
      Ao acessar o site <strong>Lista Simples</strong>, você concorda em cumprir estes termos de
      serviço, todas as leis e regulamentos aplicáveis, e concorda que é responsável pelo
      cumprimento de todas as leis locais aplicáveis.
    </p>

    <p>
      Você não deve usar este site de forma que possa danificar, desativar ou sobrecarregar nossos
      serviços.
    </p>

    <p>
      Reservamo-nos o direito de modificar estes termos a qualquer momento, sendo que as alterações
      entram em vigor imediatamente após a publicação no site.
    </p>

    <p>Ao continuar usando o site após tais alterações, você concorda com os termos atualizados.</p>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
const titlePage = ref(inject('titlePage'));

onMounted(() => {
  titlePage.value = 'Termos de uso';
});
</script>
