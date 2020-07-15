import { Application } from 'egg';
// app.js
class AppBootHook {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  async didReady() {
    // Application already ready

    const ctx = await this.app.createAnonymousContext();
    await ctx.service.mongo.init();
  }

}

export default AppBootHook;
