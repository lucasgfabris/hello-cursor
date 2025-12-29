const axios = require('axios');
require('dotenv').config();

const auth = Buffer.from(process.env.JIRA_EMAIL + ':' + process.env.JIRA_API_TOKEN).toString('base64');

axios.post(process.env.JIRA_BASE_URL + '/rest/api/3/search/jql', {
  jql: 'assignee = currentUser() ORDER BY status, updated DESC',
  maxResults: 30,
  fields: ['summary', 'status', 'project']
}, {
  headers: {
    Authorization: 'Basic ' + auth,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}).then(res => {
  console.log('Suas tarefas e seus status:\n');
  res.data.issues.forEach(issue => {
    console.log(`[${issue.key}] Status: "${issue.fields.status.name}" | ${issue.fields.summary.substring(0, 50)}...`);
  });
}).catch(err => console.error('Erro:', err.response?.data || err.message));

