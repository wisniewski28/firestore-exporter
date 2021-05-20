import { JsonServiceAccountKey } from 'app/exporter/commons/interfaces/json-service-account-key.interface';
import { CollectionsDto } from 'app/exporter/dtos/collections.dto';
import { ValidatedRequest } from 'app/exporter/requests/validated.request';
import { Request } from 'express';
import * as firebase from 'firebase-admin';

export const checkConfiguration = async (serviceAccountJsonKey: JsonServiceAccountKey): Promise<void> => {
  try {
    const db = setupDbConnection(serviceAccountJsonKey);
    await db.listCollections();
    await closeConnection();
  } catch (error) {
    throw new Error(error);
  }
};

export const getCollectionsList = async (
  req: Request,
): Promise<FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>[]> => {
  const db = setupDbConnection(req.session?.serviceAccountJsonKey);
  const listCollections = await db.listCollections();
  await closeConnection();

  return listCollections;
};

export const getCollectionsData = async (
  req: ValidatedRequest<CollectionsDto>,
): Promise<FirebaseFirestore.DocumentData[string]> => {
  const db = setupDbConnection(req.session?.serviceAccountJsonKey);
  const listCollections = await db.listCollections();

  req.validated.collections;

  const data: FirebaseFirestore.DocumentData[string] = [];
  // if (typeof req.validated.collections === 'string') {
  //   const snapshot = await db.collection(req.validated.collections).get();
  //   data[req.validated.collections] = snapshot.docs.map((doc) => doc.data());
  // } else {
  if (req.validated.collections) {
    for (const collection of req.validated.collections) {
      const snapshot = await db.collection(collection).get();
      data[collection] = snapshot.docs.map((doc) => doc.data());
    }
    // }
  }

  await closeConnection();

  return data;
};

const setupDbConnection = (jsonKey: JsonServiceAccountKey) => {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: jsonKey.project_id,
      clientEmail: jsonKey.client_email,
      privateKey: jsonKey.private_key,
    }),
  });
  return firebase.firestore();
};

const closeConnection = () =>
  firebase
    .app()
    .delete()
    .then(() => 'OK');
