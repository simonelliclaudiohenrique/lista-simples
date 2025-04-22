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
        component: () => import('pages/listPage.vue'),
        name: 'Lists',
        meta: { title: 'Minhas listas' },
      },
      {
        path: '/list/:id',
        component: () => import('pages/listItems.vue'),
        name: 'ListItems',
        meta: { title: 'Itens da lista', backButton: true },
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
