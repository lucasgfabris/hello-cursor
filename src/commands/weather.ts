import { getWeather, formatWeather } from '../services/weather.service.js';

export async function weatherCommand(): Promise<string> {
  const weather = await getWeather();
  return formatWeather(weather);
}
