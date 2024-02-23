import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, push, child, get } from 'firebase/database';

// Inicialize o Firebase com as configurações
const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,                                                    
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

// Obtenha a instância do serviço de autenticação
const auth = getAuth(firebaseApp);

// Obtenha a instância do serviço Firestore
const firestore = getFirestore(firebaseApp);

// Obtenha a instância do serviço Database
const database = getDatabase(firebaseApp);

export { auth, firebaseApp,firestore, database, ref, set, push, child, get };
