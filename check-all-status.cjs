const axios = require('axios');
require('dotenv').config();

const auth = Buffer.from(process.env.JIRA_EMAIL + ':' + process.env.JIRA_API_TOKEN).toString('base64');

// Busca tarefas de todos os status exceto Concluído
axios.post(process.env.JIRA_BASE_URL + '/rest/api/3/search/jql', {
  jql: 'assignee = currentUser() AND statusCategory != Done ORDER BY project, status',
  maxResults: 50,
  fields: ['summary', 'status', 'project']
}, {
  headers: {
    Authorization: 'Basic ' + auth,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}).then(res => {
  console.log('Tarefas não concluídas:\n');
  
  const byStatus = {};
  res.data.issues.forEach(issue => {
    const status = issue.fields.status.name;
    if (!byStatus[status]) byStatus[status] = [];
    byStatus[status].push(issue);
  });
  
  Object.keys(byStatus).forEach(status => {
    console.log(`\n=== ${status} (${byStatus[status].length}) ===`);
    byStatus[status].forEach(issue => {
      console.log(`  [${issue.key}] ${issue.fields.summary.substring(0, 60)}`);
    });
  });
}).catch(err => console.error('Erro:', err.response?.data || err.message));

