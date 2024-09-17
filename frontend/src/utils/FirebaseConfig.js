import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAueiQSn4oXQiCPzTUkWTGjQDZUI89XK8I",
    authDomain: "doc-ai-c17f2.firebaseapp.com",
    projectId: "doc-ai-c17f2",
    storageBucket: "doc-ai-c17f2.appspot.com",
    messagingSenderId: "131219028924",
    appId: "1:131219028924:web:912a5add000f96cb0909b9"
};

export const app = initializeApp(firebaseConfig);