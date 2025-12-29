const axios = require('axios');
require('dotenv').config();

const auth = Buffer.from(process.env.JIRA_EMAIL + ':' + process.env.JIRA_API_TOKEN).toString('base64');

const jql = 'status IN ("Tarefas pendentes", "Em andamento") AND assignee = currentUser() ORDER BY project, status, updated DESC';

console.log('JQL:', jql);
console.log('');

axios.post(process.env.JIRA_BASE_URL + '/rest/api/3/search/jql', {
  jql,
  maxResults: 50,
  fields: ['summary', 'status', 'project']
}, {
  headers: {
    Authorization: 'Basic ' + auth,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}).then(res => {
  console.log('Total encontrado:', res.data.total);
  console.log('Issues:', res.data.issues.length);
  res.data.issues.forEach(issue => {
    console.log(`[${issue.key}] "${issue.fields.status.name}" - ${issue.fields.summary.substring(0, 40)}`);
  });
}).catch(err => {
  console.error('Erro:', err.response?.status);
  console.error('Mensagem:', JSON.stringify(err.response?.data, null, 2));
});

