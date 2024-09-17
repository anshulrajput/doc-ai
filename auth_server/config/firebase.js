const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyAueiQSn4oXQiCPzTUkWTGjQDZUI89XK8I",
    authDomain: "doc-ai-c17f2.firebaseapp.com",
    projectId: "doc-ai-c17f2",
    storageBucket: "doc-ai-c17f2.appspot.com",
    messagingSenderId: "131219028924",
    appId: "1:131219028924:web:912a5add000f96cb0909b9"
};

if (process.env.NODE_ENV == "local"){
    const serviceAccount = require(config.service_account);
  
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initializeApp(firebaseConfig);

  }
  else{
    admin.initializeApp();
    initializeApp(firebaseConfig);
}

logging.info('Firebase APP Initialized')

