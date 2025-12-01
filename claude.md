# Quotify - Documentazione Refactoring

## 📋 Panoramica del Progetto

**Quotify** è un'applicazione desktop Electron + React + TypeScript per la gestione di preventivi, clienti e prodotti.

**Stack Tecnologico:**

- Frontend: React + TypeScript + Vite
- Backend: Electron (main process)
- Database: **Better-SQLite3** (attualmente) → **PROSSIMO STEP: Migrazione a Prisma**
- UI: shadcn/ui + TailwindCSS
- State Management: React Hooks personalizzati
- Tables: TanStack React Table
- Validation: Zod
- PDF Generation: Puppeteer (per HTML to PDF)

---

## 🎯 Obiettivi Completati in Questa Sessione

### 1. **Refactoring Completo della Sezione Quotes (Preventivi)**

#### a. Rinominazione da Italiano a Inglese

- ✅ `CreaPreventivo` → `create-quote` (folder)
- ✅ `PreventiviList.tsx` → `quote-list.tsx`
- ✅ `function CreaPreventivo()` → `function CreateQuote()`
- ✅ `function PreventiviList()` → `function QuotesList()`
- ✅ Navigation type: `'preventivi'` → `'quotes'`
- ✅ Navigation type: `'crea-preventivo'` → `'create-quote'`
- ✅ Parametri URL: `clienteId` → `customerId`

#### b. Convenzione Naming Files

**Regola adottata: kebab-case per tutti i file**

```
Prima (PascalCase):
app/pages/CreaPreventivo/
app/pages/PreventiviList.tsx

Dopo (kebab-case):
app/pages/create-quote/
app/pages/quote-list.tsx
```

**Nota:** I componenti rimangono in PascalCase internamente (es. `function CreateQuote()`), solo i **nomi dei file** sono in kebab-case.

---

### 2. **Sistema di Tipi TypeScript**

#### a. Tipo `Customer` (Cliente)

**File:** `app/types/customer.ts`

```typescript
export interface Customer {
  id: number
  businessName: string
  email?: string
  vatNumber?: string
  address?: string
  zipCode?: string
  city?: string
  createdAt?: number
  updatedAt?: number
}
```

**Rinominato da:** `Cliente` → `Customer`

**Motivazione:** "Customer" è più appropriato per il dominio di vendita/preventivi rispetto a "Client".

---

#### b. Tipi Quote (Preventivo)

**File:** `app/types/quote.ts`

**Quote Items (Righe Preventivo):**

```typescript
// Base condiviso tra UI e DB
export interface QuoteItemBase {
  code: string
  measure?: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  lineTotal: number
  discount1: number
  discount2: number
  discount3: number
  netUnitPrice: number
  netLineTotal: number
}

// Item UI (usato durante creazione, prima del salvataggio)
export interface QuoteItemUI extends QuoteItemBase {
  id: string // temporary ID
  productId?: number
}

// Item DB (salvato nel database)
export interface QuoteItemDB extends QuoteItemBase {
  id: number
  quoteId: number
  ordering: number
  productId?: number
  vatRate: number
  vatAmount: number
  createdAt?: number
  updatedAt?: number
}
```

**Quote Document:**

```typescript
// Preventivo completo con oggetti nested
export interface Quote {
  id: number
  number: string
  date: string
  company: CompanyProfile // Nested object
  customer: Customer // Nested object
  subtotal: number
  totalVat: number
  total: number
  notes?: string
  metadata?: string
  status: string
  createdAt?: number
  updatedAt?: number
}

// Preventivo con items
export interface QuoteWithItems extends Quote {
  items: QuoteItemUI[] | QuoteItemDB[]
}

// Config prodotto (per dialog aggiungi/modifica)
export interface ProductConfig {
  quantity: number
  unit: string
  discount1: number
  discount2: number
  discount3: number
}
```

**Importante:**

- `Quote` usa **oggetti nested** (`company`, `customer`) per avere un'API TypeScript pulita
- `Preventivo` (tipo DB) usa **campi denormalizzati** (`clienteBusinessName`, `clienteEmail`, ecc.) per snapshot nel database
- La conversione avviene nel backend quando si salva/carica

