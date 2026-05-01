# DJ Brow - Sistema de Gestão Profissional

Sistema web completo para gestão de serviços de DJ, eventos e equipamentos com estética brutalista, dashboard financeiro, PWA e segurança de dados.

## 🎯 Funcionalidades Principais

### 1. **Dashboard Executivo**
- Resumo financeiro do mês (receitas, despesas, lucro)
- Alertas de estoque baixo
- Ações rápidas para criar orçamentos, clientes e equipamentos
- Navegação centralizada para todos os módulos

### 2. **Gestão de Clientes**
- CRUD completo de clientes
- Busca por nome, telefone ou CPF
- Dados criptografados (CPF, telefone, endereço)
- Histórico de eventos por cliente
- Validação de dados com feedback em tempo real

### 3. **Controle de Estoque**
- Cadastro de equipamentos (cabos, iluminação, som, etc.)
- Quantidade, valor unitário e descrição
- Sistema de busca e filtros por categoria
- Alertas automáticos de estoque baixo (threshold configurável)
- Relatório de valor total em estoque

### 4. **Fluxo de Caixa**
- Registro de entradas e saídas
- Categorias personalizáveis (DJ, som, iluminação, combustível, manutenção)
- Filtros por período (data inicial/final)
- Relatórios mensais e anuais
- Gráficos de distribuição por categoria

### 5. **Orçamentos**
- Criação de orçamentos personalizados
- Seleção de cliente com auto-preenchimento
- Data do evento com verificação automática de conflito
- Cálculo automático de valores (subtotal, impostos, total)
- Status de orçamento (rascunho, enviado, aprovado, rejeitado)
- Visualização e impressão

### 6. **Contratos de Serviço**
- Modelos de contrato por tipo de evento:
  - Casamento
  - Aniversário
  - Formatura
  - Corporativo
  - Show
  - Outro
- Pré-preenchimento automático com dados do cliente e orçamento
- Editor de contrato com preview
- Geração de PDF
- Histórico de versões

### 7. **Recibos de Pagamento**
- Geração automática de recibos
- Numeração sequencial persistente
- Campos: cliente, valor, data, forma de pagamento
- Formas de pagamento: Dinheiro, Cartão de Crédito, Cartão de Débito, Transferência, PIX, Cheque
- Geração de PDF e impressão
- Histórico de recibos por cliente

### 8. **Relatórios Financeiros**
- Gráficos de ganhos mensais e anuais
- Análise por tipo de serviço
- Métricas de desempenho:
  - Ticket médio
  - Eventos realizados
  - Taxa de conversão
  - Margem de lucro
- Filtros por período
- Exportação para PDF/Excel

### 9. **PWA (Progressive Web App)**
- Instalação como aplicativo no mobile
- Ícone na tela inicial
- Funcionamento offline (cache de recursos)
- Sincronização automática quando online
- Suporte a iOS e Android

### 10. **Configurações e Segurança**
- Perfil do usuário
- Preferências de notificações
- Informações de segurança
- Dados criptografados em repouso
- Autenticação OAuth Manus
- Sem exposição de dados sensíveis

## 🎨 Estética Brutalista

- **Fundo:** Preto sólido (#000000)
- **Tipografia:** Branca, condensada e oversized
- **Divisor Estrutural:** Linha vermelha (#FF0000) horizontal
- **Layout:** Minimalista, centralizado, industrial
- **Design:** Crudo e funcional, sem ornamentação desnecessária

## 🔒 Segurança de Dados

### Criptografia
- CPF, telefone, endereço e CEP criptografados com AES-256-GCM
- Chave derivada de JWT_SECRET
- Sem exposição de dados no GitHub

### Autenticação
- OAuth Manus integrado
- Sessão protegida com JWT
- Roles: admin (proprietário) e user (padrão)

### Conformidade
- Nenhuma informação sensível em variáveis públicas
- Dados de clientes protegidos
- Dados do proprietário seguros

## 📱 Responsividade

- **Mobile:** Layout otimizado para telas pequenas
- **Tablet:** Adaptação para médias telas
- **Desktop:** Layout completo com navegação lateral
- **PWA:** Instalável como aplicativo nativo

## 🚀 Fluxo Automatizado

### Cliente → Orçamento → Contrato → Recibo

1. **Selecionar Cliente:** Auto-preenchimento de dados
2. **Criar Orçamento:** Verificação automática de conflito de datas
3. **Gerar Contrato:** Modelo automático por tipo de evento
4. **Emitir Recibo:** Numeração sequencial automática

Tudo em poucos cliques, sem retrabalho de digitação.

## 🛠️ Stack Técnico

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Express 4, tRPC 11
- **Banco de Dados:** MySQL/TiDB com Drizzle ORM
- **Autenticação:** Manus OAuth
- **Criptografia:** crypto (Node.js)
- **Gráficos:** Recharts
- **Formulários:** React Hook Form + Zod

## 📦 Instalação e Uso

### Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Rodar testes
pnpm test

# Build para produção
pnpm build
```

### Variáveis de Ambiente

```env
DATABASE_URL=mysql://user:password@host/db
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
```

## 📊 Estrutura de Banco de Dados

### Tabelas Principais

- **users:** Usuários do sistema
- **clients:** Clientes cadastrados
- **inventory:** Equipamentos e produtos
- **cash_flow:** Entradas e saídas financeiras
- **budgets:** Orçamentos
- **budget_items:** Itens de orçamento
- **contracts:** Contratos de serviço
- **receipts:** Recibos de pagamento

## 🧪 Testes

```bash
# Rodar suite de testes
pnpm test

# Testes incluem:
- CRUD de clientes
- Gestão de estoque
- Fluxo de caixa
- Orçamentos e conflito de datas
- Contratos
- Recibos com numeração sequencial
- Validação de dados
- Segurança e autenticação
```

## 📝 Documentação de API

Todas as operações são expostas via tRPC em `/api/trpc`:

- `clients.list()` - Listar clientes
- `clients.create(data)` - Criar cliente
- `clients.search(query)` - Buscar clientes
- `inventory.list()` - Listar equipamentos
- `inventory.create(data)` - Criar equipamento
- `inventory.getLowStock()` - Alertas de estoque
- `cashFlow.create(data)` - Registrar entrada/saída
- `cashFlow.summary(period)` - Resumo financeiro
- `budgets.create(data)` - Criar orçamento
- `budgets.checkDateConflict(date)` - Verificar conflito
- `contracts.create(data)` - Criar contrato
- `receipts.create(data)` - Gerar recibo
- `receipts.list()` - Listar recibos

## 🌐 Publicação no GitHub

O projeto está pronto para publicação sem expor dados sensíveis:

- ✅ Nenhuma credencial em código
- ✅ Variáveis de ambiente em `.env.example`
- ✅ Dados criptografados no banco
- ✅ Sem exposição de chaves privadas
- ✅ Pronto para CI/CD

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o desenvolvedor.

---

**DJ Brow - Sistema de Gestão Profissional**
*Desenvolvido com ❤️ para DJs e locadores de equipamentos*
