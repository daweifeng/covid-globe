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

  async insertCSVRow(db: string, collection: string, row: string[], header: string[]) {
    const doc = {};
    header.forEach((h, i) => {
      doc[h] = row[i];
    });
    const response = await Mongo.client.db(db).collection(collection).insertOne(doc);
    return response;
  }
}
