import axios from 'axios';
import { config } from '../utils/env.js';

interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  project: string;
  projectName: string;
}

interface JiraApiResponse {
  issues: Array<{
    key: string;
    fields: {
      summary: string;
      status: {
        name: string;
        statusCategory: {
          key: string;
          name: string;
        };
      };
      project: {
        key: string;
        name: string;
      };
    };
  }>;
}

interface TasksByStatus {
  todo: JiraIssue[];
  inProgress: JiraIssue[];
}

interface TasksByProject {
  [projectKey: string]: {
    name: string;
    tasks: TasksByStatus;
  };
}

// Status a serem ignorados (ex: Review)
const IGNORED_STATUSES = ['revisar', 'review'];

export async function getAllTasks(): Promise<TasksByProject> {
  const { baseUrl, email, apiToken } = config.jira;

  if (!baseUrl || !email || !apiToken) {
    console.warn('⚠️  Jira não configurado no .env, usando dados de exemplo...');
    console.warn('   Configure: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN');
    return getMockTasks();
  }

  try {
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    // Usa statusCategory que funciona melhor que status por nome
    const jql = `statusCategory IN ("To Do", "In Progress") AND assignee = currentUser() ORDER BY project, status, updated DESC`;
    
    const response = await axios.post<JiraApiResponse>(
      `${baseUrl}/rest/api/3/search/jql`,
      {
        jql,
        maxResults: 50,
        fields: ['summary', 'status', 'project'],
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const tasksByProject: TasksByProject = {};

    response.data.issues.forEach((issue) => {
      const projectKey = issue.fields.project.key;
      const projectName = issue.fields.project.name;
      const statusName = issue.fields.status.name;
      const statusCategory = issue.fields.status.statusCategory.key;

      // Ignora status de Review
      if (IGNORED_STATUSES.includes(statusName.toLowerCase())) {
        return;
      }

      if (!tasksByProject[projectKey]) {
        tasksByProject[projectKey] = {
          name: projectName,
          tasks: {
            todo: [],
            inProgress: [],
          },
        };
      }

      const task: JiraIssue = {
        key: issue.key,
        summary: issue.fields.summary,
        status: statusName,
        project: projectKey,
        projectName: projectName,
      };

      // statusCategory: "indeterminate" = In Progress, "new" = To Do
      if (statusCategory === 'indeterminate') {
        tasksByProject[projectKey].tasks.inProgress.push(task);
      } else if (statusCategory === 'new') {
        tasksByProject[projectKey].tasks.todo.push(task);
      }
    });

    return tasksByProject;
  } catch (error: any) {
    console.warn('⚠️  Erro ao buscar tarefas do Jira:');
    if (error.response) {
      console.warn(`   Status: ${error.response.status}`);
      console.warn(`   Mensagem: ${JSON.stringify(error.response.data?.errorMessages || error.response.data)}`);
    } else {
      console.warn(`   ${error.message}`);
    }
    console.warn('   Usando dados de exemplo...');
    return getMockTasks();
  }
}

function getMockTasks(): TasksByProject {
  return {
    'YOOGA': {
      name: 'Yooga',
      tasks: {
        todo: [
          { key: 'YOOGA-789', summary: 'Revisar documentação da API', status: 'Tarefas pendentes', project: 'YOOGA', projectName: 'Yooga' },
        ],
        inProgress: [
          { key: 'YOOGA-123', summary: 'Ajustar cache do cardápio', status: 'Em andamento', project: 'YOOGA', projectName: 'Yooga' },
          { key: 'YOOGA-456', summary: 'Corrigir duplicação de itens', status: 'Em andamento', project: 'YOOGA', projectName: 'Yooga' },
        ],
      },
    },
    'TAD': {
      name: 'Time Adquirência',
      tasks: {
        todo: [
          { key: 'TAD-1400', summary: 'Criar testes unitários', status: 'Tarefas pendentes', project: 'TAD', projectName: 'Time Adquirência' },
        ],
        inProgress: [
          { key: 'TAD-1351', summary: 'Implementar agrupamento por método', status: 'Em andamento', project: 'TAD', projectName: 'Time Adquirência' },
        ],
      },
    },
  };
}

export function formatTasks(tasksByProject: TasksByProject, jiraBaseUrl: string): string {
  const projectKeys = Object.keys(tasksByProject);
  
  if (projectKeys.length === 0) {
    return `## 📋 Suas tarefas no Jira

> ✨ Nenhuma tarefa pendente no momento!`;
  }

  let totalTodo = 0;
  let totalInProgress = 0;
  
  projectKeys.forEach((key) => {
    totalTodo += tasksByProject[key].tasks.todo.length;
    totalInProgress += tasksByProject[key].tasks.inProgress.length;
  });

  const total = totalTodo + totalInProgress;
  
  if (total === 0) {
    return `## 📋 Suas tarefas no Jira

> ✨ Nenhuma tarefa em To Do ou In Progress no momento!`;
  }
  
  let output = `## 📋 Suas tarefas no Jira

**${total}** tarefas · 🔄 ${totalInProgress} em progresso · 📝 ${totalTodo} pendentes\n`;

  projectKeys.forEach((projectKey) => {
    const project = tasksByProject[projectKey];
    const projectTotal = project.tasks.todo.length + project.tasks.inProgress.length;
    
    if (projectTotal === 0) return;
    
    output += `\n### 🏷️ ${project.name}\n`;
    
    if (project.tasks.inProgress.length > 0) {
      output += `\n#### 🔄 Em Progresso (${project.tasks.inProgress.length})\n\n`;
      output += `| Ticket | Descrição |\n`;
      output += `|--------|----------|\n`;
      project.tasks.inProgress.forEach((task) => {
        const ticketLink = jiraBaseUrl ? `[${task.key}](${jiraBaseUrl}/browse/${task.key})` : task.key;
        output += `| ${ticketLink} | ${task.summary} |\n`;
      });
    }
    
    if (project.tasks.todo.length > 0) {
      output += `\n#### 📝 To Do (${project.tasks.todo.length})\n\n`;
      output += `| Ticket | Descrição |\n`;
      output += `|--------|----------|\n`;
      project.tasks.todo.forEach((task) => {
        const ticketLink = jiraBaseUrl ? `[${task.key}](${jiraBaseUrl}/browse/${task.key})` : task.key;
        output += `| ${ticketLink} | ${task.summary} |\n`;
      });
    }
  });

  return output.trimEnd();
}
