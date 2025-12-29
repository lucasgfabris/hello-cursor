const axios = require('axios');
require('dotenv').config();

const auth = Buffer.from(process.env.JIRA_EMAIL + ':' + process.env.JIRA_API_TOKEN).toString('base64');

axios.get(process.env.JIRA_BASE_URL + '/rest/api/3/status', {
  headers: {
    Authorization: 'Basic ' + auth,
    Accept: 'application/json'
  }
}).then(res => {
  console.log('Status disponíveis no Jira:\n');
  res.data.forEach(s => {
    console.log(`- "${s.name}" (categoria: ${s.statusCategory.name}, key: ${s.statusCategory.key})`);
  });
}).catch(err => console.error('Erro:', err.response?.data || err.message));

