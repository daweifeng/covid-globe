import { Service } from 'egg';
import { CSVParser } from '../util/CSVParser';

export default class Data extends Service {

  dataURLs = {
    us: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
    global: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  }

  public async fetch() {

    // fetch U.S. time series data
    const responseUS = await this.ctx.curl(this.dataURLs.us, {
      dataType: 'text',
    });
    // fetch global time series data
    const responseGolbal = await this.ctx.curl(this.dataURLs.global, {
      dataType: 'text',
    });

    return {
      us: responseUS.data,
      global: responseGolbal.data,
    };
  }

  public store(data: string, db: string, collection: string) {
    const csvParser = new CSVParser();
    const csv = csvParser.parse(data);

    return this.ctx.service.mongo.insertManyCSVRows(db, collection, csv.data.slice(1, csv.data.length), csv.header);

  }
}
