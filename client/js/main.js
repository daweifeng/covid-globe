// Default color
const SEVERE = 1;
const DANGER = 26;
const MODERATE = 50;
const MILE = 70;
const LOW = 80;

const setDatePicker = (date) => {
  const datePicker = document.querySelector('#chosen-date');
  datePicker.valueAsDate = date
  datePicker.max=datePicker.value
}

const setColorInfo = () => {
  const badDiv = document.querySelector(".BAD");
  const severeDiv = document.querySelector('.SEVERE');
  const dangerDiv = document.querySelector('.DANGER');
  const moderateDiv = document.querySelector('.MODERATE');
  const mileDiv = document.querySelector('.MILE');
  const lowDiv = document.querySelector('.LOW');

  badDiv.style.backgroundColor = `hsl(${SEVERE},100%,20%)`;
  severeDiv.style.backgroundColor = `hsl(${SEVERE},100%,50%)`;
  dangerDiv.style.backgroundColor = `hsl(${DANGER},100%,50%)`;
  moderateDiv.style.backgroundColor = `hsl(${MODERATE},100%,50%)`;
  mileDiv.style.backgroundColor = `hsl(${MILE},100%,50%)`;
  lowDiv.style.backgroundColor = `hsl(${LOW},100%,80%)`;
}


const colorFunc = (x) => {
  const c = new THREE.Color();
  x = x / 0.000001;

  switch (true) {

    case x>1000000:
      c.setHSL( SEVERE/360, 1, 0.2)
    break;

    case x>500000:
      c.setHSL( SEVERE/360, 1, 0.5)
      break;

    case x> 100000:
      c.setHSL( DANGER/360, 1, 0.5)
      break;

    case x>10000:
      c.setHSL( MODERATE/360, 1, 0.5)
      break;

    case x>1000:
      c.setHSL(MILE/360, 1, 0.5)
      break;

    default:
      // c.setHSL()
      c.setHSL( LOW/360, 1, 0.8)
      break;
  }
  // The more cases, the darken it is going to be
  return c
}

const processData = (dataObjArr, date, isUS) => {
  let data = [];
  const dateStr = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear() - 2000}`;

  dataObjArr.forEach(obj => {
    if (obj[dateStr] === '0') {
      return;
    }
    const lat = obj['Lat'];
    const long = isUS ? obj['Long_'] : obj['Long'];
    const confimedCases = obj[dateStr]
    data = data.concat([parseFloat(lat), parseFloat(long), confimedCases*0.000001])
  })
  return data
}

const onDateChange = () => {
  const chosenDate = document.querySelector('#chosen-date');
  const date = new Date(chosenDate.value);

  debouncedFetchDataAndRender(date)
}

const fetchDataAndRender = (date) => {
  fetch(`https://covid-server.dawei.io/cases/confirmed?ts=${date.getTime()}`)
  .then(response => response.json())
  .then(data => {
    const { usResponse, globalResponse } = data
    // console.log(data)
    // Add data to globe
    const usData = processData(usResponse, date, true)
    const globalData = processData(globalResponse, date, false);
    const combinedData = [date.toUTCString(), [...usData, ...globalData]];

    globe.removeAllData();
    globe.addData( combinedData[1], {format: 'magnitude', name: combinedData[0]} );

    // Create the geometry
    globe.createPoints();
    // Begin animation
    globe.animate();
  })
}

const debounce = (func, wait) => {
  let timeoutId = null
  return function(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    const originalThis = this;
    timeoutId = setTimeout(() => {
      func.apply(originalThis, [...args])
    }, wait);
  }
}

const debouncedFetchDataAndRender = debounce(fetchDataAndRender, 500);


const container = document.querySelector("#globe-container");
const opts = {
  imgDir: './',
  animated: true,
  colorFn: colorFunc
}
const globe = new DAT.Globe(container, opts)

const date = new Date("2023-03-09");

// Init date picker
setDatePicker(date);

// Fetch data from server and render globe
fetchDataAndRender(date);

setColorInfo();
