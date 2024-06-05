let userLocation = null;
let userCity = null;
let weather = null;
let isLoading = true;

const weatherTem = document.querySelector(".weather-tem");
const time = document.querySelector(".time");
const geoBtn = document.querySelector(".geoBtn");
const dateHtml = document.querySelector(".date");

const date = new Date(); // date for time

// time
time.innerHTML = `${
  date.getHours() <= 9 ? "0" + date.getHours() : date.getHours()
}:${date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes()} ${
  date.getHours() >= 12 ? "PM" : "AM"
}`;

dateHtml.innerHTML = date.toLocaleString("en-US", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

// time
setInterval(() => {
  const date = new Date(); // date for time
  time.innerHTML = `${
    date.getHours() <= 9 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes()} ${
    date.getHours() >= 12 ? "PM" : "AM"
  }`;
}, 1000);

// location permisiion
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, {
      enableHighAccuracy: true,
    });
  } else {
    console.log("goeLocation not supported by browser");
  }
}

// permisiion denied
function report(state) {
  console.log(`Permission ${state}`);
}

// revelei locaction
function revealPosition(pos) {
  userLocation = pos;
  var x = pos.coords.latitude;
  var y = pos.coords.longitude;
  console.log("this is running");
  displayLocation(x, y);
  getLocationInGeo(x, y);
}

// permisiion denied
function positionDenied() {
  console.log("Unable to retrieve your location.");
  userLocation = null;
}

// get weather
async function displayLocation(lat, lng) {
  fetch(
    `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lng}&apikey=CPG0QdKDgUOZIC6kgwsfi0ojvrsR2DJe`
  )
    .then(async (dataa) => {
      if (dataa) {
        const data = await dataa.json();
        const todayDate = new Date();
        let dayData = null;
        console.log(data);
        for (let i = 0; i < data.timelines.daily.length; i++) {
          const date = new Date(data.timelines.daily[i].time);
          if (date.getDate() === todayDate.getDate()) {
            dayData = data.timelines.daily[i];
            break;
          }
        }
        changeWeather(dayData);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// chnage wather
function changeWeather(data) {
  weather = data;
  weatherTem.innerHTML = data.values.temperatureAvg;
}

// get user city
function getLocationInGeo(lat, lng) {
  var request = new XMLHttpRequest();

  request.open(
    "GET",
    "https://api.ipdata.co/?api-key=3243b9adeaabcf0ffd2b457ab5cd9036a7241ab059f291e1653f10eb"
  );

  request.setRequestHeader("Accept", "application/json");

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      chnageLocation(this.responseText);
    }
  };

  request.send();
}

// chnage location
function chnageLocation(data) {
  userLocation = JSON.parse(data);
}

// getLocation(); // get user locationa nd permisiion
