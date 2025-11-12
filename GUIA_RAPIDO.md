# 🚀 Guia Rápido - Dashboard Power LPBR

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

### 3. Acessar o Dashboard
Abra o navegador em: `http://localhost:5173`

## 📊 O que você verá

### Dashboard Principal
- **4 Cards de Estatísticas**: Total de leads, melhor/pior tag, potencial total
- **3 Cards de Insights**: Tag com mais potencial, expertise mais atingida, média diária
- **2 Gráficos**: Leads por tag (barras) e evolução diária (área)
- **Tabela Completa**: Todos os leads com informações detalhadas

## 🗄️ Dados

### De onde vêm os dados?
Todos os dados vêm da tabela `power_lpbr` no Supabase.

### Como adicionar novos leads?
Você pode adicionar leads diretamente no Supabase:

**Opção 1: Interface do Supabase**
1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto "Aff-24"
3. Vá em "Table Editor" → "power_lpbr"
4. Clique em "Insert" → "Insert row"
5. Preencha os campos e salve

**Opção 2: SQL Editor**
```sql
INSERT INTO power_lpbr (
  nome, email, telefone, fat_deposito, 
  tag, expertise, status
) VALUES (
  'João Silva',
  'joao@email.com',
  '11987654321',
  'Até 100k',
  'CR10',
  'expert',
  'NOVO'
);
```

## 🔄 Atualização Automática

O dashboard usa **React Query** que:
- ✅ Busca dados automaticamente ao carregar
- ✅ Mantém cache inteligente
- ✅ Atualiza em segundo plano
- ✅ Mostra loading states

Para forçar atualização, recarregue a página (F5).

## 📋 Campos da Tabela

| Campo | Tipo | Exemplo |
|-------|------|---------|
| `nome` | Texto | "João Silva" |
| `email` | Texto | "joao@email.com" |
| `telefone` | Texto | "11987654321" |
| `fat_deposito` | Texto | "Até 100k", "+500k" |
| `tag` | Texto | "CR10", "CR17" |
| `expertise` | Texto | "expert", "iniciante" |
| `status` | Texto | "NOVO", "QUALIFICADO" |
| `instagram` | Texto | "@joaosilva" |
| `id_trello` | Texto | "abc123" |

## 🎯 Casos de Uso Comuns

### Ver todos os leads
Já está na página principal! Role para baixo até a tabela.

### Filtrar por tag
*Em desenvolvimento* - Por enquanto, use o SQL:
```sql
SELECT * FROM power_lpbr WHERE tag = 'CR10';
```

### Exportar dados
*Em desenvolvimento* - Por enquanto, use o Supabase:
1. Table Editor → power_lpbr
2. Botão "Export" → CSV

### Editar um lead
*Em desenvolvimento* - Por enquanto, use o Supabase:
1. Table Editor → power_lpbr
2. Clique na linha
3. Edite os campos
4. Salve

## 🛠️ Solução de Problemas

### Dashboard não carrega
1. Verifique se o npm install foi executado
2. Verifique se não há erros no console (F12)
3. Confirme que o Supabase está acessível

### Dados não aparecem
1. Verifique se há dados na tabela power_lpbr
2. Abra o console (F12) e veja se há erros
3. Verifique a conexão com internet

### Erro de build
```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentação Completa

Para mais detalhes, consulte:
- **SUPABASE_INTEGRATION.md** - Documentação técnica completa
- **EXEMPLOS_SQL.md** - Queries SQL úteis
- **RESUMO_INTEGRACAO.md** - Visão geral da integração

## 🎨 Personalização

### Mudar cores
Edite: `tailwind.config.ts`

### Adicionar novos gráficos
Edite: `src/pages/Index.tsx`

### Criar novos hooks
Adicione em: `src/hooks/usePowerLPBR.ts`

## 💡 Dicas

1. **Performance**: O React Query faz cache automático, não se preocupe com requisições excessivas
2. **Dados em tempo real**: Para atualizar automaticamente, implemente Supabase Realtime
3. **Filtros**: Os filtros estão preparados na UI mas ainda não funcionais
4. **Ações**: Os botões de ação (deletar) estão preparados mas ainda não implementados

## 🔐 Segurança

- ✅ A chave usada é a `anon` key (pública)
- ✅ RLS (Row Level Security) está habilitado
- ⚠️ Para produção, configure políticas de RLS adequadas

## 📞 Precisa de Ajuda?

1. Verifique os arquivos de documentação
2. Consulte os comentários no código
3. Veja os exemplos em EXEMPLOS_SQL.md

---

**Versão:** 1.0  
**Última atualização:** 11/11/2025  
**Status:** ✅ Totalmente funcional
