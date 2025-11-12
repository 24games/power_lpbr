# Exemplos de SQL para Gerenciar a Tabela power_lpbr

## 📊 Consultas de Dados

### Ver todos os leads
```sql
SELECT * FROM power_lpbr ORDER BY created_at DESC;
```

### Contar total de leads
```sql
SELECT COUNT(*) as total FROM power_lpbr;
```

### Leads por tag
```sql
SELECT tag, COUNT(*) as quantidade 
FROM power_lpbr 
GROUP BY tag 
ORDER BY quantidade DESC;
```

### Leads por expertise
```sql
SELECT expertise, COUNT(*) as quantidade 
FROM power_lpbr 
GROUP BY expertise 
ORDER BY quantidade DESC;
```

### Leads por faixa de faturamento
```sql
SELECT fat_deposito, COUNT(*) as quantidade 
FROM power_lpbr 
GROUP BY fat_deposito 
ORDER BY quantidade DESC;
```

### Leads dos últimos 7 dias
```sql
SELECT * FROM power_lpbr 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Leads por status
```sql
SELECT status, COUNT(*) as quantidade 
FROM power_lpbr 
GROUP BY status 
ORDER BY quantidade DESC;
```

## ➕ Inserir Dados

### Inserir um novo lead
```sql
INSERT INTO power_lpbr (
  nome, 
  email, 
  telefone, 
  fat_deposito, 
  tag, 
  expertise, 
  status
) VALUES (
  'João Silva',
  'joao.silva@email.com',
  '11987654321',
  'Até 100k',
  'CR10',
  'expert',
  'NOVO'
);
```

### Inserir múltiplos leads
```sql
INSERT INTO power_lpbr (nome, email, telefone, fat_deposito, tag, expertise, status) 
VALUES 
  ('Maria Santos', 'maria@email.com', '21987654321', 'Até 50k', 'CR10', 'expert', 'NOVO'),
  ('Pedro Costa', 'pedro@email.com', '31987654321', '+500k', 'CR17', 'expert', 'CONVERSAS INICIADAS'),
  ('Ana Paula', 'ana@email.com', '41987654321', 'Até 200k', 'CR6', 'expert', 'QUALIFICADO');
```

## ✏️ Atualizar Dados

### Atualizar status de um lead
```sql
UPDATE power_lpbr 
SET status = 'QUALIFICADO' 
WHERE id = 1;
```

### Atualizar múltiplos campos
```sql
UPDATE power_lpbr 
SET 
  status = 'CONVERSAS INICIADAS',
  instagram = '@joaosilva',
  id_trello = '123abc456def'
WHERE email = 'joao.silva@email.com';
```

### Atualizar tag em lote
```sql
UPDATE power_lpbr 
SET tag = 'CR10 | LEVA 2' 
WHERE tag = 'CR10' AND created_at >= '2025-11-01';
```

## 🗑️ Deletar Dados

### Deletar um lead específico
```sql
DELETE FROM power_lpbr WHERE id = 1;
```

### Deletar leads sem email
```sql
DELETE FROM power_lpbr WHERE email IS NULL;
```

### Deletar leads antigos (mais de 1 ano)
```sql
DELETE FROM power_lpbr 
WHERE created_at < NOW() - INTERVAL '1 year';
```

## 📈 Análises Avançadas

### Top 5 tags com maior potencial
```sql
SELECT 
  tag,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN fat_deposito = '+500k' THEN 1 END) as leads_alto_potencial
FROM power_lpbr 
GROUP BY tag 
ORDER BY leads_alto_potencial DESC, total_leads DESC 
LIMIT 5;
```

### Leads por dia da semana
```sql
SELECT 
  TO_CHAR(created_at, 'Day') as dia_semana,
  COUNT(*) as quantidade
FROM power_lpbr 
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY EXTRACT(DOW FROM created_at);
```

### Taxa de conversão por tag (exemplo com status)
```sql
SELECT 
  tag,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'CONVERTIDO' THEN 1 END) as convertidos,
  ROUND(
    COUNT(CASE WHEN status = 'CONVERTIDO' THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) as taxa_conversao
FROM power_lpbr 
GROUP BY tag 
HAVING COUNT(*) > 5
ORDER BY taxa_conversao DESC;
```

### Evolução mensal de leads
```sql
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as mes,
  COUNT(*) as quantidade
FROM power_lpbr 
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY mes DESC;
```

## 🔍 Buscar Dados Específicos

### Buscar por nome (case insensitive)
```sql
SELECT * FROM power_lpbr 
WHERE LOWER(nome) LIKE LOWER('%silva%');
```

### Buscar por email
```sql
SELECT * FROM power_lpbr 
WHERE email = 'joao.silva@email.com';
```

### Buscar por telefone
```sql
SELECT * FROM power_lpbr 
WHERE telefone LIKE '%987654321%';
```

### Leads sem Instagram cadastrado
```sql
SELECT * FROM power_lpbr 
WHERE instagram IS NULL OR instagram = '';
```

## 🛠️ Manutenção

### Verificar duplicatas por email
```sql
SELECT email, COUNT(*) as quantidade 
FROM power_lpbr 
GROUP BY email 
HAVING COUNT(*) > 1;
```

### Limpar campos vazios (converter para NULL)
```sql
UPDATE power_lpbr 
SET instagram = NULL 
WHERE instagram = '';
```

### Padronizar tags (exemplo)
```sql
UPDATE power_lpbr 
SET tag = UPPER(TRIM(tag));
```

## 💡 Dicas

1. **Sempre faça backup antes de DELETE ou UPDATE em massa**
2. **Use WHERE com cuidado para não afetar dados não desejados**
3. **Teste queries SELECT antes de fazer UPDATE/DELETE**
4. **Use transações para operações críticas**
5. **Mantenha índices nas colunas mais consultadas (email, tag, created_at)**

## 🔐 Segurança

- RLS (Row Level Security) está habilitado na tabela
- Configure políticas adequadas para controlar acesso
- Nunca exponha credenciais de admin no frontend
