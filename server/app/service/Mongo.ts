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
  insertManyCSVRows(db: string, collection: string, rows: string[][], header: string[]) {
    const docs = rows.map(row => {
      const doc = {};
      header.forEach((h, i) => {
        doc[h] = row[i];
      });
      return doc;
    });

    const response = Mongo.client.db(db).collection(collection).insertMany(docs);

    return response;
  }
}
