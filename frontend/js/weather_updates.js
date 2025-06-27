const WEATHER_API_KEY = "6523e19a05e54c6d97334330251706";

// Function to fetch weather data from WeatherAPI
async function fetchWeather(lat, lon) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    document.getElementById("weatherContainer").innerHTML = `<p style="color:red">Weather data unavailable.</p>`;
  }
}

// Function to display the weather on the page
function displayWeather(data) {
  const weatherContainer = document.getElementById("weatherContainer");
  const { name, region, country, lat, lon } = data.location;
  const { temp_c, condition, wind_kph, humidity, feelslike_c } = data.current;

  weatherContainer.innerHTML = `
    <h2>🌦️ Weather Updates</h2>
    <p><strong>Location:</strong> ${name}, ${region}, ${country}</p>
    <p><strong>Temperature:</strong> ${temp_c}°C (Feels like: ${feelslike_c}°C)</p>
    <p><strong>Condition:</strong> ${condition.text}</p>
    <img src="${condition.icon}" alt="Weather Icon" />
    <p><strong>Wind:</strong> ${wind_kph} kph</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Latitude:</strong> ${lat}, <strong>Longitude:</strong> ${lon}</p>
  `;
}

// Check localStorage for stored coordinates
const storedLocation = JSON.parse(localStorage.getItem("farmer_location"));

if (storedLocation) {
  fetchWeather(storedLocation.lat, storedLocation.lon);
} else {
  // Ask for browser geolocation if not stored
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        localStorage.setItem("farmer_location", JSON.stringify(coords));
        fetchWeather(coords.lat, coords.lon);
      },
      (error) => {
        console.error("Location access denied:", error);
        document.getElementById("weatherContainer").innerHTML =
          "<p>Please enable location services to view weather updates.</p>";
      }
    );
  } else {
    document.getElementById("weatherContainer").innerHTML =
      "<p>Geolocation is not supported by your browser.</p>";
  }
}
