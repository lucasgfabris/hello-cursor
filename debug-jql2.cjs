const axios = require('axios');
require('dotenv').config();

const auth = Buffer.from(process.env.JIRA_EMAIL + ':' + process.env.JIRA_API_TOKEN).toString('base64');

// Testa diferentes JQLs
const tests = [
  'assignee = currentUser()',
  'status = "Em andamento" AND assignee = currentUser()',
  'status = "Tarefas pendentes" AND assignee = currentUser()',
];

async function test(jql) {
  try {
    const res = await axios.post(process.env.JIRA_BASE_URL + '/rest/api/3/search/jql', {
      jql,
      maxResults: 5,
      fields: ['summary', 'status']
    }, {
      headers: {
        Authorization: 'Basic ' + auth,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log(`\n✅ JQL: ${jql}`);
    console.log(`   Encontrados: ${res.data.issues.length}`);
    res.data.issues.slice(0, 3).forEach(i => console.log(`   - [${i.key}] ${i.fields.status.name}`));
  } catch (err) {
    console.log(`\n❌ JQL: ${jql}`);
    console.log(`   Erro: ${err.response?.status} - ${JSON.stringify(err.response?.data?.errorMessages)}`);
  }
}

(async () => {
  for (const jql of tests) {
    await test(jql);
  }
})();

