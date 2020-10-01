import ObjectsToCsv from 'objects-to-csv';

/**
 * Parses collection documents to CSV file.
 *
 * @param collectionData
 */
export function parseToCsv(collectionData: FirestoreDocuments) {
  let rows = [];
  for (let key in collectionData) {
    if (collectionData.hasOwnProperty(key)) {
      let row = { documentId: key, ...collectionData[key] };
      rows.push(row);
    }
  }
  return new ObjectsToCsv(rows);
}

export async function prepareCsv(data: FirestoreCollections, collections: []) {
  let files = [];
  for (let collection of collections) {
    let file = parseToCsv(data[collection]);
    let fileName = collection + '.csv';
    let filePath = './storage/temp/' + fileName;
    await file.toDisk(filePath, {
      append: true,
    });
    files.push({
      path: filePath,
      name: fileName,
    });
  }

  return files;
}
