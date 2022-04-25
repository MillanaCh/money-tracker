import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCj8p-d1bBYkZ_Mew2aFxzf2m8PsOmTO3M",
  authDomain: "money-manager-1528c.firebaseapp.com",
  projectId: "money-manager-1528c",
  storageBucket: "money-manager-1528c.appspot.com",
  messagingSenderId: "523924916078",
  appId: "1:523924916078:web:4aa5111c66321549f2237f",
};

initializeApp(firebaseConfig);

//Listen data from database-to listen every time when updated call this data
export const listenTransactions = (callback) => {
  const db = getDatabase();
  const starCountRef = ref(db, "transactions");
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    // console.log('updated', data)
    callback(data)
  });
};

//Write data to database
export const createTransaction = (title, amount, type) => {
  const db = getDatabase();
  // const key = Math.floor(Math.random()*100000)
  const key = push(child(ref(db), "transactions")).key;
  set(ref(db, `transactions/${key}`), {
    title,
    amount,
    type,
  });
};
//can store only one transaction
