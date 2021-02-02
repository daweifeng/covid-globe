import { Service } from 'egg';
import { CSVParser } from '../util/CSVParser';
import Mongo from './Mongo';

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

    return this.ctx.service.mongo.insertManyCSVRows(db, collection, csv.data.slice(1, csv.data.length), csv.header, true);
  }

  public async getCasesByDate(date: Date) {
    const today = new Date();
    const collectionDate = `${today.getUTCMonth() + 1}${today.getUTCDate()}${today.getUTCFullYear()}`;
    const dateStr = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear() - 2000}`;
    const usResponse = await Mongo.client
      .db('covid')
      .collection(`US${collectionDate}`)
      .find()
      .project({ Province_State: 1, Country_Region: 1, Lat: 1, Long_: 1, [dateStr]: 1 })
      .toArray();

    const globalResponse = await Mongo.client
      .db('covid')
      .collection(`GLOBAL${collectionDate}`)
      .find()
      .project({ 'Province/State': 1, 'Country/Region': 1, Lat: 1, Long: 1, [dateStr]: 1 })
      .toArray();

    return { usResponse, globalResponse };
  }
}
