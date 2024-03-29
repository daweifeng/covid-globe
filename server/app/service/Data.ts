import { Service } from 'egg';
import { CSVParser } from '../util/CSVParser';
import Mongo from './Mongo';

export default class Data extends Service {
  dataURLs = {
    us: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
    global:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  };

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

  public store(
    data: string,
    db: string,
    collection: string,
    shouldAddLocation?: boolean,
  ) {
    const csvParser = new CSVParser();
    const csv = csvParser.parse(data);

    return this.ctx.service.mongo.insertManyCSVRows(
      db,
      collection,
      csv.data.slice(1, csv.data.length),
      csv.header,
      shouldAddLocation,
    );
  }

  public async getCasesByDate(date: Date) {
    const collectionDate = '7142023';
    const dateStr = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${
      date.getUTCFullYear() - 2000
    }`;
    const usResponse = await Mongo.client
      .db('covid')
      .collection(`US${collectionDate}`)
      .find()
      .project({
        Province_State: 1,
        Country_Region: 1,
        Lat: 1,
        Long_: 1,
        [dateStr]: 1,
      })
      .toArray();

    const globalResponse = await Mongo.client
      .db('covid')
      .collection(`GLOBAL${collectionDate}`)
      .find()
      .project({
        'Province/State': 1,
        'Country/Region': 1,
        Lat: 1,
        Long: 1,
        [dateStr]: 1,
      })
      .toArray();

    return { usResponse, globalResponse };
  }

  public async getDailyCasesByLocation(lat: number, long: number, date: Date) {
    const today = new Date();
    const theDayBefore = new Date(date);
    theDayBefore.setDate(date.getDate() - 1);
    const collectionDate = `${
      today.getUTCMonth() + 1
    }${today.getUTCDate()}${today.getUTCFullYear()}`;
    const dateStr = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${
      date.getUTCFullYear() - 2000
    }`;
    const preDateStr = `${
      theDayBefore.getUTCMonth() + 1
    }/${theDayBefore.getUTCDate()}/${theDayBefore.getUTCFullYear() - 2000}`;

    // TODO: Check the country of the location
    // If it is not US, display the country data
    const usResponse = await Mongo.client
      .db('covid')
      .collection(`US${collectionDate}`)
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [ long, lat ],
            },
            $maxDistance: 50000, // 50km
          },
        },
      })
      .project({
        Admin2: 1,
        Province_State: 1,
        Country_Region: 1,
        Combined_Key: 1,
        Lat: 1,
        Long_: 1,
        [dateStr]: 1,
        [preDateStr]: 1,
      })
      .toArray();
    return usResponse;
  }

  public async getSevenDayCases(lat: number, long: number, date: Date) {
    const today = new Date();
    const collectionDate = `${
      today.getUTCMonth() + 1
    }${today.getUTCDate()}${today.getUTCFullYear()}`;
    const dataProjection = {
      Admin2: 1,
      Province_State: 1,
      Country_Region: 1,
      Combined_Key: 1,
      Lat: 1,
      Long_: 1,
    };
    // TODO: When date col not exists, find the latest day
    for (let day = 0; day < 7; day++) {
      const theDay = new Date(date);
      theDay.setDate(date.getDate() - day);
      const theDayStr = `${theDay.getUTCMonth() + 1}/${theDay.getUTCDate()}/${
        theDay.getUTCFullYear() - 2000
      }`;
      dataProjection[theDayStr] = 1;
    }

    // TODO: Check the country of the location
    // If it is not US, display the country data

    // TODO: Cross reference FCC's county data
    const usResponse = await Mongo.client
      .db('covid')
      .collection(`US${collectionDate}`)
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [ long, lat ],
            },
            $maxDistance: 50000, // 50km
          },
        },
      })
      .project(dataProjection)
      .toArray();
    return usResponse;
  }
}
