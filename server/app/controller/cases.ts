import { Controller } from 'egg';

export default class CasesController extends Controller {
  public async confirmed() {
    const { ctx } = this;
    const { ts } = ctx.query;
    const date = new Date(parseInt(ts));

    const res = await ctx.service.data.getCasesByDate(date);

    ctx.body = res;
  }

  public async confirmedCasesBylocation() {
    const { ctx } = this;
    const { lat, long, ts } = ctx.query;
    const res = await ctx.service.data.getDailyCasesByLocation(parseFloat(lat), parseFloat(long), new Date(parseInt(ts)));

    ctx.body = res;
  }
}
