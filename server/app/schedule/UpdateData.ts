import { Subscription } from 'egg';

export default class UpdateData extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 */24 * * *',
      cronOptions: {
        currentDate: new Date('Fri, 10 Jul 2020 00:00:01 UTC')
      }
    }
  }
}