---

### 3. **Architettura Hooks (Custom React Hooks)**

#### Pattern Adottato: **Separation of Concerns**

**Ogni funzionalità ha il proprio hook dedicato:**

```
app/hooks/
├── use-create-quote.ts          # Creazione preventivo
├── use-quote-preview.ts          # Anteprima HTML
├── use-send-quote-email.ts       # Invio email
└── use-quotes-list.ts            # Lista preventivi
```

---

#### a. `use-create-quote.ts`

**Responsabilità:** Gestione creazione/modifica preventivo (Step 1)

**State:**

- `quoteId`, `rows`, `quoteNumber`, `quoteDate`, `notes`
- `selectedCustomerId`, `selectedCustomer`
- `selectedProfileId`, `selectedProfile`
- `profiles`, `isSaving`

**Funzioni principali:**

- `saveQuote()` → Salva preventivo e ritorna `QuoteWithItems | null`
- `addRow()`, `updateRow()`, `deleteRow()` → Gestione righe
- `calculateTotals()` → Calcolo subtotale, IVA, totale
- `handleCustomerChange()` → Cambio cliente

**Ritorna:** `QuoteWithItems` quando salva con successo

---

#### b. `use-quote-preview.ts`

**Responsabilità:** Generazione anteprima HTML (Step 2)

**State:**

- `previewHTML`

**Funzioni principali:**

- `generatePreview(quoteData: QuoteWithItems)` → Genera HTML usando `QuoteHTMLDocumentBuilder`
- `clearPreview()` → Pulisce anteprima

---

#### c. `use-send-quote-email.ts`

**Responsabilità:** Gestione invio email (Step 3)

**State:**

- `emailSubject`, `emailBody`, `isSending`

**Funzioni principali:**

- `prepareEmail()` → Genera oggetto/corpo email di default
- `sendEmail()` → Invia email e ritorna `boolean` (success/fail)
- `validateEmail()` → Valida campi (privata)

---

#### d. `use-quotes-list.ts`

**Responsabilità:** Gestione lista preventivi

**State:**

- `quotes`, `loading`
- `deleteDialogOpen`, `quoteToDelete`

**Funzioni principali:**

- `loadQuotes()` → Carica tutti i preventivi
- `handleView()`, `handleEdit()` → Azioni su preventivo (TODO)
- `handleGeneratePDF()` → Genera PDF
- `handleSendEmail()` → Placeholder invio email
- `handleDelete()`, `confirmDelete()` → Eliminazione

---

### 4. **Refactoring DataTables (TanStack React Table)**

#### Pattern Adottato: **Column-based Architecture**

**Ogni colonna in un file separato per massima modularità.**

---

#### a. Quote Items DataTable

**Struttura:**

```
app/data-tables/quote-data-table/
├── index.tsx                     # Componente principale
└── columns/
    ├── code-column.tsx
    ├── description-column.tsx
    ├── unit-column.tsx
    ├── quantity-column.tsx
    ├── unit-price-column.tsx
    ├── line-total-column.tsx
    ├── discounts-column.tsx
    ├── net-unit-price-column.tsx
    ├── net-line-total-column.tsx
    └── actions-column.tsx
```

**Vantaggi:**

- ✅ Ogni colonna è indipendente e riusabile
- ✅ Facile da testare
- ✅ Facile da modificare singolarmente
- ✅ Codice più leggibile

---

#### b. Quotes List DataTable

**Struttura:**

```
app/data-tables/quotes-data-table/
├── index.tsx                     # Componente principale
└── columns/
    ├── number-column.tsx         # Numero preventivo (Badge)
    ├── date-column.tsx           # Data (formato IT)
    ├── customer-column.tsx       # Nome cliente
    ├── total-column.tsx          # Totale (€ EUR)
    ├── status-column.tsx         # Stato (Badge colorato)
    └── actions-column.tsx        # Dropdown menu azioni
```

