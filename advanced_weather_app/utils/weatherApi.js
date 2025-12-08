export async function getWeather({ latitude, longitude, type }) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`;

  if (type === "current") {
    url += `&current_weather=true`;
  } else if (type === "today") {
    url += `&hourly=temperature_2m,weathercode,windspeed_10m&forecast_days=1`;
  } else if (type === "weekly") {
    url += `&daily=temperature_2m_max,temperature_2m_min,weathercode`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}

export function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy or overcast";
  if ([45, 48].includes(code)) return "Fog or rime fog";
  if ([51, 53, 55].includes(code)) return "Drizzle (light to dense)";
  if ([56, 57].includes(code)) return "Freezing drizzle";
  if ([61, 63, 65].includes(code)) return "Rain (slight to heavy)";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75].includes(code)) return "Snowfall (slight to heavy)";
  if (code === 77) return "Snow grains";
  if ([80, 81, 82].includes(code)) return "Rain showers (slight to violent)";
  if ([85, 86].includes(code)) return "Snow showers";
  if (code === 95) return "Thunderstorm (slight or moderate)";
  if ([96, 99].includes(code)) return "Thunderstorm with hail";
  return "Unknown weather code";
}

export function extractCity(address) {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.suburb ||
    address.locality ||
    null
  );
}
