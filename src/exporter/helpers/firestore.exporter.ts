import firebase from 'firebase-admin';
import admin from 'firebase-admin';
import Firestore = admin.firestore.Firestore;

/**
 * Setup a connection with a given key.
 *
 * @param jsonKey
 */
export function setupDbConnection(jsonKey: JsonServiceAccountKey) {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: jsonKey.project_id,
      clientEmail: jsonKey.client_email,
      privateKey: jsonKey.private_key,
    }),
  });
  return firebase.firestore();
}

/**
 * Closes current Firestore connection.
 */
export function closeConnection() {
  firebase
    .app()
    .delete()
    .then(() => 'OK');
}

/**
 * Retrieves documents from given Firestore collection.
 *
 * @param db
 * @param collection
 */
export async function retrieveDocs(db: Firestore, collection: string) {
  const snapshot = await db.collection(collection).get();
  let documents: FirestoreDocuments = {};
  snapshot.forEach((doc) => {
    documents = { ...documents, [doc.id]: doc.data() };
  });

  return documents;
}