**Tipo utilizzato:** `Preventivo` (dal database) perché la DataTable accede ai campi denormalizzati (`clienteBusinessName`, `numero`, ecc.)

**Nota importante:** Usiamo ancora `Preventivo` invece di `Quote` perché:

- La lista mostra i dati come tornano dal DB (denormalizzati)
- `Quote` è per quando abbiamo l'oggetto completo con nested objects
- In futuro con Prisma potremmo unificare i tipi

---

### 5. **HTML Generation con Builder Pattern**

**File:** `lib/utils/quote-html-generator/`

**Struttura:**

```
quote-html-generator/
├── index.ts          # Export function generateQuoteHTML()
├── builder.ts        # QuoteHTMLDocumentBuilder class
└── styles.ts         # QUOTE_STYLES (240 linee CSS)
```

#### QuoteHTMLDocumentBuilder

**Pattern:** Builder Pattern con Fluent API

**Esempio utilizzo:**

```typescript
const html = new QuoteHTMLDocumentBuilder(quoteData)
  .withHeader()
  .withParties()
  .withItemsTable()
  .withTotals()
  .withNotes()
  .withFooter()
  .build()
```

**Metodi pubblici (fluent):**

- `withHeader()` → Aggiunge header (numero, data)
- `withParties()` → Aggiunge info azienda/cliente
- `withItemsTable()` → Aggiunge tabella prodotti
- `withTotals()` → Aggiunge totali
- `withNotes()` → Aggiunge note (se presenti)
- `withFooter()` → Aggiunge footer
- `build()` → Ritorna HTML completo

**Metodi privati:**

- `formatCurrency()`, `formatDate()`, `formatDiscount()`
- `generateHeader()`, `generateParties()`, ecc.
- `wrapInHTMLDocument()` → Wrapper HTML

**Vantaggi:**

- ✅ CSS separato in `styles.ts`
- ✅ Builder flessibile (puoi omettere sezioni)
- ✅ Metodi privati incapsulati
- ✅ Testabile
- ✅ Tutti i metodi helper sono metodi privati della classe (no funzioni esterne)

---

### 6. **Navigation System**

**File:** `app/types/navigation.ts`

**PageType aggiornato:**

```typescript
export type PageType =
  | 'dashboard'
  | 'clienti'
  | 'aggiungi-cliente'
  | 'dettaglio-cliente'
  | 'prodotti'
  | 'aggiungi-prodotto'
  | 'importa-prodotti'
  | 'quotes' // ← Rinominato da 'preventivi'
  | 'create-quote' // ← Rinominato da 'crea-preventivo'
  | 'settings'
```

**Sidebar aggiornata:**

```typescript
{
  title: "Preventivi",
  page: "quotes",
  isActive: currentPage === "quotes" || currentPage === "create-quote",
  items: [
    { title: "Tutti i preventivi", page: "quotes" },
    { title: "Crea preventivo", page: "create-quote" }
  ]
}
```

**App.tsx routing aggiornato:**

```typescript
// Import
import QuotesList from "@/app/pages/quote-list"
import CreateQuote from "@/app/pages/create-quote"

// Breadcrumbs
case 'quotes':
  return { section: 'Gestione', page: 'Preventivi' }
case 'create-quote':
  return { section: 'Preventivi', page: 'Crea Preventivo' }

// Rendering
case 'quotes':
  return <QuotesList />
case 'create-quote':
  return <CreateQuote />
```

---

### 7. **Validazione con Zod**

**File:** `app/schemas/quote-schema.ts`

```typescript
export const createQuoteSchema = z
  .object({
    quoteNumber: z.string().min(1, 'Numero preventivo obbligatorio'),
    quoteDate: z.string().min(1, 'Data preventivo obbligatoria'),
    selectedProfileId: z.number({
      required_error: 'Seleziona un profilo aziendale',
    }),
    selectedCustomer: z
      .object({
        id: z.number(),
        businessName: z.string(),
      })
      .nullable(),
    rows: z.array(z.any()).min(1, 'Aggiungi almeno una riga al preventivo'),
  })
  .refine((data) => data.selectedCustomer !== null, {
    message: 'Cliente obbligatorio',
    path: ['selectedCustomer'],
  })
```

