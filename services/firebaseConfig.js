import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD5TMDZphGVShco1wJEPm4ahNUpF9uDV1w",
    authDomain: "list-buy.firebaseapp.com",
    projectId: "list-buy",
    storageBucket: "list-buy.appspot.com",
    messagingSenderId: "616295362932",
    appId: "1:616295362932:web:527394471dd0f6379f7c21"
};

const firebaseApp = initializeApp(firebaseConfig);

const firestoreConn = getFirestore(firebaseApp);

export default firestoreConn;