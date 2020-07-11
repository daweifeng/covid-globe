import { app } from 'egg-mock/bootstrap';

describe('test/app/schedule/UpdateData.test.ts', () => {
  it('schedule', async () => {
    const ctx = app.mockContext();
    await app.ready();
    ctx.service.mongo.init();
    // await app d
    await app.runSchedule('UpdateData');
  });
});
