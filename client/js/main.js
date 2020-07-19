// Default color
const SEVERE = 1;
const DANGER = 26;
const MODERATE = 50;
const MILE = 70;
const LOW = 80;
const setDateSpan = (date) => {
  const dateSpan = document.querySelector('#date-show');
  dateSpan.textContent = date.toUTCString();
}

const setDatePicker = (date) => {
  const datePicker = document.querySelector('#chosen-date');
  datePicker.valueAsDate = date
  datePicker.max=datePicker.value
}

const setColorInfo = () => {
  const severeDiv = document.querySelector('.SEVERE');
  const dangerDiv = document.querySelector('.DANGER');
  const moderateDiv = document.querySelector('.MODERATE');
  const mileDiv = document.querySelector('.MILE');
  const lowDiv = document.querySelector('.LOW');
  severeDiv.style.backgroundColor = `hsl(${SEVERE},100%,50%)`;
  dangerDiv.style.backgroundColor = `hsl(${DANGER},100%,50%)`;
  moderateDiv.style.backgroundColor = `hsl(${MODERATE},100%,50%)`;
  mileDiv.style.backgroundColor = `hsl(${MILE},100%,50%)`;
  lowDiv.style.backgroundColor = `hsl(${LOW},100%,80%)`;
}


const colorFunc = (x) => {
  const c = new THREE.Color();
  x = x * 200000
  // console.log(x)

  switch (true) {
    
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
    const lat = obj['Lat'];
    const long = isUS ? obj['Long_'] : obj['Long'];
    const confimedCases = obj[dateStr]
    data = data.concat([parseFloat(lat), parseFloat(long), confimedCases*0.000005])
  })
  return data
}

const onRenderClick = () => {
  const chosenDate = document.querySelector('#chosen-date');
  const date = new Date(chosenDate.value);

  setDateSpan(date);
  fetchDataAndRender(date)
}

const fetchDataAndRender = (date) => {
  const container = document.querySelector("#container");
  const opts = {
    imgDir: './',
    colorFn: colorFunc
  }
  const globe = new DAT.Globe(container, opts)
  
  fetch(`https://covid-server.dawei.io/cases/confirmed?ts=${date.getTime()}`)
  .then(response => response.json())
  .then(data => {
    const { usResponse, globalResponse } = data
    // console.log(data)
    // Add data to globe
    const usData = processData(usResponse, date, true)
    const globalData = processData(globalResponse, date, false);
    const combinedData = [date.toUTCString(), [...usData, ...globalData]];
    
    globe.addData( combinedData[1], {format: 'magnitude', name: combinedData[0]} );
    
    // Create the geometry
    globe.createPoints();
    // Begin animation
    globe.animate();
  })
}

const today = new Date();
const date = new Date(today);
date.setUTCDate(date.getUTCDate() - 2);

// Set date span
setDateSpan(date);

// Init date picker
setDatePicker(date);

// Fetch data from server and render globe
fetchDataAndRender(date);

setColorInfo();
