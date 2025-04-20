// src/composables/useLocalbase.ts
import Localbase from 'localbase';

let dbInstance: Localbase | null = null;

export function useLocalbase(): Localbase {
  // Singleton pattern: garante que só cria uma instância
  if (!dbInstance) {
    dbInstance = new Localbase('lista-compra');
  }
  return dbInstance;
}
