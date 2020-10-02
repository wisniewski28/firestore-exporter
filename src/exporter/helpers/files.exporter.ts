import ObjectsToCsv from 'objects-to-csv';
import fs from 'fs';
import { exec, spawn } from 'child_process';
import { log } from 'util';

const TEMP_PATH = './storage/temp/';

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
    let filePath = TEMP_PATH + fileName;
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

export async function prepareJson(data: FirestoreCollections, collections: []) {
  let files = [];
  for (let collection of collections) {
    let file = JSON.stringify(data[collection]);
    let fileName = collection + '.json';
    let filePath = TEMP_PATH + fileName;
    await fs.writeFileSync(filePath, file);
    files.push({
      path: filePath,
      name: fileName,
    });
  }

  return files;
}

export function removeTempFiles() {
  // let rm = exec('rm ' + TEMP_PATH + '*');
}
