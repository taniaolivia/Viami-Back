const firebasePrivateKey = 
  process.env.FIREBASE_PRIVATE_KEY_1 
  + process.env.FIREBASE_PRIVATE_KEY_2 
  + process.env.FIREBASE_PRIVATE_KEY_3 
  + process.env.FIREBASE_PRIVATE_KEY_4 
  + process.env.FIREBASE_PRIVATE_KEY_5
  + process.env.FIREBASE_PRIVATE_KEY_6 
  + process.env.FIREBASE_PRIVATE_KEY_7 
  + process.env.FIREBASE_PRIVATE_KEY_8 
  + process.env.FIREBASE_PRIVATE_KEY_9;
  
const encodedFirebasePrivateKey = Buffer.from(firebasePrivateKey, 'base64').toString('utf-8');

/*module.exports = {
  firebase: {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN,
    "private_key": encodedFirebasePrivateKey,
  }
}*/

module.exports = {
  firebase: {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN,
    "private_key": encodedFirebasePrivateKey,
  }
}
