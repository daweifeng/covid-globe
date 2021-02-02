import { Subscription } from 'egg';

export default class UpdateData extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 */24 * * *',
      cronOptions: {
        currentDate: new Date('Fri, 10 Jul 2020 00:00:01 UTC'),
      },
      type: 'worker',
    };
  }

  async subscribe() {
    const { mongo } = this.ctx.service;
    const data = await this.ctx.service.data.fetch();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateStr = `${today.getUTCMonth() + 1}${today.getUTCDate()}${today.getUTCFullYear()}`;
    console.log(dateStr);
    const preDateStr = `${yesterday.getUTCMonth() + 1}${yesterday.getUTCDate()}${yesterday.getUTCFullYear()}`;

    if (!await mongo.isCollectionExist('covid', `US${dateStr}`)) {
      const responseUS = await this.ctx.service.data.store(data.us, 'covid', `US${dateStr}`);
      if (responseUS.result.ok && await mongo.isCollectionExist('covid', `US${preDateStr}`)) {
        // drop previous collection
        await mongo.dropCollection('covid', `US${preDateStr}`);
      }
    }
    if (!await mongo.isCollectionExist('covid', `GLOBAL${dateStr}`)) {
      const responseGlobal = await this.ctx.service.data.store(data.global, 'covid', `GLOBAL${dateStr}`);
      if (responseGlobal.result.ok && await mongo.isCollectionExist('covid', `GLOBAL${preDateStr}`)) {
        // drop previous collection
        await mongo.dropCollection('covid', `GLOBAL${preDateStr}`);
      }
    }
  }
}
