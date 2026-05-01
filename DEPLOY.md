# Guia de Deployment - DJ Brow

Este documento descreve como fazer deploy do sistema DJ Brow em diferentes ambientes.

## 📋 Pré-requisitos

- Node.js 18+ ou superior
- pnpm 10+ ou npm/yarn
- MySQL 8+ ou TiDB
- Git (para versionamento)

## 🚀 Deployment Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/dj-brow-gestao.git
cd dj-brow-gestao
```

### 2. Instalar Dependências

```bash
pnpm install
# ou
npm install
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis necessárias:

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```env
DATABASE_URL=mysql://user:password@localhost:3306/dj_brow_db
JWT_SECRET=sua-chave-secreta-super-longa
VITE_APP_ID=seu-app-id-manus
# ... outras variáveis
```

### 4. Configurar Banco de Dados

```bash
# Criar banco de dados
mysql -u root -p -e "CREATE DATABASE dj_brow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Executar migrações
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 5. Iniciar em Desenvolvimento

```bash
pnpm dev
```

Acesse em `http://localhost:5173`

### 6. Build para Produção

```bash
pnpm build
```

### 7. Iniciar em Produção

```bash
pnpm start
```

## 🌐 Deployment em Produção (Manus Platform)

### 1. Preparar Repositório

```bash
# Remover arquivos sensíveis
rm -f .env .env.local

# Verificar que .env está no .gitignore
cat .gitignore | grep ".env"

# Fazer commit
git add .
git commit -m "Preparar para deployment"
```

### 2. Publicar no GitHub

```bash
# Criar novo repositório no GitHub
# Então:

git remote add origin https://github.com/seu-usuario/dj-brow-gestao.git
git branch -M main
git push -u origin main
```

### 3. Conectar ao Manus Platform

1. Acesse [Manus Platform](https://manus.im)
2. Crie novo projeto
3. Selecione "Conectar do GitHub"
4. Autorize o acesso ao repositório
5. Configure as variáveis de ambiente no painel do Manus

### 4. Configurar Variáveis de Ambiente no Manus

No painel do Manus, configure:

- `DATABASE_URL`: Sua string de conexão MySQL
- `JWT_SECRET`: Chave secreta para criptografia
- `VITE_APP_ID`: ID da aplicação Manus
- Outras variáveis conforme necessário

### 5. Deploy Automático

O Manus fará deploy automático a cada push para `main`:

```bash
# Fazer alterações
git add .
git commit -m "Sua mensagem"
git push origin main

# O Manus detectará e fará deploy automaticamente
```

## 🔒 Segurança

### Checklist de Segurança

- ✅ Nenhuma credencial em código
- ✅ `.env` no `.gitignore`
- ✅ Dados sensíveis criptografados no banco
- ✅ Autenticação OAuth ativa
- ✅ HTTPS em produção
- ✅ Rate limiting configurado
- ✅ CORS restrito

### Verificar Exposição de Segredos

```bash
# Verificar se há segredos no repositório
git log --all --full-history -- .env
git log --all --full-history -- "*.key"
git log --all --full-history -- "*.pem"

# Verificar último commit
git show HEAD
```

## 📊 Monitoramento

### Logs

Acesse os logs no painel do Manus:

```bash
# Ou localmente:
tail -f .manus-logs/devserver.log
tail -f .manus-logs/browserConsole.log
```

### Health Check

```bash
curl https://seu-dominio.manus.space/api/health
```

## 🔄 Atualizações e Manutenção

### Atualizar Dependências

```bash
pnpm update
pnpm audit fix
```

### Backup do Banco de Dados

```bash
mysqldump -u user -p dj_brow_db > backup.sql
```

### Restaurar do Backup

```bash
mysql -u user -p dj_brow_db < backup.sql
```

## 🐛 Troubleshooting

### Erro de Conexão com Banco de Dados

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solução:**
- Verificar se MySQL está rodando
- Verificar `DATABASE_URL` em `.env`
- Verificar credenciais de acesso

### Erro de Autenticação OAuth

```
Error: Invalid OAuth credentials
```

**Solução:**
- Verificar `VITE_APP_ID` e `OAUTH_SERVER_URL`
- Confirmar que a aplicação está registrada no Manus
- Verificar redirect URLs

### Erro de Build

```
Error: TypeScript compilation failed
```

**Solução:**
```bash
pnpm check
pnpm build
```

## 📞 Suporte

Para problemas com deployment:

1. Consulte a [documentação do Manus](https://docs.manus.im)
2. Verifique os logs no painel
3. Entre em contato com suporte

---

**DJ Brow - Sistema de Gestão Profissional**
