import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  weather: {
    latitude: parseFloat(process.env.WEATHER_LATITUDE || '-20.33'),
    longitude: parseFloat(process.env.WEATHER_LONGITUDE || '-40.39'),
  },
  jira: {
    baseUrl: process.env.JIRA_BASE_URL || '',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
  },
  outputPath: process.env.OUTPUT_PATH || './output',
};
