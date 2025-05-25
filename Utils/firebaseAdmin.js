import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };

try {
  console.log('📦 Firebase Admin: Service account yükleniyor...');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅  Admin başarıyla başlatıldı.');
} catch (error) {
  console.error('❌ Firebase Admin :', error);
}

export default admin;
