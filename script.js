document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements we'll be interacting with
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherContainer = document.getElementById('weather-container');
    const forecastContainer = document.getElementById('forecast-container');

    // OpenWeatherMap API key and URLs
    const apiKey = '5b1ba6e93133566a36655c333b5e15d7';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // Event listener for the search button click
    searchButton.addEventListener('click', async () => {
        const city = searchInput.value.trim(); // Get the city name entered by the user
        if (city) { // Check if the city name is not empty
            try {
                // Fetch current weather data for the specified city from the OpenWeatherMap API
                const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
                if (!response.ok) {
                    throw new Error('City not found'); // Throw an error if the city is not found
                }
                const data = await response.json(); // Parse the JSON response
                displayWeatherData(data); // Display the current weather data

                // Fetch forecast data for the specified city from the OpenWeatherMap API
                const forecastResponse = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
                if (!forecastResponse.ok) {
                    throw new Error('Forecast data not available'); // Throw an error if forecast data is not available
                }
                const forecastData = await forecastResponse.json(); // Parse the JSON response
                const forecasts = forecastData.list.filter((item, index) => index % 8 === 0); // Select every 8th forecast item (every 24 hours)
                displayForecast(forecasts); // Display the forecast data
            } catch (error) {
                console.error('Error fetching data:', error.message); // Log any errors to the console
                weatherContainer.innerHTML = `<p>${error.message}</p>`; // Display an error message in the weather container
                forecastContainer.innerHTML = ''; // Clear the forecast container
            }
        } else {
            alert('Please enter a city name'); // Display an alert if the city name is empty
        }
    });

    // Function to display the current weather data
    function displayWeatherData(data) {
        cityName.textContent = data.name; // Set the city name
        temperature.textContent = `Temperature: ${data.main.temp}°C`; // Set the temperature
        humidity.textContent = `Humidity: ${data.main.humidity}%`; // Set the humidity
        windSpeed.textContent = `Wind Speed: ${data.wind.speed} km/h`; // Set the wind speed
        weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`; // Set the weather icon
        weatherContainer.style.display = 'block'; // Display the weather container
    }

    // Function to display the forecast data
    function displayForecast(forecasts) {
        forecastContainer.innerHTML = ''; // Clear the forecast container
        forecasts.forEach(forecast => {
            const forecastItem = document.createElement('div'); // Create a div element for each forecast item
            forecastItem.classList.add('forecast-item'); // Add the forecast-item class
            forecastItem.innerHTML = `
                <h2>${new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</h2>
                <p>Temperature: ${forecast.main.temp}°C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} km/h</p>
                <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">
            `; // Set the content of the forecast item
            forecastContainer.appendChild(forecastItem); // Append the forecast item to the forecast container
        });
    }
});