**Note:**

- ✅ `selectedClient` → `selectedCustomer`
- ✅ Validazione a livello schema con `.refine()` (non a livello campo)

---

### 8. **Componenti UI Multi-Step**

**File:** `app/pages/create-quote/`

**Struttura:**

```
create-quote/
├── index.tsx              # Orchestrator (usa 3 hooks)
├── step-creation.tsx      # Step 1: Creazione
├── step-preview.tsx       # Step 2: Anteprima
└── step-send-email.tsx    # Step 3: Invio Email
```

**Flow:**

1. **Step 1:** Compila preventivo → `saveQuote()` → Ritorna `QuoteWithItems`
2. **Step 2:** Anteprima → `generatePreview(quoteData)` → Mostra HTML
3. **Step 3:** Invio email → `prepareEmail()` → `sendEmail()` → Redirect

**State management:**

- `currentStep` → Gestito nel componente principale (`create-quote/index.tsx`)
- Ogni step riceve solo le props necessarie
- Hooks gestiscono la logica di business

**Props aggiornate:**

- `selectedCustomerId` (non più `selectedClientId`)
- `onCustomerChange` (non più `onClientChange`)
- Type `Customer` (non più `Cliente`)

---

## 🔄 Architettura Generale

### Flusso Dati: Database → TypeScript → UI

```
┌─────────────────────────────────────────────────────────┐
│ DATABASE (Better-SQLite3)                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Preventivo (denormalized)                           │ │
│ │ - id, numero, data                                  │ │
│ │ - clienteBusinessName, clienteEmail, ...            │ │
│ │ - companyProfileId                                  │ │
│ │ - subtotal, totalVat, total                         │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ BACKEND (window.conveyor.preventivi)                    │
│ - getAll() → Preventivo[]                               │
│ - create() → { success, id }                            │
│ - delete() → { success }                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ FRONTEND HOOKS                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ use-create-quote.ts                                 │ │
│ │ - Converte Preventivo → QuoteWithItems              │ │
│ │ - QuoteWithItems usa nested objects:                │ │
│ │   { company: CompanyProfile, customer: Customer }   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ UI COMPONENTS                                           │
│ - Ricevono QuoteWithItems (TypeScript pulito)           │
│ - DataTable riceve Preventivo (per lista)              │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Convenzioni di Naming Adottate

### File e Folder

| Tipo           | Convenzione | Esempio                                   |
| -------------- | ----------- | ----------------------------------------- |
| **Pages**      | kebab-case  | `create-quote/`, `quote-list.tsx`         |
| **Components** | kebab-case  | `app-sidebar.tsx`, `confirm-dialog.tsx`   |
| **Hooks**      | kebab-case  | `use-create-quote.ts`                     |
| **Types**      | kebab-case  | `customer.ts`, `quote.ts`                 |
| **Utils**      | kebab-case  | `quote-html-generator/`                   |
| **DataTables** | kebab-case  | `quote-data-table/`, `quotes-data-table/` |

### Codice TypeScript

| Tipo           | Convenzione      | Esempio                            |
| -------------- | ---------------- | ---------------------------------- |
| **Interfaces** | PascalCase       | `Customer`, `QuoteWithItems`       |
| **Functions**  | camelCase        | `saveQuote()`, `generatePreview()` |
| **Components** | PascalCase       | `CreateQuote`, `QuotesList`        |
| **Variables**  | camelCase        | `selectedCustomer`, `quoteData`    |
| **Constants**  | UPPER_SNAKE_CASE | `QUOTE_STYLES`                     |

### Naming Semantico

| Concetto          | Nome Usato     | ❌ Evitare            |
| ----------------- | -------------- | --------------------- |
| Cliente           | `customer`     | ~~`client`~~          |
| Preventivo        | `quote`        | ~~`preventivo`~~      |
| Riga preventivo   | `quoteItem`    | ~~`riga`~~            |
| Lista preventivi  | `quotes`       | ~~`preventivi`~~      |
| Creare preventivo | `create-quote` | ~~`crea-preventivo`~~ |

---

## 🔧 Problemi Risolti Durante la Sessione

### 1. Toast Notifications Non Apparivano

**Problema:** Sonner importava `useTheme` da "next-themes" ma l'app è Electron, non Next.js

**Fix:**

```typescript
// Prima (errato)
import { useTheme } from 'next-themes'

