import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Data.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
    await ctx.service.mongo.init();
  });

  it('fetch', async () => {
    const data = await ctx.service.data.fetch();
    assert(typeof data.us === 'string');
    assert(typeof data.global === 'string');
  });

  it('store', async () => {
    const data = 'name,school\nKevin,UCB';
    const db = 'test';
    const collection = 'student';
    const response = await ctx.service.data.store(data, db, collection);

    assert(response.result.ok);
    assert(response.ops[0].name === 'Kevin');
  });
});
