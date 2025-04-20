import { defineStore } from 'pinia';
import type { List, ListItem } from 'src/components/models';
import { useLocalbase } from 'src/composables/localbase';
import { ref } from 'vue';

export const useListaStore = defineStore('lista', () => {
  const db = useLocalbase();

  const lists = ref<List[]>([]);

  const createList = async (data: string) => {
    await db.collection('listas').add({
      description: data,
    });
  };

  const carregarListas = async () => {
    try {
      lists.value = await db.collection('listas').get({ keys: true });
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
    }
  };

  const getList = async (key: string) => {
    try {
      return await db.collection('listas').doc(key).get();
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
    }
  };

  const removeList = async (key: string) => {
    const items = await db.collection('itemsList').get({ keys: true });
    if (items.length > 0) {
      for (const item of items.filter((item: ListItem) => item.data.listKey === key)) {
        await db.collection('itemsList').doc(item.key).delete();
      }
    }
    await db.collection('listas').doc(key).delete();
  };

  const updateList = async (key: string, data: string) => {
    await db.collection('listas').doc(key).update({ description: data });
  };

  return { createList, carregarListas, getList, lists, removeList, updateList };
});
