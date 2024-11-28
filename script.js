document.getElementById('getWeather').addEventListener('click', function() {
    const inputData = document.getElementById('coords').value;
    if (inputData) {
        const coords = inputData.split(' ');
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            fetchWeatherByCoords(lat, lon)
                .then(data => {
                    displayWeather(data);
                    displayMap(lat, lon, 'weatherMap');
                })
                .catch(error => {
                    alert(error);
                });
        } else {
            alert('Please enter valid coordinates');
        }
    } else {
        alert('Please enter coordinates');
    }
});

document.getElementById('addWidget').addEventListener('click', function() {
    const inputData = document.getElementById('coords').value;
    if (inputData) {
        const coords = inputData.split(' ');
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            fetchWeatherByCoords(lat, lon)
                .then(data => {
                    addWidget(data);
                })
                .catch(error => {
                    alert(error);
                });
        } else {
            alert('Please enter valid coordinates');
        }
    } else {
        alert('Please enter coordinates');
    }
});

function fetchWeatherByCoords(lat, lon) {
    const apiKey = '73670e551c1781fd868fc39fbc66f5fc'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    resolve(data);
                } else {
                    reject('Coordinates not found');
                }
            })
            .catch(error => {
                reject('Error fetching weather data');
            });
    });
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Local Time: ${new Date(data.dt * 1000).toLocaleTimeString()}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
    `;
}

function addWidget(data = {}) {
    const widgets = document.getElementById('widgets');
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.innerHTML = `
        <div style="display: flex; justify-content: center;">
            <h2>${data.name || 'City Name'}</h2>
            <img src="${data.weather ? `http://openweathermap.org/img/wn/${data.weather[0].icon}.png` : ''}" alt="Weather icon">
        </div>
        <p>Temperature: ${data.main?.temp || 'N/A'}°C</p>
        <p>Weather: ${data.weather?.[0].description || 'N/A'}</p>
        <p>Wind Speed: ${data.wind?.speed || 'N/A'} m/s</p>
        <p>Local Time: ${data.dt ? new Date(data.dt * 1000).toLocaleTimeString() : 'N/A'}</p>
        <div class="map" id="map-${data.id}"></div>
        <button class="removeWidget">Remove Widget</button>
    `;
    widgets.appendChild(widget);

    widget.querySelector('.removeWidget').addEventListener('click', function() {
        widgets.removeChild(widget);
    });

    displayMap(data.coord.lat, data.coord.lon, `map-${data.id}`);
}

function displayMap(lat, lon, elementId) {
    const map = document.getElementById(elementId);
    map.innerHTML = `<iframe width="100%" height="100%" src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed"></iframe>`;
}