import { config } from 'dotenv';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

config();

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594101964992_5833';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // mongodb config
  const mongoConfig = {
    mongoUrl: process.env.MONGODB_URL || '',
  };

  // cors
  const cors = {
    origin: '*',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
    ...mongoConfig,
    cors,
  };
};