// Dopo (corretto)
import { useTheme } from '@/app/context/ThemeContext'
```

---

### 2. Button Bloccato in Loading State

**Problema:** Se `saveQuote()` lanciava eccezione, `setIsSaving(false)` non veniva mai chiamato

**Fix:** Try-catch-finally

```typescript
const saveQuote = async () => {
  setIsSaving(true)
  try {
    // ... logica
  } catch (error) {
    toast.error(...)
  } finally {
    setIsSaving(false)  // ← Sempre chiamato
  }
}
```

---

### 3. Validazione Zod Non Funzionava

**Problema:** `.refine()` su campo `.nullable()` non funzionava

**Fix:** Spostare `.refine()` a livello schema

```typescript
// Prima (non funzionava)
selectedClient: z.object({...}).nullable().refine(...)

// Dopo (funziona)
z.object({
  selectedCustomer: z.object({...}).nullable(),
  // ...
}).refine((data) => data.selectedCustomer !== null, {
  message: "Cliente obbligatorio",
  path: ["selectedCustomer"],
})
```

---

## 📦 Struttura File Finale (Sezione Quotes)

```
app/
├── pages/
│   ├── create-quote/
│   │   ├── index.tsx              # CreateQuote component
│   │   ├── step-creation.tsx
│   │   ├── step-preview.tsx
│   │   └── step-send-email.tsx
│   └── quote-list.tsx             # QuotesList component
│
├── hooks/
│   ├── use-create-quote.ts
│   ├── use-quote-preview.ts
│   ├── use-send-quote-email.ts
│   └── use-quotes-list.ts
│
├── data-tables/
│   ├── quote-data-table/
│   │   ├── index.tsx
│   │   └── columns/
│   │       ├── code-column.tsx
│   │       ├── description-column.tsx
│   │       ├── unit-column.tsx
│   │       ├── quantity-column.tsx
│   │       ├── unit-price-column.tsx
│   │       ├── line-total-column.tsx
│   │       ├── discounts-column.tsx
│   │       ├── net-unit-price-column.tsx
│   │       ├── net-line-total-column.tsx
│   │       └── actions-column.tsx
│   │
│   └── quotes-data-table/
│       ├── index.tsx
│       └── columns/
│           ├── number-column.tsx
│           ├── date-column.tsx
│           ├── customer-column.tsx
│           ├── total-column.tsx
│           ├── status-column.tsx
│           └── actions-column.tsx
│
├── types/
│   ├── customer.ts                # Customer interface
│   ├── quote.ts                   # Quote, QuoteWithItems, QuoteItem*
│   └── preventivo.ts              # Preventivo (DB type)
│
├── schemas/
│   └── quote-schema.ts            # Zod validation
│
└── components/
    └── ui/
        └── sonner.tsx             # Toast notifications (fixed)

lib/
└── utils/
    └── quote-html-generator/
        ├── index.ts               # generateQuoteHTML()
        ├── builder.ts             # QuoteHTMLDocumentBuilder
        └── styles.ts              # QUOTE_STYLES
```

---

## 🎯 PROSSIMI STEP (TODO)

### 1. **Migrazione a Prisma** ⭐ PRIORITÀ MASSIMA

**Obiettivi:**

- ✅ Sostituire Better-SQLite3 con Prisma
- ✅ Creare Prisma schema con tutti i modelli
- ✅ Generare Prisma Client
- ✅ Migrare tutti i metodi `window.conveyor.*` per usare Prisma
- ✅ Mantenere la stessa interfaccia TypeScript (no breaking changes)

**Modelli da creare:**

```prisma
model Customer {
  id           Int      @id @default(autoincrement())
  businessName String
  email        String?
  vatNumber    String?
  address      String?
  zipCode      String?
  city         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  quotes       Quote[]
}

