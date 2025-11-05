const admin = require('firebase-admin');
const serviceAccount = require('./studio-7722364471-1125e-firebase-adminsdk-fbsvc-09431daae3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2]; // e.g. IS0H9adbfjW8sv9MfhxiA2JAVWi2

if (!uid) {
  console.error('❌ Please provide a user UID: node scripts/setAdminClaim.js <uid>');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Custom claim 'admin: true' set for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error setting custom claim:', error);
    process.exit(1);
  });
