interface JsonServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface FirestoreDocuments {
  [id: string]: object;
}

interface FirestoreCollections {
  [collection: string]: FirestoreDocuments;
}

interface ExporterTempFile {
  path: string;
  name: string;
}
