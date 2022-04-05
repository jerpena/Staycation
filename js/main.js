
// Import API Keys
import { foursquareKey, openWeatherKey } from './config.js'

// Foursquare API Info
const url = 'https://api.foursquare.com/v3/places/search?near=';
const options = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        Authorization: foursquareKey
    }
};

// OpenWeather Info
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// HTML Creation
const createPlaceHTML = (name, location, iconSource) => {
    return `<h3>${name}</h3>
        <img class="placeimage" src="${iconSource}"/>
        <h3>Address:</h3>
        <p>${location.address}</p>
        <p>${location.locality}, ${location.region}</p>
        <p>${location.country}</p>`;

}

const createWeatherHTML = (currentDay) => {
    return `<h2>${weekDays[(new Date()).getDay()]}</h2>
		<h2>Temperature: ${kelvinToFahrenheit(currentDay.main.temp)}&deg;F</h2>
		<h2>Condition: ${currentDay.weather[0].description}</h2>
        <img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png" class="weathericon">`;
}

// Convert Kelvin to Fahrenheight
const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);



// Page Elements
const input = document.getElementById('city');
const submit = document.getElementById('button');
const destination = document.getElementById('destination');
const container = document.querySelector('.container');
const placeDivs = [document.getElementById("place1"), document.getElementById("place2"), document.getElementById("place3")];
const weatherDiv = document.getElementById("weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Fetch from APIs
const getPlaces = async () => {
    const city = input.value;
    const urlToFetch = `${url}${city}&limit=10`
    try {
        const response = await fetch(urlToFetch, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            const places = jsonResponse.results
            return places
        }
    } catch (err) {
        console.log(err)
    }
};

const getForecast = async () => {
    const urlToFetch = `${weatherUrl}?q=${input.value}&APPID=${openWeatherKey}`
    try {
        const response = await fetch(urlToFetch)
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        }
    } catch (err) {
        console.log('forecast', err)
    }
};


// Render functions
const renderPlaces = (places) => {
    placeDivs.forEach((location, index) => {
        // Add your code here:
        const place = places[index]
        const placeIcon = place.categories[0].icon
        const placeImgSrc = `${placeIcon.prefix}bg_64${placeIcon.suffix}`
        const placeContent = createPlaceHTML(place.name, place.location, placeImgSrc);
        location.innerHTML = placeContent;
    });
    destination.innerHTML = `<h2>${places[0].location.locality}</h2>`;
};

const renderForecast = (forecast) => {
    const weatherContent = createWeatherHTML(forecast);
    weatherDiv.innerHTML = weatherContent;
};

// Event listeners
submit.addEventListener('click', event => {
    event.preventDefault()
    placeDivs.forEach(place => place.replaceChildren());
    weatherDiv.replaceChildren();
    destination.replaceChildren();
    container.style.visibility = "visible";
    getPlaces()
        .then(places => renderPlaces(places))
    getForecast()
        .then(forecast => renderForecast(forecast))
    return false;
});