model CompanyProfile {
  id           Int      @id @default(autoincrement())
  profileName  String
  businessName String
  email        String?
  phone        String?
  vatNumber    String?
  address      String?
  zipCode      String?
  city         String?
  isDefault    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  quotes       Quote[]
}

model Product {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  description String
  measure     String?
  price       Float
  unit        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  quoteItems  QuoteItem[]
}

model Quote {
  id                   Int            @id @default(autoincrement())
  number               String         @unique
  date                 DateTime
  companyProfileId     Int
  customerId           Int

  // Denormalized customer data (snapshot)
  customerBusinessName String
  customerEmail        String?
  customerVatNumber    String?
  customerAddress      String?
  customerZipCode      String?
  customerCity         String?

  subtotal             Float
  totalVat             Float
  total                Float
  notes                String?
  metadata             String?
  status               String         @default("draft")

  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  companyProfile       CompanyProfile @relation(fields: [companyProfileId], references: [id])
  customer             Customer       @relation(fields: [customerId], references: [id])
  items                QuoteItem[]

  @@index([customerId])
  @@index([companyProfileId])
  @@index([status])
}

model QuoteItem {
  id            Int      @id @default(autoincrement())
  quoteId       Int
  ordering      Int
  productId     Int?

  code          String
  measure       String?
  description   String
  unit          String
  quantity      Float
  unitPrice     Float
  lineTotal     Float
  discount1     Float    @default(0)
  discount2     Float    @default(0)
  discount3     Float    @default(0)
  netUnitPrice  Float
  netLineTotal  Float
  vatRate       Float
  vatAmount     Float

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  quote         Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  product       Product? @relation(fields: [productId], references: [id])

  @@index([quoteId])
}
```

**Steps per migrazione:**

1. Installare Prisma: `npm install prisma @prisma/client`
2. Inizializzare Prisma: `npx prisma init`
3. Creare schema in `prisma/schema.prisma`
4. Configurare per SQLite: `datasource db { provider = "sqlite" }`
5. Migrare dati esistenti da Better-SQLite3 → Prisma
6. Generare client: `npx prisma generate`
7. Aggiornare `window.conveyor.*` API per usare Prisma Client
8. Testare tutte le funzionalità

**Vantaggi Prisma:**

- ✅ Type-safe queries
- ✅ Migrations automatiche
- ✅ Schema centralizzato
- ✅ Nomi in inglese generati automaticamente

---

### 2. **Refactoring Customers (Clienti)**

**Obiettivi:**

- ✅ Rinominare tutto in inglese
- ✅ File: `ClientiList.tsx` → `customers-list.tsx`
- ✅ Navigation: `'clienti'` → `'customers'`
- ✅ Hook: Creare `use-customers-list.ts`
- ✅ DataTable: Separare colonne in `customers-data-table/columns/`
- ✅ Forms: `AggiungiCliente.tsx` → `create-customer.tsx`
- ✅ Dettaglio: `ClienteDettaglio.tsx` → `customer-detail.tsx`
- ✅ Edit: `ModificaCliente.tsx` → `edit-customer.tsx`
- ✅ Combobox: `ClienteCombobox.tsx` → `CustomerCombobox.tsx`

**Naming:**

```
Prima:                          Dopo:
clienti                    →    customers
aggiungi-cliente           →    create-customer
dettaglio-cliente          →    customer-detail
modifica-cliente           →    edit-customer
ClientiList                →    CustomersList
ClienteCombobox            →    CustomerCombobox
ClientiDataTable           →    CustomersDataTable
```

**DataTable Columns:**

```
customers-data-table/
├── index.tsx
└── columns/
    ├── id-column.tsx
    ├── name-column.tsx
    ├── email-column.tsx
    ├── vat-column.tsx
    ├── city-column.tsx
    └── actions-column.tsx
