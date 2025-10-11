// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDWuSfwxarSx0k2tpIFCFQ2gNsr-_aop7Y",
    authDomain: "hackathonmvpv2.firebaseapp.com",
    databaseURL: "https://hackathonmvpv2-default-rtdb.firebaseio.com",
    projectId: "hackathonmvpv2",
    storageBucket: "hackathonmvpv2.firebasestorage.app",
    messagingSenderId: "577408051450",
    appId: "1:577408051450:web:c4f45c1334da0473294143",
    measurementId: "G-0C94FRQ323"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
