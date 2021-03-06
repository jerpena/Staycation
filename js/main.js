const foursquareUrl = 'https://node-api-router.herokuapp.com/places?near=';
const weatherUrl = 'https://node-api-router.herokuapp.com/weather';
const input = document.getElementById('city');
const submit = document.getElementById('button');
const destination = document.getElementById('destination');
const container = document.querySelector('.container');
const placeDivs = [document.getElementById("place1"), document.getElementById("place2"), document.getElementById("place3")];
const weatherDiv = document.getElementById("weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);

const getPlaces = async () => {
    const city = input.value;
    const urlToFetch = `${foursquareUrl}${city}`
    try {
        const response = await fetch(urlToFetch);
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
    const urlToFetch = `${weatherUrl}?q=${input.value}`
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


const renderPlaces = (places) => {
    placeDivs.forEach((location, index) => {
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