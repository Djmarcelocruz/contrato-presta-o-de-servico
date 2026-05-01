# DJ Brow - Sistema de Gestão Profissional

Sistema web completo para gestão de serviços de DJ, eventos e equipamentos com estética brutalista, dashboard financeiro, PWA e segurança de dados.

## 🎯 O que é DJ Brow?

DJ Brow é uma solução profissional de gestão para DJs e locadores de equipamentos que oferece controle total sobre clientes, estoque, finanças, orçamentos, contratos e recibos — tudo em um único lugar, com interface intuitiva e design marcante.

## 📋 Índice de Documentação

| Documento | Descrição |
|-----------|-----------|
| **[QUICK_START.md](QUICK_START.md)** | ⚡ Comece em 5 minutos - guia rápido para primeiros passos |
| **[README_SISTEMA.md](README_SISTEMA.md)** | 📖 Documentação completa do sistema com todas as funcionalidades |
| **[DEPLOY.md](DEPLOY.md)** | 🚀 Guia de deployment em produção (local, Manus, GitHub) |
| **[CHANGELOG.md](CHANGELOG.md)** | 📝 Histórico de versões e mudanças |
| **[todo.md](todo.md)** | ✅ Lista de tarefas e progresso do projeto |

## ✨ Principais Funcionalidades

### 💼 Gestão de Clientes
- CRUD completo com busca por nome, telefone ou CPF
- Dados criptografados para máxima segurança
- Histórico de eventos por cliente
- Validação automática de dados

### 📦 Controle de Estoque
- Cadastro de equipamentos (cabos, iluminação, som, etc.)
- Busca e filtros por categoria
- Alertas automáticos de estoque baixo
- Relatório de valor total em estoque

### 💰 Fluxo de Caixa
- Registro de entradas e saídas
- Categorias personalizáveis
- Filtros por período
- Relatórios mensais e anuais
- Cálculo automático de lucro/prejuízo

### 📊 Orçamentos
- Criação personalizada por cliente
- Verificação automática de conflito de datas
- Cálculo automático de valores
- Status de orçamento (rascunho, enviado, aprovado, rejeitado)

### 📋 Contratos
- Modelos por tipo de evento (casamento, aniversário, corporativo, etc.)
- Pré-preenchimento automático
- Editor com preview
- Histórico de versões

### 🧾 Recibos
- Geração automática com numeração sequencial
- Múltiplas formas de pagamento
- Integração com fluxo de caixa
- Histórico por cliente

### 📈 Relatórios Financeiros
- Gráficos de ganhos mensais e anuais
- Análise por tipo de serviço
- Métricas de desempenho
- Filtros por período

### 📱 PWA (Progressive Web App)
- Instalável como app no mobile
- Funciona offline
- Sincronização automática
- Suporte iOS e Android

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/dj-brow-gestao.git
cd dj-brow-gestao
```

### 2. Instale as Dependências
```bash
pnpm install
# ou npm install
```

### 3. Configure o Banco de Dados
```bash
# Crie o banco de dados
mysql -u root -p -e "CREATE DATABASE dj_brow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Execute as migrações
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 4. Configure Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações
# DATABASE_URL, JWT_SECRET, VITE_APP_ID, etc.
```

### 5. Inicie em Desenvolvimento
```bash
pnpm dev
```

Acesse em `http://localhost:5173`

## 📚 Documentação Detalhada

### Para Usuários
- **[QUICK_START.md](QUICK_START.md)** - Guia rápido de uso
- **[README_SISTEMA.md](README_SISTEMA.md)** - Funcionalidades completas

### Para Desenvolvedores
- **[DEPLOY.md](DEPLOY.md)** - Deployment e configuração
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de versões
- **[todo.md](todo.md)** - Progresso do projeto

## 🏗️ Arquitetura

### Stack Técnico
- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Recharts
- **Backend:** Express 4, tRPC 11, Node.js
- **Banco de Dados:** MySQL/TiDB com Drizzle ORM
- **Autenticação:** Manus OAuth
- **Criptografia:** AES-256-GCM para dados sensíveis

### Estrutura de Diretórios
```
dj-brow-gestao/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas principais
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
│   ├── public/            # Arquivos estáticos
│   └── index.html         # HTML principal
├── server/                 # Backend Express/tRPC
│   ├── _core/             # Configuração central
│   ├── routers.ts         # Procedimentos tRPC
│   ├── db.ts              # Helpers de banco
│   └── crypto.ts          # Criptografia
├── drizzle/               # Schema e migrações
├── shared/                # Tipos compartilhados
├── package.json           # Dependências
└── README.md              # Este arquivo
```

## 🔒 Segurança

- ✅ Dados sensíveis criptografados (CPF, telefone, endereço)
- ✅ Autenticação OAuth segura
- ✅ Nenhuma credencial em código
- ✅ Variáveis de ambiente para todas as chaves
- ✅ Validação e sanitização de inputs
- ✅ CORS configurado

## 🎨 Design

A estética brutalista do DJ Brow oferece:
- **Fundo:** Preto sólido (#000000)
- **Tipografia:** Branca, condensada e oversized
- **Divisor:** Linha vermelha (#FF0000) estrutural
- **Layout:** Minimalista, centralizado, industrial
- **Responsividade:** Mobile-first, otimizado para todos os dispositivos

## 📱 Compatibilidade

- ✅ iOS 13+
- ✅ Android 8+
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🧪 Testes

```bash
# Rodar suite de testes
pnpm test

# Testes incluem:
# - CRUD de clientes, estoque, fluxo de caixa
# - Validação de dados
# - Segurança e autenticação
# - Integração end-to-end
```

## 📦 Build para Produção

```bash
# Build
pnpm build

# Iniciar em produção
pnpm start
```

## 🌐 Deployment

### Manus Platform (Recomendado)
1. Faça push para GitHub
2. Conecte ao Manus Platform
3. Configure variáveis de ambiente
4. Deploy automático a cada push

Veja [DEPLOY.md](DEPLOY.md) para detalhes completos.

## 🤝 Fluxo Automatizado

**Cliente → Orçamento → Contrato → Recibo em poucos cliques:**

1. Crie um cliente (auto-preenchimento de dados)
2. Crie um orçamento (verificação automática de conflito)
3. Gere um contrato (modelo automático por tipo)
4. Emita um recibo (numeração sequencial automática)

Tudo sem retrabalho de digitação!

## 📞 Suporte

1. Consulte a [documentação completa](README_SISTEMA.md)
2. Verifique o [guia rápido](QUICK_START.md)
3. Leia o [changelog](CHANGELOG.md)
4. Abra uma issue no GitHub

## 📄 Licença

Este projeto é fornecido como está para uso pessoal e comercial.

## 👨‍💻 Desenvolvido por

DJ Brow - Sistema de Gestão Profissional
*Desenvolvido com ❤️ para DJs e locadores de equipamentos*

---

## 🚀 Próximos Passos

1. **Leia [QUICK_START.md](QUICK_START.md)** para começar em 5 minutos
2. **Configure o banco de dados** seguindo as instruções acima
3. **Inicie o desenvolvimento** com `pnpm dev`
4. **Consulte [README_SISTEMA.md](README_SISTEMA.md)** para funcionalidades completas
5. **Deploy em produção** seguindo [DEPLOY.md](DEPLOY.md)

**Bem-vindo ao DJ Brow! 🎉**
