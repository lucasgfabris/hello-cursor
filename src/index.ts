#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { weatherCommand } from './commands/weather.js';
import { jiraCommand } from './commands/jira.js';
import { config } from './utils/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateReport(): Promise<string> {
  console.log('🚀 Gerando relatório...\n');

  const weatherSection = await weatherCommand();
  const jiraSection = await jiraCommand();

  const timestamp = new Date().toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const report = `# 📊 Relatório Diário

> 📅 ${timestamp}

---

${weatherSection}

---

${jiraSection}

---

<sub>Gerado automaticamente por **hello-cursor** 🤖</sub>
`;

  return report;
}

async function saveReport(content: string): Promise<string> {
  const outputDir = path.resolve(__dirname, '..', config.outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const date = new Date();
  const filename = `relatorio-${date.toISOString().split('T')[0]}.md`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, content, 'utf-8');
  
  return filepath;
}

function openFile(filepath: string): void {
  // Abre o arquivo na janela atual do Cursor usando --reuse-window
  const child = spawn('cursor', ['--reuse-window', filepath], {
    shell: true,
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
}

async function main() {
  try {
    const report = await generateReport();
    
    console.log(report);
    
    const savedPath = await saveReport(report);
    console.log(`\n✅ Relatório salvo em: ${savedPath}`);
    
    // Abre o arquivo na janela atual
    openFile(savedPath);
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    process.exit(1);
  }
}

main();
