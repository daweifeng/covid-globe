<h1 align="center">COVID Globe</h1>
<p align="center">Visualize COVID-19 cases on a virtual globe</p>
<p align="center">Demo: <a href="https://covid-globe.dawei.io">covid-globe.dawei.io</a></p>
<div align="center">
  <img src="https://daweifeng.s3-us-west-2.amazonaws.com/public/app_images/covid-globe-1.png"/>
</div>

## Data

The time series Data is auto collected every day(UTC) from 

<a href="https://github.com/CSSEGISandData/COVID-19">COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University</a>

Collected data is stored on my own MongoDB cluster.

## API

Collected data can be accessed through the covid-globe backend api

Endpoint: https://covid-server.dawei.io/cases/confirmed

### Request

````
GET https://covid-server.dawei.io/cases/confirmed?ts={timestamp}

timestamp: the UTC timestamp of the date
````
### Response

```json
{
  "usResponse":[
    { 
      "_id": "5f123b812c72e9002e2db473",
      "Province_State": "American Samoa",
      "Country_Region": "US",
      "Lat": "-14.271",
      "Long_": "-170.132",
      // Specific date from request
      "7/16/20": "0" 
    },
    ...
  ],
  "globalResponse": [
    {
      "_id": "5f123b872c72e9002e2dc131",
      "Province/State": "",
      "Country/Region": "Afghanistan",
      "Lat": "33.93911",
      "Long": "67.709953",
      // Specific date from request
      "7/16/20": "35070"
    },
    ...
  ]
}
```
