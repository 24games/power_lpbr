# 🔐 Políticas RLS (Row Level Security) - Tabela power_lpbr

## ✅ Políticas Configuradas

As seguintes políticas foram aplicadas à tabela `power_lpbr` para permitir acesso público:

### 1. **Enable read access for all users** (SELECT)
- **Permissão:** Leitura (SELECT)
- **Quem pode:** Todos os usuários (incluindo anônimos)
- **Condição:** Sempre permitido (`true`)
- **Uso:** Permite que o dashboard leia os dados sem autenticação

### 2. **Enable insert access for all users** (INSERT)
- **Permissão:** Inserção (INSERT)
- **Quem pode:** Todos os usuários (incluindo anônimos)
- **Condição:** Sempre permitido (`true`)
- **Uso:** Permite adicionar novos leads via API

### 3. **Enable update access for all users** (UPDATE)
- **Permissão:** Atualização (UPDATE)
- **Quem pode:** Todos os usuários (incluindo anônimos)
- **Condição:** Sempre permitido (`true`)
- **Uso:** Permite editar leads existentes

### 4. **Enable delete access for all users** (DELETE)
- **Permissão:** Exclusão (DELETE)
- **Quem pode:** Todos os usuários (incluindo anônimos)
- **Condição:** Sempre permitido (`true`)
- **Uso:** Permite deletar leads

## 🚨 Importante - Segurança

### ⚠️ Configuração Atual: ACESSO PÚBLICO TOTAL

As políticas atuais permitem **acesso completo** (leitura, escrita, atualização e exclusão) para **qualquer pessoa**, incluindo usuários não autenticados.

**Isso é adequado para:**
- ✅ Desenvolvimento e testes
- ✅ Dashboards internos em rede privada
- ✅ Aplicações onde os dados não são sensíveis

**NÃO é adequado para:**
- ❌ Produção com dados sensíveis
- ❌ Aplicações públicas na internet
- ❌ Ambientes onde você precisa rastrear quem fez alterações

## 🔒 Recomendações para Produção

### Opção 1: Apenas Leitura Pública
Se você quer que todos possam **ver** mas apenas admins possam **modificar**:

```sql
-- Remover políticas de escrita pública
DROP POLICY "Enable insert access for all users" ON power_lpbr;
DROP POLICY "Enable update access for all users" ON power_lpbr;
DROP POLICY "Enable delete access for all users" ON power_lpbr;

-- Manter apenas leitura pública
-- (A política "Enable read access for all users" já existe)

-- Adicionar políticas para usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON power_lpbr
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON power_lpbr
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON power_lpbr
FOR DELETE
TO authenticated
USING (true);
```

### Opção 2: Acesso Baseado em Função (Role)
Se você tem diferentes tipos de usuários (admin, editor, viewer):

```sql
-- Remover todas as políticas públicas
DROP POLICY "Enable read access for all users" ON power_lpbr;
DROP POLICY "Enable insert access for all users" ON power_lpbr;
DROP POLICY "Enable update access for all users" ON power_lpbr;
DROP POLICY "Enable delete access for all users" ON power_lpbr;

-- Leitura para todos autenticados
CREATE POLICY "Authenticated users can read" ON power_lpbr
FOR SELECT
TO authenticated
USING (true);

-- Escrita apenas para admins
CREATE POLICY "Only admins can insert" ON power_lpbr
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Only admins can update" ON power_lpbr
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete" ON power_lpbr
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

### Opção 3: Acesso por Usuário Específico
Se cada lead pertence a um usuário:

```sql
-- Adicionar coluna user_id (se não existir)
ALTER TABLE power_lpbr ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Políticas baseadas em propriedade
CREATE POLICY "Users can read their own leads" ON power_lpbr
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads" ON power_lpbr
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON power_lpbr
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON power_lpbr
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## 🔍 Verificar Políticas Atuais

Para ver as políticas configuradas:

```sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'power_lpbr'
ORDER BY cmd;
```

## 🛠️ Gerenciar Políticas

### Remover uma Política
```sql
DROP POLICY "nome_da_politica" ON power_lpbr;
```

### Desabilitar RLS Temporariamente (NÃO RECOMENDADO)
```sql
ALTER TABLE power_lpbr DISABLE ROW LEVEL SECURITY;
```

### Reabilitar RLS
```sql
ALTER TABLE power_lpbr ENABLE ROW LEVEL SECURITY;
```

## 📊 Status Atual

```
Tabela: power_lpbr
RLS: ✅ HABILITADO
Políticas Ativas: 4

┌─────────┬──────────────────────────────────────┐
│ Comando │ Política                             │
├─────────┼──────────────────────────────────────┤
│ SELECT  │ Enable read access for all users     │
│ INSERT  │ Enable insert access for all users   │
│ UPDATE  │ Enable update access for all users   │
│ DELETE  │ Enable delete access for all users   │
└─────────┴──────────────────────────────────────┘

Acesso: 🌐 PÚBLICO (anon + authenticated)
```

## 🎯 Próximos Passos Recomendados

1. **Para Desenvolvimento:** Manter configuração atual ✅
2. **Para Produção:** Implementar uma das opções de segurança acima
3. **Adicionar Autenticação:** Configurar Supabase Auth no frontend
4. **Auditoria:** Adicionar tabela de logs para rastrear alterações
5. **Backup:** Configurar backups automáticos no Supabase

## 📝 Notas

- As políticas RLS são avaliadas **antes** de qualquer operação no banco
- Políticas com `USING (true)` permitem acesso irrestrito
- Políticas podem ser combinadas (múltiplas políticas para o mesmo comando)
- Use `TO authenticated` para exigir login
- Use `TO anon` para usuários não autenticados
- Use `TO public` para ambos (padrão)

## 🔗 Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

---

**Última atualização:** 11/11/2025  
**Status:** ✅ Políticas configuradas e funcionando  
**Ambiente:** Desenvolvimento (acesso público)
