import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/cases.test.ts', () => {
  let ctx;
  before(async () => {
    ctx = app.mockContext();
    await ctx.service.mongo.init();
  });

  it('should GET /cases/confirmed', async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getUTCDate() - 2);
    const result = await app.httpRequest().get(`/cases/confirmed?ts=${yesterday.getTime()}`).expect(200);
    assert(result.body.usResponse[0].Country_Region === 'US');
  });
});
