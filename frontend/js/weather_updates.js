const API_KEY = 'sk-live-kpc2Z2ZdOSuofE7oStLIiwlkc56ecmMJ3id0wH9c';

async function getWeather(lat, lon) {
  try {
    const res = await fetch(`https://weather.indianapi.in/global/current?location=${lat},${lon}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    const data = await res.json();
    console.log("Weather API Response:", data);

    if (!res.ok || typeof data.temperature === 'undefined') {
      throw new Error(data?.error || 'Invalid weather response');
    }

    // Render to DOM
    const container = document.getElementById('weather-info') || document.body;
    container.innerHTML = `
      <h2>🌤️ Weather Report</h2>
      <p><strong>Condition:</strong> ${data.condition}</p>
      <p><strong>Temperature:</strong> ${data.temperature}°C (Feels like ${data.feels_like}°C)</p>
      <p><strong>Humidity:</strong> ${data.humidity}%</p>
      <p><strong>Wind:</strong> ${data.wind_speed} km/h from ${data.wind_direction}</p>
      <p><strong>UV Index:</strong> ${data.uv_index}</p>
    `;
  } catch (err) {
    console.error("Weather error:", err);
    document.body.innerHTML += `<p style="color:red;">⚠️ Failed to fetch weather: ${err.message}</p>`;
  }
}

async function init() {
  let lat = localStorage.getItem('lat');
  let lon = localStorage.getItem('lon');

  if (!lat || !lon) {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        // Save to localStorage
        localStorage.setItem('lat', lat);
        localStorage.setItem('lon', lon);

        getWeather(lat, lon);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Location permission denied. Weather data cannot be loaded.");
      }
    );
  } else {
    getWeather(lat, lon);
  }
}

document.addEventListener("DOMContentLoaded", init);
