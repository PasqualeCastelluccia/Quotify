# Prisma Setup Guide for Quotify

This guide explains how Prisma has been integrated into your Electron app and how to use it.

## ✅ What Has Been Done

1. **Configured Prisma for SQLite** instead of PostgreSQL (perfect for desktop apps)
2. **Created Prisma Schema** that matches your existing database structure
3. **Generated Prisma Client** with TypeScript support
4. **Created migration system** for production use
5. **Updated build scripts** to include Prisma generation

## 📂 Project Structure

```
prisma/
├── schema.prisma           # Your database schema
├── migrations/             # Migration history
│   └── 20251104161825_init_baseline/  # Initial baseline migration
└── ...

lib/database/
├── db.ts                   # Old better-sqlite3 connection (to be replaced)
├── prisma.ts               # New Prisma Client initialization
└── migrations.ts           # Production migration runner

.env                        # DATABASE_URL configuration
```

## 🚀 How to Use Prisma

### Development

1. **Start development**:

   ```bash
   npm run dev
   ```

2. **Create new migrations** (when you modify the schema):

   ```bash
   npm run prisma:migrate
   ```

3. **Open Prisma Studio** (database GUI):
   ```bash
   npm run prisma:studio
   ```

### Using Prisma Client in Code

Instead of using `db` from `better-sqlite3`, import `prisma`:

```typescript
// OLD WAY (better-sqlite3)
import { db } from '@/lib/database/db'

// NEW WAY (Prisma)
import { prisma } from '@/lib/database/prisma'

// Example: Get all customers
const customers = await prisma.cliente.findMany()

// Example: Create a new customer
const newCustomer = await prisma.cliente.create({
  data: {
    businessName: 'Test Company',
    email: 'test@example.com',
    vatNumber: '12345678901',
  },
})

// Example: Update a customer
await prisma.cliente.update({
  where: { id: 1 },
  data: { email: 'newemail@example.com' },
})

// Example: Delete a customer
await prisma.cliente.delete({
  where: { id: 1 },
})
```

## 🔄 Migration Strategy

### For Development

When you make changes to `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

This will:

1. Create a new migration
2. Apply it to your local database
3. Update the Prisma Client

### For Your Client's Existing Database

Your client already has a database with data. Here's how to handle it:

1. **First time setup** (when deploying the new version):
   - The baseline migration (`20251104161825_init_baseline`) will be marked as "already applied"
   - Use this command to mark it as applied without running it:

   ```bash
   npx prisma migrate resolve --applied 20251104161825_init_baseline
   ```

2. **Future updates**:
   - New migrations will be applied automatically when the app starts
   - The `lib/database/migrations.ts` file handles this

### For Production (.exe)

Migrations are **automatically applied** when the app starts in production mode. The system:

1. Checks for pending migrations
2. Applies them to the user's database
3. Preserves all existing data

## 🔧 Configuration

### Environment Variables

**Development** (`.env`):

```env
DATABASE_URL="file:./dev.db"
```

**Production** (automatic):
The app automatically uses: `userData/quotify.db`

### Database Location

- **Development**: `./dev.db` (in project root)
- **Production**: `~/.config/quotify/quotify.db` (or equivalent on Windows/Mac)

## 📝 Schema Models

Your Prisma schema includes:

- `Cliente` - Customers (`clienti` table)
- `Prodotto` - Products (`prodotti` table)
- `CompanyProfile` - Company profiles (`company_profiles` table)
- `Preventivo` - Quotes (`preventivi` table)
- `PreventivoItem` - Quote items (`preventivi_items` table)

## 🌐 Translating to English (Future)

Currently, the database uses Italian names (e.g., `clienti`, `preventivi`). To translate to English:

1. Update the schema models and `@@map()` directives
2. Create a migration with rename statements
3. Apply the migration

This can be done later without data loss.

## ⚡ Key Benefits

1. **Type Safety**: Full TypeScript support with auto-completion
2. **Migrations**: Track and version database changes
3. **Developer Experience**: Prisma Studio for easy data management
4. **Production Ready**: Automatic migration deployment
5. **No Breaking Changes**: Works alongside existing better-sqlite3 code

## 🔗 Useful Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# View/edit database in browser
npm run prisma:studio

# Format the schema file
npx prisma format

# Validate the schema
npx prisma validate

# Pull schema from existing database
npx prisma db pull

# Push schema without creating migration
npx prisma db push
```

## 📚 Next Steps

1. **Gradually migrate** from better-sqlite3 to Prisma
2. **Update IPC handlers** to use Prisma Client
3. **Test thoroughly** in development
4. **Create a migration** for English translation (if desired)
5. **Deploy** with confidence knowing data is preserved

## 🐛 Troubleshooting

**Problem**: "Prisma Client not found"

```bash
npm run prisma:generate
```

**Problem**: Migration fails in production

- Check logs in the app console
- Verify the migration files are included in the build

**Problem**: Database locked

- Close Prisma Studio
- Restart the app

## 📖 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
