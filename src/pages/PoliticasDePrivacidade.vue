<template>
  <div class="q-pa-md">
    <h3>Política de Privacidade</h3>

    <p>
      Sua privacidade é importante para nós. É política do Lista Simples respeitar a sua privacidade
      em relação a qualquer informação sua que possamos coletar no site
      <strong>Lista Simples</strong>, e outros sites que operamos.
    </p>

    <p>
      Coletamos informações básicas como cookies para melhorar sua experiência de navegação. Não
      compartilhamos informações de identificação pessoal com terceiros, exceto quando exigido por
      lei.
    </p>

    <p>
      Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez
      não possamos fornecer alguns dos serviços desejados.
    </p>

    <p>
      O uso continuado do nosso site será considerado como aceitação de nossas práticas em torno de
      privacidade e informações pessoais.
    </p>

    <p>
      Se você tiver dúvidas sobre como lidamos com dados do usuário e informações pessoais, entre em
      contato conosco.
    </p>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
const titlePage = ref(inject('titlePage'));

onMounted(() => {
  titlePage.value = 'Política de Privacidade';
});
</script>
