export interface WeatherResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    uv_index: number[];
    humidity: number[];
    wind_speed: number[];
    weathercode: number[];
  };
}

interface FetchInput {
  latitude: number;
  longitude: number;
}

export async function fetchWeather({ latitude, longitude }: FetchInput): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'temperature_2m,precipitation,uv_index,humidity,wind_speed,weathercode',
    timezone: 'auto',
    forecast_days: '1',
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`);
  return res.json();
} 