```

---

### 3. **Refactoring Products (Prodotti)**

**Obiettivi:**

- ✅ Rinominare tutto in inglese
- ✅ File: `ProdottiList.tsx` → `products-list.tsx`
- ✅ Navigation: `'prodotti'` → `'products'`
- ✅ Hook: Creare `use-products-list.ts`
- ✅ DataTable: Separare colonne in `products-data-table/columns/`
- ✅ Forms: `AggiungiProdotto.tsx` → `create-product.tsx`
- ✅ Import: `ImportaProdotti.tsx` → `import-products.tsx`
- ✅ Detail: Creare `product-detail.tsx`

**Naming:**

```
Prima:                          Dopo:
prodotti                   →    products
aggiungi-prodotto          →    create-product
importa-prodotti           →    import-products
dettaglio-prodotto         →    product-detail
ProdottiList               →    ProductsList
ProdottoForm               →    ProductForm
ProdottiDataTable          →    ProductsDataTable
```

**DataTable Columns:**

```
products-data-table/
├── index.tsx
└── columns/
    ├── code-column.tsx
    ├── description-column.tsx
    ├── measure-column.tsx
    ├── price-column.tsx
    ├── unit-column.tsx
    └── actions-column.tsx
```

---

### 4. **Uniformare Tutti i Tipi**

**Problema attuale:**

- Abbiamo `Quote` (TypeScript pulito) e `Preventivo` (DB)
- Abbiamo `Customer` ma `Cliente` è ancora usato in alcuni posti (tipo DB)
- Incongruenza tra tipi frontend e backend

**Obiettivo con Prisma:**
Prisma genererà automaticamente tipi puliti in inglese:

```typescript
// Generati automaticamente da Prisma
;(Customer, Quote, Product, QuoteItem, CompanyProfile)

