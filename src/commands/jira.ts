import { getAllTasks, formatTasks } from '../services/jira.service.js';
import { config } from '../utils/env.js';

export async function jiraCommand(): Promise<string> {
  const tasks = await getAllTasks();
  return formatTasks(tasks, config.jira.baseUrl);
}
