import axios from 'axios';
import { config } from '../utils/env.js';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  city: string;
  state: string;
}

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    is_day: number;
  };
  hourly?: {
    relative_humidity_2m?: number[];
  };
}

interface NominatimResponse {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
  };
}

const weatherCodeMap: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  95: 'Tempestade',
  96: 'Tempestade com granizo leve',
  99: 'Tempestade com granizo forte',
};

const weatherEmoji: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  80: '🌦️',
  81: '🌦️',
  82: '🌦️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

async function getCityFromCoordinates(latitude: number, longitude: number): Promise<{ city: string; state: string }> {
  try {
    const response = await axios.get<NominatimResponse>(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
        },
        headers: {
          'User-Agent': 'hello-cursor/1.0',
        },
      }
    );

    const address = response.data.address;
    const city = address.city || address.town || address.village || address.municipality || 'Desconhecida';
    const state = address.state || '';

    const stateAbbr = getStateAbbreviation(state);

    return { city, state: stateAbbr };
  } catch {
    return { city: 'Desconhecida', state: '' };
  }
}

function getStateAbbreviation(stateName: string): string {
  const states: Record<string, string> = {
    'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
    'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
    'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
    'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
    'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO',
  };
  return states[stateName] || stateName;
}

export interface WeatherResult extends WeatherData {
  weatherCode: number;
}

export async function getWeather(): Promise<WeatherResult> {
  const { latitude, longitude } = config.weather;

  try {
    const [weatherResponse, location] = await Promise.all([
      axios.get<OpenMeteoResponse>('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: 'relative_humidity_2m',
          timezone: 'America/Sao_Paulo',
        },
      }),
      getCityFromCoordinates(latitude, longitude),
    ]);

    const currentHour = new Date().getHours();
    const humidity = weatherResponse.data.hourly?.relative_humidity_2m?.[currentHour] ?? 65;
    const weatherCode = weatherResponse.data.current_weather.weathercode;

    return {
      temperature: Math.round(weatherResponse.data.current_weather.temperature),
      description: weatherCodeMap[weatherCode] || 'Indefinido',
      humidity,
      city: location.city,
      state: location.state,
      weatherCode,
    };
  } catch (error) {
    console.warn('⚠️  Erro ao buscar clima, usando dados de exemplo...');
    return getMockWeather();
  }
}

function getMockWeather(): WeatherResult {
  return {
    temperature: 26,
    description: 'Parcialmente nublado',
    humidity: 68,
    city: 'Desconhecida',
    state: '',
    weatherCode: 2,
  };
}

export function formatWeather(weather: WeatherResult): string {
  const location = weather.state ? `${weather.city} - ${weather.state}` : weather.city;
  const emoji = weatherEmoji[weather.weatherCode] || '🌤️';
  
  return `## ${emoji} Clima em ${location}

| Métrica | Valor |
|---------|-------|
| 🌡️ Temperatura | **${weather.temperature}°C** |
| ${emoji} Condição | ${weather.description} |
| 💧 Umidade | ${weather.humidity}% |`;
}
