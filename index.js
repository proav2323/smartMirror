let userLocation = null;
let userCity = null;
let weather = null;
let isLoading = true;
let weather_code_mapping_image = {
  0: "Unknown",
  1000: "./assets/clear.png",
  1100: "./assets/mostlyClear.png",
  1101: "./assets/mostlyClear.png",
  1102: "./assets/Partly-Cloudy.png",
  1001: "./assets/cloudy.png",
  2000: "./assets/fog.png",
  2100: "./assets/fog.png",
  4000: "./assets/dizzle.png",
  4001: "./assets/rain.png",
  4200: "./assets/rain.png",
  4201: "./assets/heavyRain.png",
  5000: "./assets/snow.png",
  5001: "./assets/flurries.png",
  5100: "./assets/snow.png",
  5101: "./assets/heavySnow.png",
  6000: "./assets/frezzingDribble.png",
  6001: "./assets/frezzingDribble.png",
  6200: "./assets/frezzingDribble.png",
  6201: "./assets/heavyFreezingRain.png",
  7000: "./assets/fr.png",
  7101: "./assets/fr.png",
  7102: "./assets/fr.png",
  8000: "./assets/thunderstorm.png",
};

let weather_code_name = {
  0: "Unknown",
  1000: "Clear",
  1100: "Mostly Clear",
  1101: "Partly Cloudy",
  1102: "Mostly Cloudy",
  1001: "Cloudy",
  2000: "Fog",
  2100: "Light Fog",
  4000: "Drizzle",
  4001: "Rain",
  4200: "Light Rain",
  4201: "Heavy Rain",
  5000: "Snow",
  5001: "Flurries",
  5100: "Light Snow",
  5101: "Heavy Snow",
  6000: "Freezing Drizzle",
  6001: "Freezing Rain",
  6200: "Light Freezing Rain",
  6201: "Heavy Freezing Rain",
  7000: "Ice Pellets",
  7101: "Heavy Ice Pellets",
  7102: "Light Ice Pellets",
  8000: "Thunderstorm",
};

const weatherTem = document.querySelector(".weather-tem");
const time = document.querySelector(".time");
const geoBtn = document.querySelector(".geoBtn");
const dateHtml = document.querySelector(".date");
const weatherImg = document.querySelector(".weatherImage");
const weatherName = document.querySelector(".weatherName");
const sportsContainer = document.querySelector(".sports-container");
const gkContainer = document.querySelector(".gk-container");
const newsSpan = document.querySelectorAll(".news");
const city = document.querySelector(".city");

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
    `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lng}&apikey=${process.env.TOMORROW_API_KEY}`
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
  getWeather(data.values.weatherCodeMax);
}

// get user city
function getLocationInGeo(lat, lng) {
  var request = new XMLHttpRequest();

  request.open(
    "GET",
    `https://api.ipdata.co/?api-key=${process.env.IPDATA_API_KEY}`
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
  city.innerHTML = `${userLocation.city}, ${userLocation.country_name}`;
}

function getWeather(code) {
  weatherName.innerHTML = weather_code_name[code];
  weatherImg.setAttribute("src", weather_code_mapping_image[code]);
}

function getSportsNews() {
  fetch(
    `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&q=sports`
  ).then(async (dat) => {
    if (dat) {
      const data = await dat.json();
      for (let i = 0; i < 2; i++) {
        const span = document.createElement("a");

        span.setAttribute("href", data[i].link);
        span.className = "news";

        sportsContainer.appendChild(span);
      }
      console.log(data);
    }
  });
}

function getNews() {
  fetch(
    `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}`
  ).then(async (dat) => {
    if (dat) {
      const data = await dat.json();
      for (let i = 0; i < 2; i++) {
        const span = document.createElement("a");

        span.setAttribute("href", data[i].link);
        span.className = "news";

        gkContainer.appendChild(span);
      }
    }
  });
}

// getLocation(); // get user locationa nd permisiion
// getSportsNews(); // get sports news
// getNews(); // get general knowledge news
