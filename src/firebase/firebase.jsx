import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  child,
  remove,
  update,
} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSkb_775rI1Qa9vK4jLbgIB7zrZEnGoBo",
  authDomain: "money-manager-3605a.firebaseapp.com",
  projectId: "money-manager-3605a",
  storageBucket: "money-manager-3605a.appspot.com",
  messagingSenderId: "692125762619",
  appId: "1:692125762619:web:4914c9fd07b1a42fad481e",
};

initializeApp(firebaseConfig);

//Listen data from database-to listen every time when updated call this data
export const listenTransit = (callback) => {
  const db = getDatabase();
  const starCountRef = ref(db, "transit");
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

//Write data to database
export const createTransit = (title, amount, type) => {
  const db = getDatabase();
  // const key = Math.floor(Math.random()*100000)
  const key = push(child(ref(db), "transit")).key;
  set(ref(db, `transit/${key}`), {
    title,
    amount,
    type,
  });
};

//  deleting from firebase
export const deleteTransit = (key) => {
  //which trans want to delete
  const db = getDatabase();
  remove(ref(db, `transit/${key}`));
};

// update transaction
export const updateTransit = (uid, title, amount, type) => {
  const db = getDatabase();
  let updates = {};
  updates["/transit/" + uid] = {
    title,
    amount,
    type,
  };
  update(ref(db), updates);
};
export const userId = () => {
  const auth = getAuth();
  return auth
}

// Auth part
// create
export const createFirebaseUser = (email, password) => {
  const auth = getAuth();
  console.log("auth",auth)
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log("user", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
};
// sign in
export const signInFirebaseUser = (email, password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

};

//can store only one transaction one document
