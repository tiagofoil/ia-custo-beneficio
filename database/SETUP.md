# Setup PostgreSQL Database

## 1. Configurar Environment Variables na Vercel

Acesse: https://vercel.com/dashboard → Seu projeto → Settings → Environment Variables

Adicione estas variáveis:

```
DATABASE_URL=postgresql://... (sua connection string do Neon)
ADMIN_SECRET=sua_senha_secreta_aqui
NEXT_PUBLIC_ADMIN_PASSWORD=senha_para_login_admin
```

## 2. Criar Schema no Banco

Execute o script SQL no seu banco Neon:

```bash
# Usando psql ou console do Neon
psql $DATABASE_URL -f database/schema.sql
```

Ou copie e cole o conteúdo de `database/schema.sql` no console SQL do Neon.

## 3. Migrar Dados do JSON (opcional)

Para importar os dados atuais do `models.json`:

```bash
# Instalar dependências primeiro
npm install

# Rodar script de migração (quando criarmos)
npx ts-node scripts/migrate-to-db.ts
```

## 4. Testar

1. Acesse `/admin` no seu site
2. Login com a senha configurada em `NEXT_PUBLIC_ADMIN_PASSWORD`
3. Adicione um modelo de teste
4. Verifique se aparece na lista e no ranking

## Estrutura do Banco

### Tabela: `value.models`
- Dados de todos os LLMs
- Preços, benchmarks, free tier info
- Soft delete (is_active)

### Views:
- `value.rank_unlimited` - Ordenado por SWE-bench
- `value.rank_free` - Modelos gratuitos
- `value.rank_under_10` - Under $10/month
- `value.rank_10_to_20` - $10-$20/month
- `value.rank_under_50` - Under $50/month

## API Endpoints

- `GET /api/models` - Lista modelos (com ?category=free|under10|...)
- `POST /api/models` - Cria/atualiza modelo (requer ADMIN_SECRET)
- `DELETE /api/models?id=xxx` - Remove modelo (soft delete)

## Admin Page

Acesse: `https://value.ai-foil.com/admin`

Funcionalidades:
- Adicionar nova LLM
- Marcar como free tier
- Adicionar benchmarks
- Deletar modelos
