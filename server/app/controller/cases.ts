import { Controller } from 'egg';

export default class CasesController extends Controller {
  public async confirmed() {
    const { ctx } = this;
    ctx.body = "confirmed caess route"
  }
}
