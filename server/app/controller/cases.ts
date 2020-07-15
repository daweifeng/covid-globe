import { Controller } from 'egg';

export default class CasesController extends Controller {
  public async confirmed() {
    const { ctx } = this;
    const { ts } = ctx.query;
    const date = new Date(parseInt(ts));

    const res = await ctx.service.data.getCasesByDate(date);

    ctx.body = res;
  }
}
