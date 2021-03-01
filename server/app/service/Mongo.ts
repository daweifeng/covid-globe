import { Service, Context } from 'egg';
import { MongoClient } from 'mongodb';

export default class Mongo extends Service {
  static client: MongoClient;

  constructor(ctx: Context) {
    super(ctx);

    if (typeof Mongo.client === 'undefined') {
      Mongo.client = new MongoClient(ctx.app.config.mongoUrl, { useUnifiedTopology: true });
    }
  }

  async init() {
    await Mongo.client.connect();
    console.log('Mongo is connected');
  }

  get isConnected() {
    return Mongo.client.isConnected();
  }

  async isCollectionExist(db: string, collection: string) {
    const index = (await Mongo.client.db(db).listCollections().toArray()).map(c => c.name).indexOf(collection);
    return index !== -1;
  }

  dropCollection(db: string, collection: string) {
    return Mongo.client.db(db).collection(collection).drop();
  }

  // Insert one csv row to collection
  insertCSVRow(db: string, collection: string, row: string[], header: string[]) {
    const doc = {};
    header.forEach((h, i) => {
      doc[h] = row[i];
    });
    const response = Mongo.client.db(db).collection(collection).insertOne(doc);
    return response;
  }

  // Insert many row to collection
  insertManyCSVRows(db: string, collection: string, rows: string[][], header: string[], shouldAddLocation?: boolean) {
    const docs = rows.map(row => {
      const doc = {
        location: {
          type: 'Point',
          coordinates: [] as number[],
        },
      };
      header.forEach((h, i) => {
        if (shouldAddLocation) {
          if (h === 'Long_' || h === 'Long') {
            doc.location.coordinates[0] = parseFloat(row[i]);
          }
          if (h === 'Lat') {
            doc.location.coordinates[1] = parseFloat(row[i]);
          }
        }
        if (row[i] == null) {
          return;
        }
        doc[h] = row[i];
      });
      if (!doc.location.coordinates[0]) {
        return {};
      }
      return doc;
    });

    const response = Mongo.client.db(db).collection(collection).insertMany(docs);

    return response;
  }

  createLocationIndex(db: string, collection: string) {
    return Mongo.client.db(db).collection(collection).createIndex({ location: '2dsphere' });
  }
}
