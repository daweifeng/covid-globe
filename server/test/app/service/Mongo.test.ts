import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Mongo.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('isConnected False without init', async () => {
    assert(!ctx.service.mongo.isConnected);
  });

  it('isConnected True with init', async () => {
    await ctx.service.mongo.init();
    assert(ctx.service.mongo.isConnected);
  });

  it('isConnected True with previous init', async () => {
    assert(ctx.service.mongo.isConnected);
  });

});