// No più bisogno di:
;(Cliente, Preventivo, Prodotto, RigaPreventivo)
```

**Strategia:**

1. Creare Prisma schema con nomi inglesi
2. Generare Prisma Client
3. Usare tipi generati ovunque nel frontend
4. Eliminare tipi duplicati

---

### 5. **Implementare Funzionalità Mancanti**

**Quote View/Edit:**

- ✅ `handleView(quote)` → Mostrare dettaglio preventivo
- ✅ `handleEdit(quote)` → Modificare preventivo esistente

**Customer Detail:**

- ✅ Mostrare tutti i preventivi del cliente
- ✅ Grafici/statistiche vendite per cliente

**Dashboard:**

- ✅ Widget ultimi preventivi
- ✅ Statistiche vendite
- ✅ Grafici mensili/annuali
- ✅ Top customers
- ✅ Top products

---

## 🧪 Testing Strategy (Future)

**Unit Tests:**

- ✅ Hooks isolati (use-create-quote, use-quotes-list, ecc.)
- ✅ Utility functions (formatCurrency, calculateTotals, ecc.)
- ✅ Validation schemas (Zod)

**Integration Tests:**

- ✅ API calls (con mock Prisma)
- ✅ Form submissions
- ✅ Data flow completo

**E2E Tests:**

- ✅ Creazione preventivo completa
- ✅ Invio email
- ✅ Generazione PDF

**Tools suggeriti:**

- Vitest (unit/integration)
- Playwright (E2E)
- MSW (API mocking)

---

## 📚 Risorse e Riferimenti

**Documentazione:**

- [Prisma Docs](https://www.prisma.io/docs)
- [TanStack Table](https://tanstack.com/table/latest)
- [Zod Validation](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hooks](https://react.dev/reference/react)

**Patterns applicati:**

- Builder Pattern (QuoteHTMLDocumentBuilder)
- Custom Hooks Pattern (use-_-_.ts)
- Column-based DataTable
- Separation of Concerns
- Single Responsibility Principle

---

## 🎨 Best Practices Adottate

1. **Single Responsibility Principle**
   - Ogni hook ha una responsabilità specifica
   - Ogni componente fa una cosa sola
   - Ogni colonna DataTable è separata

2. **DRY (Don't Repeat Yourself)**
   - Colonne DataTable riusabili
   - Utility functions condivise
   - Hooks riutilizzabili

3. **Type Safety**
   - TypeScript strict mode
   - Zod runtime validation
   - No `any` types (tranne casi eccezionali)
   - Generic types dove appropriato

4. **Clean Code**
   - Naming semantico e consistente
   - Funzioni piccole e focused
   - Commenti solo dove necessario
   - Codice auto-documentante

5. **Modularità**
   - File piccoli e focused
   - Import/export chiari
   - Dependency injection via props
   - Separation of concerns

6. **Hooks Pattern**
   - Logica separata dalla UI
   - Hooks testabili indipendentemente
   - Riutilizzabili in più componenti

---

## 🔐 Note Importanti

### Database

- **Attuale:** Better-SQLite3 con query SQL raw
- **Prossimo:** Prisma ORM con type-safe queries
- **Migrazione:** Mantenere backward compatibility durante la transizione

### Tipi

- `Quote` vs `Preventivo`: Quote è TypeScript clean, Preventivo è DB denormalized
- `Customer` vs `Cliente`: Customer è il nuovo standard
- Denormalizzazione nel DB è OK per snapshot data (preserva dati cliente anche se eliminato)

### API Backend

- `window.conveyor.*` è l'interfaccia attuale
- Con Prisma: mantenere stessa interfaccia, cambiare implementazione
- Tutti i metodi ritornano `{ success: boolean, error?: string, data?: T }`

### Naming Files

- **Regola ferrea:** kebab-case per tutti i file
- Componenti: `customer-list.tsx`, `create-quote.tsx`
- Hooks: `use-create-quote.ts`, `use-customers-list.ts`
- Types: `customer.ts`, `quote.ts`
- Utils: `quote-html-generator/`

### Navigation

- Tutti i page types in inglese: `'quotes'`, `'customers'`, `'products'`
- URL parameters in inglese: `customerId`, `quoteId`, `productId`
- Sidebar items in italiano (per ora) ma page types in inglese

---

## ✅ Checklist Completamento Sessione

- [x] Refactoring completo sezione Quotes
- [x] Tutti i file rinominati in kebab-case
- [x] Tutti i tipi in inglese (Quote, Customer, QuoteItem)
- [x] Hooks separati per ogni responsabilità
- [x] DataTables con architettura column-based
- [x] Builder Pattern per HTML generation con metodi privati
- [x] Navigation system aggiornato
- [x] Validazione Zod funzionante
- [x] Bug fixing (toast, loading state, validation)
- [x] Documentazione completa scritta

---

## 🚀 Quick Start per Prossima Sessione

1. **Leggere questo documento**
2. **Priorità 1:** Iniziare migrazione a Prisma
   - Installare Prisma
   - Creare schema
   - Migrare dati esistenti
   - Aggiornare API backend
3. **Priorità 2:** Refactoring Customers seguendo stesso pattern Quotes
   - Rinominare file in kebab-case
   - Creare hook use-customers-list
   - Separare DataTable in colonne
4. **Priorità 3:** Refactoring Products
5. **Obiettivo finale:** Applicazione completamente in inglese con Prisma

---

## 📊 Metriche del Refactoring

### Riduzione Codice

- `quote-list.tsx`: ~158 linee → ~75 linee (52% riduzione)
- `create-quote/index.tsx`: ~250 linee → ~100 linee (60% riduzione)

### Modularità

- Prima: 1 file monolitico DataTable (~265 linee)
- Dopo: 1 index + 10 file colonne (~30 linee ciascuno)

### Hooks Creati

- `use-create-quote.ts` (300 linee)
- `use-quote-preview.ts` (25 linee)
- `use-send-quote-email.ts` (115 linee)
- `use-quotes-list.ts` (115 linee)

### Tipi Creati/Refactorizzati

- `Customer` (nuovo)
- `Quote`, `QuoteWithItems` (refactored)
- `QuoteItemUI`, `QuoteItemDB`, `QuoteItemBase` (nuovi)
- `ProductConfig` (nuovo)

---

**Ultima modifica:** 3 Novembre 2025
**Versione:** 2.0
**Autore:** Claude + Pasquale
**Sessione:** Refactoring Quotes Section + Preparation for Prisma Migration
