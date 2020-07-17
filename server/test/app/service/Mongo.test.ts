import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Mongo.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('isConnected True with init', async () => {
    await ctx.service.mongo.init();
    assert(ctx.service.mongo.isConnected);
  });

  it('isConnected True with previous init', async () => {
    assert(ctx.service.mongo.isConnected);
  });

  it('insertCSVRow', async () => {
    const db = 'test';
    const collection = 'student';
    const header = [ 'name', 'school', 'major' ];
    const row = [ 'David', 'UCB', 'EECS' ];

    const response = await ctx.service.mongo.insertCSVRow(db, collection, row, header);
    assert(response.result.ok);
    assert(response.ops[0].name === 'David');
  });

  it('insertManyCSVRows', async () => {
    const db = 'test';
    const collection = 'student';
    const header = [ 'name', 'school', 'major' ];
    const rows = [
      [ 'David', 'UCB', 'EECS' ],
      [ 'Jason', 'UCLA', 'Math' ],
    ];

    const response = await ctx.service.mongo.insertManyCSVRows(db, collection, rows, header);
    assert(response.result.ok);
    assert(response.ops[0].name === 'David');
  });

  it('isCollectionExist', async () => {
    const db = 'test';
    const collection = 'student';

    assert(await ctx.service.mongo.isCollectionExist(db, collection));
  });
});
