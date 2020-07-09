import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Data.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('fetch', async () => {
    const data = await ctx.service.data.fetch();
    assert(typeof data.us === 'string');
    assert(typeof data.global === 'string');
  });
});
