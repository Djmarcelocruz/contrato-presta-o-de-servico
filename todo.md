# DJ Brow - Sistema de Gestão - TODO

## Arquitetura & Segurança
- [x] Definir schema de banco de dados (clientes, estoque, fluxo de caixa, orçamentos, contratos, recibos)
- [x] Implementar autenticação segura com proteção de dados sensíveis
- [x] Configurar variáveis de ambiente para credenciais (sem exposição no GitHub)
- [x] Implementar criptografia de dados sensíveis (CPF, telefone, endereço)
- [x] Criar estrutura de permissões (admin/owner vs user)

## Configuração Inicial & PWA
- [x] Configurar PWA manifest (ícone, nome, descrição, cores)
- [x] Implementar service worker para offline support
- [x] Adicionar suporte a instalação em mobile (add to home screen)
- [ ] Configurar favicon e ícones responsivos
- [ ] Testar instalação em iOS e Android

## Dashboard & Resumo Financeiro
- [x] Criar dashboard principal com layout brutalista
- [x] Implementar resumo financeiro do mês (receitas, despesas, lucro)
- [x] Adicionar alertas de estoque baixo
- [x] Criar cards de resumo rápido (próximos eventos, tarefas pendentes)
- [ ] Implementar gráfico de tendência de receita (últimos 30 dias)

## Gestão de Clientes
- [x] Criar CRUD de clientes com validação de dados
- [x] Implementar busca por nome, telefone, CPF
- [ ] Adicionar filtros (ativo/inativo, tipo de cliente)
- [x] Criar formulário de cadastro com campos obrigatórios
- [x] Implementar edição e exclusão lógica de clientes
- [ ] Adicionar histórico de eventos por cliente
- [x] Garantir segurança de dados (criptografia, acesso restrito)

## Controle de Estoque
- [x] Criar CRUD de produtos/equipamentos
- [x] Implementar campos: nome, descrição, quantidade, valor unitário, categoria
- [x] Adicionar sistema de busca por nome/descrição
- [x] Criar filtros por categoria (cabos, iluminação, som, etc.)
- [x] Implementar alertas de estoque baixo (threshold configurável)
- [ ] Adicionar histórico de movimentação de estoque
- [ ] Criar relatório de valor total em estoque

## Fluxo de Caixa
- [x] Criar CRUD de entradas e saídas
- [x] Implementar categorias (DJ, som, iluminação, combustível, manutenção, etc.)
- [x] Adicionar campos: data, valor, descrição, categoria, tipo (entrada/saída)
- [x] Criar filtros por período (data inicial/final)
- [x] Implementar relatórios mensais e anuais
- [ ] Adicionar gráficos de distribuição por categoria
- [ ] Criar exportação de relatórios (PDF/Excel)

## Orçamentos
- [x] Criar CRUD de orçamentos
- [x] Implementar seleção de cliente com auto-preenchimento
- [x] Adicionar seleção de data do evento
- [ ] Criar sistema de pacotes (básico, premium, completo)
- [ ] Implementar seleção de itens do estoque com quantidade
- [ ] Adicionar cálculo automático de valores (subtotal, impostos, total)
- [x] Implementar verificação de conflito de datas (alerta se evento já existe)
- [x] Adicionar status de orçamento (rascunho, enviado, aprovado, rejeitado)
- [ ] Criar visualização e impressão de orçamento
- [ ] Implementar envio de orçamento por WhatsApp/Email

## Contratos
- [x] Criar modelos de contrato por tipo de evento (casamento, aniversário, formatura, corporativo, show, outro)
- [x] Implementar pré-preenchimento automático com dados do cliente e orçamento
- [x] Adicionar campos personalizáveis por tipo de evento
- [x] Criar editor de contrato com preview
- [ ] Implementar geração de PDF do contrato
- [ ] Adicionar assinatura digital (ou checkbox de aceite)
- [ ] Criar histórico de versões de contrato
- [ ] Implementar envio de contrato por email

## Recibos de Pagamento
- [x] Criar CRUD de recibos
- [x] Implementar geração automática de recibo ao confirmar pagamento
- [x] Adicionar campos: data, cliente, valor, forma de pagamento, descrição
- [x] Criar numeração sequencial de recibos
- [ ] Implementar geração de PDF do recibo
- [ ] Adicionar assinatura/carimbo digital
- [x] Criar histórico de recibos por cliente
- [ ] Implementar envio de recibo por email/WhatsApp

## Fluxo Automatizado
- [ ] Integrar cliente → orçamento (auto-preenchimento)
- [ ] Integrar orçamento → contrato (auto-preenchimento)
- [ ] Integrar contrato → recibo (auto-preenchimento)
- [ ] Criar wizard/fluxo visual para facilitar navegação
- [ ] Implementar validações em cada etapa
- [ ] Adicionar confirmações antes de ações irreversíveis

## Relatórios Financeiros
- [ ] Criar gráfico de ganhos mensais (últimos 12 meses)
- [ ] Implementar gráfico de ganhos por tipo de serviço
- [ ] Adicionar gráfico de despesas por categoria
- [ ] Criar relatório de margem de lucro por evento
- [ ] Implementar filtros por período (mês, trimestre, ano)
- [ ] Adicionar exportação de relatórios (PDF/Excel)
- [ ] Criar dashboard de KPIs (ticket médio, eventos/mês, etc.)

## Estética Brutalista & UX
- [x] Implementar design brutalista (fundo preto, tipografia branca, linha vermelha divisora)
- [x] Criar componentes com estilo industrial/minimalista
- [x] Implementar layout centralizado e rigoroso
- [ ] Adicionar transições suaves e micro-interações
- [ ] Testar contraste de cores (acessibilidade)
- [x] Implementar tipografia oversized e condensada
- [x] Criar dividers vermelhos estruturais

## Responsividade & Mobile
- [x] Testar layout em mobile (iPhone, Android)
- [x] Testar layout em tablet
- [x] Testar layout em desktop
- [x] Implementar navegação mobile-first
- [ ] Adicionar bottom navigation para mobile
- [ ] Testar touch interactions
- [ ] Otimizar performance para mobile

## Segurança & GitHub
- [ ] Configurar .gitignore para excluir .env
- [ ] Implementar variáveis de ambiente para dados sensíveis
- [ ] Adicionar documentação de setup seguro
- [ ] Testar que nenhum dado sensível é exposto no repositório
- [ ] Implementar rate limiting em endpoints críticos
- [ ] Adicionar validação e sanitização de inputs
- [ ] Implementar CORS adequadamente

## Testes & Validação
- [x] Testar fluxo cliente → orçamento → contrato → recibo
- [ ] Testar geração de PDF (orçamento, contrato, recibo)
- [x] Testar busca em todos os módulos
- [x] Testar filtros e relatórios
- [x] Testar responsividade em múltiplos dispositivos
- [ ] Testar instalação PWA em mobile
- [x] Testar offline functionality (se aplicável)
- [ ] Testar performance e carregamento

## Documentação & Deploy
- [x] Criar README com instruções de setup
- [x] Documentar variáveis de ambiente necessárias
- [x] Criar guia de uso do sistema
- [x] Documentar estrutura de banco de dados
- [x] Preparar para publicação no GitHub
- [x] Criar changelog
- [x] Documentar API endpoints (se necessário)
