<template>
  <q-layout id="layout" view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-grey-2 text-primary">
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title> {{ titlePage }} </q-toolbar-title>
        <div class="q-gutter-md">
          <q-btn
            v-if="$route.meta.backButton"
            flat
            round
            dense
            icon="arrow_back"
            to="/lists"
            @click="showModal = false"
          />
          <q-btn
            v-if="!$q.screen.xs && !$q.screen.sm"
            color="primary"
            :label="$route.name === 'ListItems' ? 'Adicionar item' : 'Criar Nova Lista'"
            :to="$route.name === 'Home' ? '/lists' : ''"
            @click="showModal = true"
          />
        </div>
      </q-toolbar>
      <q-separator />
    </q-header>

    <DrawerComponent v-model="drawer" :menu-list="menuList" />

    <q-page-container class="row justify-center bg-grey-2">
      <div style="width: 600px">
        <router-view />
      </div>
    </q-page-container>

    <q-footer class="bg-transparent row justify-end items-center q-pa-md">
      <q-btn
        v-if="$q.screen.xs || $q.screen.sm"
        size="lg"
        round
        color="primary"
        :to="$route.name === 'Home' ? '/lists' : ''"
        icon="add"
        @click="showModal = true"
      />
      <CookieBanner />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { MenuList } from 'src/components/models';
import DrawerComponent from 'src/components/DrawerComponent.vue';
import CookieBanner from 'src/components/CookieBanner.vue';
import { provide, ref } from 'vue';

const $q = useQuasar();
const showModal = ref(false);
const titlePage = ref();
const drawer = ref(false);

provide('showModal', showModal);

const menuList: MenuList[] = [
  {
    icon: 'draw',
    label: 'Lista Simples App',
    to: '/',
    separator: true,
  },
  {
    icon: 'edit_note',
    label: 'Lista de compras',
    to: '/lists',
    separator: false,
  },
  {
    icon: 'description',
    label: 'Termos de uso',
    to: '/termos-de-uso',
    separator: false,
  },
  {
    icon: 'policy',
    label: 'Politicas de privacidade',
    to: '/politicas-de-privacidade',
    separator: false,
  },
];

provide('titlePage', titlePage);
</script>
