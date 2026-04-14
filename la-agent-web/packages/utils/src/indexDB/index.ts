type I18nMessages = Record<string, string>; // 每个语言的资源文件
type I18nResource = {
  locale: string;
  messages: I18nMessages;
};
function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('i18nDB', 1);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('resources')) {
        db.createObjectStore('resources', { keyPath: 'locale' });
      }
    };

    request.onsuccess = event => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = event => reject((event.target as IDBOpenDBRequest).error);
  });
}

export async function storeResources(locale: string, messages: I18nMessages): Promise<void> {
  const db = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('resources', 'readwrite');
    const store = transaction.objectStore('resources');
    const request = store.put({ locale, messages });

    request.onsuccess = () => resolve();
    request.onerror = event => reject((event.target as IDBRequest).error);
  });
}
export async function getResources(locale: string): Promise<I18nMessages | null> {
  const db = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('resources', 'readonly');
    const store = transaction.objectStore('resources');
    const request = store.get(locale);

    request.onsuccess = () => {
      const result = request.result as I18nResource | undefined;
      resolve(result ? result.messages : null);
    };
    request.onerror = event => reject((event.target as IDBRequest).error);
  });
}
