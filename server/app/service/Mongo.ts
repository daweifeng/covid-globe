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
}
