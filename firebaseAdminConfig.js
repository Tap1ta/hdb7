// firebaseAdminConfig.js
import admin from 'firebase-admin';
import serviceAccount from '/home/wolfteamsex1/hdb4-88d11-firebase-adminsdk-6eknv-e7f5f1ad39.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hdb4-88d11-default-rtdb.firebaseio.com/' // URL de tu base de datos Firebase
});

const firestore = admin.firestore();

export default firestore;
