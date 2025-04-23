import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'Home',
        meta: { title: 'Home' },
      },
      {
        path: '/lists',
        component: () => import('pages/ListPage.vue'),
        name: 'Lists',
        meta: { title: 'Minhas listas' },
      },
      {
        path: '/list/:id',
        component: () => import('pages/ListItems.vue'),
        name: 'ListItems',
        meta: { title: 'Itens da lista', backButton: true },
      },
      {
        path: '/termos-de-uso',
        component: () => import('pages/TermosDeUso.vue'),
        name: 'TermosDeUso',
        meta: { title: 'Termos De Uso', backButton: true },
      },
      {
        path: '/politicas-de-privacidade',
        component: () => import('pages/PoliticasDePrivacidade.vue'),
        name: 'PoliticasDePrivacidade',
        meta: { title: 'Podliticas de Privacidade', backButton: true },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
