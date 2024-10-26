import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAX-0G8BJ6n6ekzj1wM8ETeb_Tw6Ku-JcI",
  authDomain: "social-network-d428b.firebaseapp.com",
  projectId: "social-network-d428b",
  storageBucket: "social-network-d428b.appspot.com",
  messagingSenderId: "220583753891",
  appId: "1:220583753891:web:081fe94adf518809f3e716",
  measurementId: "G-Y9GKXNDRPW"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp)
export { firebaseApp, storage };