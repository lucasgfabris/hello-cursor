const fs = require('fs');
const path = require('path');
const os = require('os');

// Caminho do settings.json global do usuário (funciona em multi-root workspaces)
const userSettingsPath = process.platform === 'win32'
  ? path.join(os.homedir(), 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json')
  : path.join(os.homedir(), '.config', 'Cursor', 'User', 'settings.json');

const newSettings = {
  "workbench.editorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  }
};

// Verifica se o arquivo existe
if (!fs.existsSync(userSettingsPath)) {
  console.log('⚠️  Arquivo de configurações do Cursor não encontrado');
  console.log(`   Esperado em: ${userSettingsPath}`);
  console.log('   Adicione manualmente nas configurações:');
  console.log('   "workbench.editorAssociations": { "*.md": "vscode.markdown.preview.editor" }');
  process.exit(0);
}

try {
  // Lê settings existentes
  const content = fs.readFileSync(userSettingsPath, 'utf-8');
  const existingSettings = JSON.parse(content);

  // Merge das configurações
  const mergedAssociations = {
    ...(existingSettings["workbench.editorAssociations"] || {}),
    ...newSettings["workbench.editorAssociations"]
  };

  // Só atualiza se a configuração não existir
  if (existingSettings["workbench.editorAssociations"]?.["*.md"] === "vscode.markdown.preview.editor") {
    console.log('✅ Configuração já existe no Cursor');
    process.exit(0);
  }

  existingSettings["workbench.editorAssociations"] = mergedAssociations;

  // Salva o arquivo
  fs.writeFileSync(userSettingsPath, JSON.stringify(existingSettings, null, 2), 'utf-8');

  console.log('✅ Configuração do Cursor aplicada!');
  console.log('   → Arquivos .md agora abrem direto no preview');
} catch (e) {
  console.log('⚠️  Não foi possível atualizar configurações automaticamente');
  console.log('   Adicione manualmente em Settings (JSON):');
  console.log('   "workbench.editorAssociations": { "*.md": "vscode.markdown.preview.editor" }');
}
