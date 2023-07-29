import { dummyTasks } from "./data";

export function saveToIndexedDB() {
    const dbPromise = indexedDB.open('TaskDB', 1);
  
    dbPromise.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('date', 'date', { unique: false });
      objectStore.createIndex('startTime', 'startTime', { unique: false });
    };
  
    dbPromise.onsuccess = (event) => {
      const db = event.target.result;
  
      if (db.objectStoreNames.contains('tasks')) {
        const transaction = db.transaction('tasks', 'readwrite');
        const objectStore = transaction.objectStore('tasks');
  
        dummyTasks.forEach((task) => {
          objectStore.add(task);
        });
  
        transaction.oncomplete = () => {
          db.close();
          console.log('Dummy tasks have been saved in IndexedDB.');
        };
      } else {
        console.log("Object store 'tasks' not found. Please check the onupgradeneeded event.");
      }
    };
  
    dbPromise.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
    };
  }

export async function getDataFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const dbPromise = indexedDB.open('TaskDB', 1);

    dbPromise.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readonly');
      const objectStore = transaction.objectStore('tasks');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const tasks = event.target.result;
        db.close();
        resolve(tasks);
      };

      request.onerror = (event) => {
        db.close();
        reject(event);
      };
    };

    dbPromise.onerror = (event) => {
      reject(event);
    };
  });
}

  