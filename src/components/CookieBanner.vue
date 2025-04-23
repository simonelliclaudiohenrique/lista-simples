<template>
  <q-banner v-if="!accepted" class="bg-primary fixed-bottom q-pa-md" dense inline-actions>
    Este site usa cookies para melhorar sua experiência. Ao continuar, você aceita nossa política de
    cookies.

    <template v-slot:action>
      <q-btn flat label="Aceitar" color="" @click="acceptCookies" />
    </template>
  </q-banner>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cookies } from 'quasar';

const accepted = ref(false);

onMounted(() => {
  accepted.value = Cookies.get('cookies_accepted') === 'true';
});

function acceptCookies() {
  Cookies.set('cookies_accepted', 'true', { expires: 365 });
  accepted.value = true;
}
</script>
