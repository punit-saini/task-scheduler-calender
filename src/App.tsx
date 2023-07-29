import React, { useEffect, useState } from 'react';
import { saveToIndexedDB, getDataFromIndexedDB } from './dataHandling';
import './App.css';
import AddTaskForm from './components/AddTaskForm';
import WeekView from './components/WeekView';

function App() {

  const [showMessage, setShowMessage ] = useState(false)
  const [data, setData] = useState([]);

  function messageShower(){
     setShowMessage(true)
    setInterval(()=>{
          setShowMessage(false)
    }, 5000)
  }
  useEffect(() => {
    const dbName = 'TaskDB';

    const checkIfDatabaseExists = () => {
      return new Promise<boolean>((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if(db.objectStoreNames?.length===0){
            console.log('it is zero')
            messageShower()
             db.close(); 
             indexedDB.deleteDatabase('TaskDB');
            resolve(false)
          }
          db.close(); 
          console.log(db)
          resolve(true); 
        };

        request.onerror = (event) => {
          resolve(false); // Database does not exist
        };
      });
    };

    const checkDataAndHandle = async () => {
      try {
        const databaseExists = await checkIfDatabaseExists();

        if (databaseExists) {
          console.log('Database already exists, skipping save...');
        } else {
          console.log('hereeeee')
          saveToIndexedDB();
        }

        getDataFromIndexedDB().then((tasks)=>{
           setData(tasks)
        })
      } catch (error) {
        console.error('Error while checking or handling data in IndexedDB:', error);
      }
    };

    checkDataAndHandle();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      { showMessage && <div className="fixed top-8 inset-x-0 flex justify-center w-5/6 mx-auto bg-gray-800 text-white py-4 px-8 rounded-lg shadow-lg animate-fade-in">
        <svg className="animate-spin h-10 w-10 text-white mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 01-8 8v-4c2.206 0 4.2-.897 5.656-2.344l2.344 2.344zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"></path>
        </svg>
        <p>New browser detected! 🤨 Adding dummy data to IndexedDB of your browser.</p>
      </div>}



      <WeekView sampleData={data} />
        {/* <AddTaskForm /> */}
      </header>
    </div>
  );
}

export default App;
