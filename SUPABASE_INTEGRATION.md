# Integração com Supabase - Tabela power_lpbr

## 📋 Visão Geral

Este projeto está integrado com o Supabase e utiliza **exclusivamente** a tabela `power_lpbr` para gerenciar todos os dados de leads.

## 🗄️ Estrutura da Tabela

A tabela `power_lpbr` contém os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | bigint | ID único do lead (chave primária) |
| `created_at` | timestamp | Data de criação do lead |
| `nome` | text | Nome do lead |
| `email` | text | Email do lead |
| `telefone` | text | Telefone do lead |
| `fat_deposito` | text | Faixa de faturamento/depósito (ex: "Até 100k", "+500k") |
| `tag` | text | Tag da landing page de origem |
| `id_trello` | text | ID do card no Trello |
| `instagram` | text | Instagram do lead |
| `expertise` | text | Área de expertise do lead |
| `status` | text | Status atual do lead |

## 🔧 Arquivos Criados

### 1. Configuração do Supabase
**Arquivo:** `src/lib/supabase.ts`
- Cliente Supabase configurado com URL e chave anon
- Pronto para uso em toda a aplicação

### 2. Tipos TypeScript
**Arquivo:** `src/types/power-lpbr.ts`
- Interface `PowerLPBR`: Representa um registro da tabela
- Interface `LeadStats`: Estatísticas agregadas dos leads
- Interface `TagCount`: Contagem de leads por tag
- Interface `DailyLeadCount`: Contagem diária de leads

### 3. Hooks Customizados
**Arquivo:** `src/hooks/usePowerLPBR.ts`

Hooks disponíveis:
- `useLeads()`: Busca todos os leads ordenados por data
- `useLeadStats()`: Calcula estatísticas (total, melhor/pior tag, expertise mais comum, média diária)
- `useLeadsByTag()`: Agrupa leads por tag (top 10)
- `useDailyLeads(days)`: Evolução diária de leads nos últimos N dias
- `useTotalPotential()`: Calcula o potencial total estimado baseado em `fat_deposito`

## 📊 Dashboard

O dashboard (`src/pages/Index.tsx`) exibe:

### Cards de Estatísticas
- **Total de Leads**: Quantidade total de registros
- **Melhor Tag**: Tag com mais leads
- **Potencial Total**: Soma estimada do faturamento
- **Pior Tag**: Tag com menos leads

### Insights
- TAG com mais potencial
- Expertise mais atingida
- Média de leads por dia

### Gráficos
- **Gráfico de Barras**: Top 10 tags por quantidade de leads
- **Gráfico de Área**: Evolução diária dos últimos 30 dias

### Tabela de Leads
- Lista completa de todos os leads
- Colunas: Nome, Email, Telefone, Potencial, Expertise, Tag, Data
- Ação de exclusão (preparada para implementação futura)

## 🚀 Como Usar

### Executar o Projeto
```bash
npm install
npm run dev
```

### Adicionar Novos Dados
Os dados são inseridos diretamente na tabela `power_lpbr` no Supabase. O dashboard atualiza automaticamente via React Query.

### Modificar Queries
Edite os hooks em `src/hooks/usePowerLPBR.ts` para adicionar novas funcionalidades ou filtros.

## 🔐 Segurança

- A chave `anon` do Supabase está configurada no código
- Para produção, considere usar variáveis de ambiente
- RLS (Row Level Security) está habilitado na tabela

## 📦 Dependências

- `@supabase/supabase-js`: Cliente oficial do Supabase
- `@tanstack/react-query`: Gerenciamento de estado e cache
- `date-fns`: Manipulação de datas
- `recharts`: Gráficos interativos

## 🎯 Próximos Passos

1. Implementar filtros por período e tag
2. Adicionar funcionalidade de exclusão de leads
3. Criar página de detalhes do lead
4. Implementar exportação de dados (CSV/Excel)
5. Adicionar autenticação de usuários
