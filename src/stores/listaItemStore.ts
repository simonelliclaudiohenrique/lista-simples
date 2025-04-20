import { defineStore } from 'pinia';
import type { ListItem, ListItemData } from 'src/components/models';
import { useLocalbase } from 'src/composables/localbase';
import { ref } from 'vue';

export const useListaItemStore = defineStore('itemsList', () => {
  const db = useLocalbase();

  const itemsList = ref<ListItem[]>([]);
  const itemsListDone = ref<ListItem[]>([]);

  const create = async (data: ListItemData) => {
    await db.collection('itemsList').add({
      listKey: data.listKey,
      content: data.content,
      quantity: data.quantity,
      price: data.price,
      done: data.done,
    });
  };

  const get = async (listKey: string) => {
    try {
      const res = await db.collection('itemsList').get({ keys: true });
      itemsList.value = res
        .filter((item: ListItem) => item.data.listKey === listKey)
        .filter((item: ListItem) => !item.data.done);
      itemsListDone.value = res
        .filter((item: ListItem) => item.data.listKey === listKey)
        .filter((item: ListItem) => item.data.done);
    } catch (error) {
      console.error('Erro ao carregar itemsList:', error);
    }
  };

  const getAll = async () => {
    try {
      itemsList.value = await db.collection('itemsList').get({ keys: true });
    } catch (error) {
      console.error('Erro ao carregar itemsList:', error);
    }
  };

  const remove = async (key: string) => {
    await db.collection('itemsList').doc(key).delete();
  };

  const update = async (key: string, data: ListItemData) => {
    await db.collection('itemsList').doc(key).update(data);
  };

  const toggleDone = async (key: string, done: boolean) => {
    await db.collection('itemsList').doc(key).update({ done });
  };

  return { itemsList, itemsListDone, create, get, getAll, remove, update, toggleDone };
});
