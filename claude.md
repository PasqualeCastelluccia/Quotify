# Quotify - Documentazione Applicazione

## Panoramica

**Quotify** è un'applicazione desktop multipiattaforma costruita con Electron e React per la gestione di clienti, prodotti e preventivi. Permette di creare, gestire e inviare preventivi in modo semplice ed efficiente.

## Use Case Principale

L'applicazione è progettata per:
1. **Gestire Clienti** - Registrare e mantenere un database di clienti con tutte le informazioni necessarie
2. **Gestire Prodotti** - Catalogare prodotti/servizi con prezzi e descrizioni
3. **Creare Preventivi** - Dashboard per assemblare preventivi selezionando clienti e prodotti
4. **Inviare Preventivi** - Generare e inviare preventivi ai clienti (PDF, email, ecc.)

---

## Stack Tecnologico

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| **Electron** | v37.3.1 | Framework desktop multipiattaforma |
| **React** | v19.1.1 | UI library per l'interfaccia utente |
| **TypeScript** | v5.9.2 | Type safety e migliore developer experience |
| **Vite** | v7.1.3 | Build tool ultra-veloce con hot reload |
| **Shadcn UI** | latest | Component library moderna e accessibile |
| **TailwindCSS** | v4.1.12 | Framework CSS utility-first |
| **Zod** | v4.1.3 | Validazione runtime degli schema |
| **Framer Motion** | v12.23.12 | Animazioni fluide |
| **Lucide React** | v0.541.0 | Icon library |

---

## Architettura dell'Applicazione

### 1. Main Process (Electron)

**Location**: `lib/main/`

Il processo principale di Electron che gestisce:
- Lifecycle dell'applicazione
- Creazione e gestione delle finestre
- Accesso alle API native del sistema operativo
- Registrazione degli handler IPC

#### File Principali:

**`lib/main/main.ts`** - Entry point
```typescript
- app.whenReady() → Inizializza l'app
- createAppWindow() → Crea la finestra principale
- Gestisce eventi: 'activate', 'window-all-closed'
```

**`lib/main/app.ts`** - Configurazione finestra
```typescript
BrowserWindow {
  width: 1200,
  height: 800,
  title: 'Quotify',
  frame: true,              // Barra titolo nativa
  backgroundColor: '#1c1c1c',
  icon: appIcon,
  webPreferences: {
    preload: preload.js,
    sandbox: false
  }
}
```

**`lib/main/shared.ts`** - Helper IPC
```typescript
handle<T>(channel: T, handler: Function)
- Registra handler IPC con validazione Zod
- Gestisce errori automaticamente
- Type-safe con TypeScript
```

**`lib/main/protocols.ts`** - Protocolli custom
- Registra protocollo `res://` per accesso risorse locali

---

### 2. Preload Script (Security Bridge)

**Location**: `lib/preload/`

Script che crea un ponte sicuro tra renderer e main process.

**`lib/preload/preload.ts`**
```typescript
- Usa contextBridge per esporre API sicure
- Espone window.conveyor al renderer
- Implementa context isolation per sicurezza
```

**`lib/preload/shared.ts`** - ConveyorApi base class
```typescript
abstract class ConveyorApi {
  invoke<T>(channel: T, ...args): Promise<Return<T>>
  - Wrapper type-safe per IPC calls
}
```

---

### 3. Conveyor - Sistema IPC Type-Safe

**Location**: `lib/conveyor/`

Sistema di comunicazione Inter-Process con validazione runtime e type safety.

#### Struttura:

```
lib/conveyor/
├── api/
│   ├── index.ts          # Esporta conveyor API
│   ├── app-api.ts        # API per operazioni app
│   └── window-api.ts     # API per operazioni finestra
├── handlers/
│   ├── app-handler.ts    # Implementa logica app
│   └── window-handler.ts # Implementa logica finestra
├── schemas/
│   ├── index.ts          # Esporta tutti gli schema
│   ├── app-schema.ts     # Schema Zod per app IPC
│   └── window-schema.ts  # Schema Zod per window IPC
├── conveyor.d.ts         # Type definitions
└── README.md             # Documentazione Conveyor
```

#### API Disponibili:

**App API** (`conveyor.app.*`)
- `version()` - Restituisce versione app

**Window API** (`conveyor.window.*`)
- `windowInit()` - Inizializza stato finestra
- `windowMinimize()` - Minimizza finestra
- `windowMaximize()` - Massimizza finestra
- `windowClose()` - Chiude finestra
- `windowMaximizeToggle()` - Toggle maximized state
- `webUndo()`, `webRedo()`, `webCut()`, `webCopy()`, `webPaste()`, `webDelete()`, `webSelectAll()`
- `webReload()`, `webForceReload()`
- `webToggleDevtools()` - Toggle developer tools
- `webActualSize()`, `webZoomIn()`, `webZoomOut()`
- `webToggleFullscreen()`
- `webOpenUrl(url: string)` - Apre URL nel browser esterno

#### Utilizzo in React:

```tsx
import { useConveyor } from '@/app/hooks/use-conveyor'

function MyComponent() {
  // Metodo 1: Hook con destructuring
  const { version } = useConveyor('app')
  const { windowMinimize } = useConveyor('window')

  // Metodo 2: Hook con oggetto completo
  const conveyor = useConveyor()
  await conveyor.app.version()

  // Metodo 3: Global window object
  await window.conveyor.app.version()
}
```

#### Come Aggiungere Nuovi IPC Methods:

1. **Definire Schema** in `lib/conveyor/schemas/app-schema.ts`
```typescript
export const appIpcSchema = {
  'get-clients': {
    args: z.tuple([]),
    return: z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string()
    }))
  }
}
```

2. **Aggiungere API Method** in `lib/conveyor/api/app-api.ts`
```typescript
export class AppApi extends ConveyorApi {
  getClients = () => this.invoke('get-clients')
}
```

3. **Implementare Handler** in `lib/conveyor/handlers/app-handler.ts`
```typescript
handle('get-clients', async () => {
  // Logica per recuperare clienti dal database
  return clients
})
```

4. **Registrare Handler** in `lib/main/app.ts`
```typescript
registerAppHandlers(app)
```

---

### 4. Renderer Process (React App)

**Location**: `app/`

Applicazione React che gira nella finestra del browser.

#### Struttura:

```
app/
├── renderer.tsx          # Entry point React
├── app.tsx              # Componente principale
├── index.html           # HTML template
├── index.d.ts           # Type definitions globali
├── components/
│   ├── app-sidebar.tsx      # Sidebar principale
│   ├── nav-main.tsx         # Navigazione principale
│   ├── nav-user.tsx         # Profilo utente
│   ├── team-switcher.tsx    # Switcher team/aziende
│   ├── ErrorBoundary.tsx    # Error boundary React
│   ├── ui/                  # Componenti Shadcn UI
│   ├── welcome/             # Welcome kit con animazioni
│   └── window/              # Componenti finestra custom
├── hooks/
│   └── use-conveyor.ts      # Hook per IPC calls
├── styles/
│   ├── globals.css          # Stili globali TailwindCSS
│   ├── app.css             # Stili app
│   └── window.css          # Stili finestra
└── assets/
    └── era-preview.png      # Preview immagine
```

#### Componente Principale (`app/app.tsx`)

```tsx
<SidebarProvider>
  <AppSidebar />           {/* Sidebar con navigazione */}
  <SidebarInset>
    <header>               {/* Header con breadcrumb */}
      <SidebarTrigger />
      <Breadcrumb />
    </header>
    <main>                 {/* Area contenuto principale */}
      {/* Qui va il contenuto delle pagine */}
    </main>
  </SidebarInset>
</SidebarProvider>
```

#### Sidebar Navigation (`app/components/app-sidebar.tsx`)

Struttura attuale (dati di esempio):

```typescript
const data = {
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" }
  ],
  navMain: [
    { title: "Dashboard", url: "#", icon: Home, isActive: true },
    { title: "Preventivi", url: "#", icon: FileText },
    {
      title: "Clienti",
      url: "#",
      icon: Users,
      items: [
        { title: "Aggiungi cliente", url: "#" }
      ]
    }
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  }
}
```

**Struttura da implementare**:
```typescript
navMain: [
  { title: "Dashboard", icon: Home },
  {
    title: "Clienti",
    icon: Users,
    items: [
      { title: "Lista clienti" },
      { title: "Aggiungi cliente" }
    ]
  },
  {
    title: "Prodotti",
    icon: Package,
    items: [
      { title: "Lista prodotti" },
      { title: "Aggiungi prodotto" }
    ]
  },
  {
    title: "Preventivi",
    icon: FileText,
    items: [
      { title: "Lista preventivi" },
      { title: "Crea preventivo" },
      { title: "Invia preventivo" }
    ]
  },
  { title: "Impostazioni", icon: Settings }
]
```

---

### 5. Hooks Personalizzati

**Location**: `app/hooks/` e `lib/hooks/`

**`app/hooks/use-conveyor.ts`** - Hook per IPC calls
```typescript
// Uso per una specifica API
const { version } = useConveyor('app')

// Uso per tutte le API
const conveyor = useConveyor()
```

**`lib/hooks/use-mobile.ts`** - Hook per rilevare mobile
```typescript
const isMobile = useMobile()
```

---

### 6. Styling System

**Location**: `app/styles/`

#### TailwindCSS v4 Configuration

**`app/styles/globals.css`**

- **CSS Variables** per theming (light/dark mode)
- **Sidebar Variables** per componenti sidebar
- **Color Tokens**: background, foreground, primary, secondary, muted, accent, destructive, border, input, ring
- **Chart Colors**: chart-1 a chart-5
- **Radius Variables**: lg, md, sm

```css
:root {
  --background: neutral-50;
  --foreground: neutral-900;
  --primary: hsl(0 0% 9%);
  --radius: 0.5rem;
  /* ... */
}

.dark {
  --background: neutral-950;
  --foreground: neutral-100;
  /* ... */
}
```

#### Componenti UI (Shadcn)

**Location**: `app/components/ui/`

Componenti disponibili:
- `avatar.tsx` - Avatar utente
- `badge.tsx` - Badge/Tag
- `breadcrumb.tsx` - Breadcrumb navigation
- `button.tsx` - Button variants
- `collapsible.tsx` - Collapsible panels
- `dropdown-menu.tsx` - Dropdown menus
- `input.tsx` - Input fields
- `separator.tsx` - Separatori visivi
- `sheet.tsx` - Sheet/drawer panels
- `sidebar.tsx` - Sidebar components
- `skeleton.tsx` - Loading skeletons
- `switch.tsx` - Toggle switch
- `table.tsx` - Tabelle dati
- `tooltip.tsx` - Tooltip

Tutti i componenti usano:
- **Class Variance Authority** per variants
- **Radix UI** come base headless
- **TailwindCSS** per styling
- **TypeScript** per type safety

---

### 7. Path Aliases

Configurati in `tsconfig.json` e `electron.vite.config.ts`:

```typescript
{
  "@/*": ["./*"],
  "@/app/*": ["./app/*"],
  "@/lib/*": ["./lib/*"],
  "@/resources/*": ["./resources/*"]
}
```

**Uso**:
```typescript
// ❌ Evitare
import { Button } from '../../../components/ui/button'

// ✅ Preferire
import { Button } from '@/app/components/ui/button'
import { conveyor } from '@/lib/conveyor/api'
import appIcon from '@/resources/build/icon.png'
```

---

## Database e Persistenza Dati

### Opzioni Consigliate:

1. **SQLite** (Consigliato per iniziare)
   - Leggero e embedded
   - Nessun server esterno
   - Library: `better-sqlite3` o `sqlite3`
   - ORM: `Drizzle ORM` o `Prisma`

2. **Electron Store** (Per dati semplici)
   - Key-value store
   - JSON based
   - Library: `electron-store`

3. **PostgreSQL / MySQL** (Per scalabilità futura)
   - Server esterno
   - ORM: `Prisma` o `TypeORM`

### Schema Database Proposto:

```sql
-- Tabella Clienti
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  vat_number TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prodotti
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  unit TEXT DEFAULT 'pz',
  category TEXT,
  sku TEXT UNIQUE,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Preventivi
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  client_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  expiry_date DATE,
  status TEXT DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  total REAL NOT NULL,
  notes TEXT,
  terms TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabella Righe Preventivo
CREATE TABLE quote_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,
  product_id TEXT,
  description TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  total REAL NOT NULL,
  position INTEGER,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabella Impostazioni App
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Features da Implementare

### 1. Gestione Clienti

**Pages**:
- `/clienti` - Lista clienti con tabella, ricerca, filtri
- `/clienti/nuovo` - Form aggiunta cliente
- `/clienti/:id` - Dettaglio e modifica cliente

**Functionalità**:
- CRUD clienti
- Import/Export CSV
- Ricerca e filtri
- Validazione dati (email, VAT, ecc.)

**IPC Methods da aggiungere**:
```typescript
'get-clients' → Client[]
'get-client' → Client
'create-client' → Client
'update-client' → Client
'delete-client' → boolean
'import-clients' → { success: number, errors: Error[] }
'export-clients' → string (file path)
```

---

### 2. Gestione Prodotti

**Pages**:
- `/prodotti` - Lista prodotti con tabella
- `/prodotti/nuovo` - Form aggiunta prodotto
- `/prodotti/:id` - Dettaglio e modifica prodotto

**Functionalità**:
- CRUD prodotti
- Categorie prodotti
- Gestione prezzi
- Import/Export

**IPC Methods da aggiungere**:
```typescript
'get-products' → Product[]
'get-product' → Product
'create-product' → Product
'update-product' → Product
'delete-product' → boolean
'get-categories' → string[]
```

---

### 3. Dashboard Preventivi

**Pages**:
- `/dashboard` - Overview preventivi (statistiche, grafici)
- `/preventivi` - Lista preventivi
- `/preventivi/nuovo` - Creazione preventivo
- `/preventivi/:id` - Dettaglio preventivo
- `/preventivi/:id/edit` - Modifica preventivo

**Functionalità**:
- Creazione preventivo:
  - Selezione cliente
  - Aggiunta righe (da catalogo o custom)
  - Calcolo automatico totali
  - Sconti e tasse
  - Note e termini
- Generazione PDF
- Invio email
- Stati preventivo (bozza, inviato, accettato, rifiutato)
- Conversione preventivo in fattura (opzionale)

**IPC Methods da aggiungere**:
```typescript
'get-quotes' → Quote[]
'get-quote' → Quote
'create-quote' → Quote
'update-quote' → Quote
'delete-quote' → boolean
'generate-quote-pdf' → { path: string }
'send-quote-email' → boolean
'get-quote-statistics' → Statistics
```

---

### 4. Impostazioni

**Pages**:
- `/impostazioni` - Configurazione app

**Functionalità**:
- Dati azienda (logo, nome, indirizzo, P.IVA)
- Template preventivo
- Impostazioni email (SMTP)
- Numerazione automatica preventivi
- Backup/Restore database

**IPC Methods da aggiungere**:
```typescript
'get-settings' → Settings
'update-settings' → Settings
'backup-database' → string (file path)
'restore-database' → boolean
```

---

## Routing

### Opzione 1: React Router (Consigliato)

```bash
npm install react-router-dom
```

```tsx
// app/router.tsx
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'clienti', element: <ClientList /> },
      { path: 'clienti/nuovo', element: <ClientForm /> },
      { path: 'clienti/:id', element: <ClientDetail /> },
      { path: 'prodotti', element: <ProductList /> },
      { path: 'prodotti/nuovo', element: <ProductForm /> },
      { path: 'preventivi', element: <QuoteList /> },
      { path: 'preventivi/nuovo', element: <QuoteForm /> },
      { path: 'preventivi/:id', element: <QuoteDetail /> },
      { path: 'impostazioni', element: <Settings /> }
    ]
  }
])
```

### Opzione 2: State-based Navigation (Semplice)

```tsx
const [currentPage, setCurrentPage] = useState('dashboard')

const renderPage = () => {
  switch(currentPage) {
    case 'dashboard': return <Dashboard />
    case 'clients': return <ClientList />
    // ...
  }
}
```

---

## State Management

### Opzione 1: React Context (Semplice, built-in)

```tsx
// lib/context/AppContext.tsx
const AppContext = createContext<AppState>(defaultState)

export function AppProvider({ children }) {
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])

  return (
    <AppContext.Provider value={{ clients, products, quotes }}>
      {children}
    </AppContext.Provider>
  )
}
```

### Opzione 2: Zustand (Consigliato per complessità media)

```typescript
import { create } from 'zustand'

const useStore = create((set) => ({
  clients: [],
  addClient: (client) => set((state) => ({
    clients: [...state.clients, client]
  }))
}))
```

### Opzione 3: Redux Toolkit (Per app complesse)

---

## PDF Generation

### Library Consigliate:

1. **PDFKit** - Generazione PDF programmatica
2. **Puppeteer** - HTML to PDF (headless Chrome)
3. **jsPDF** - Lightweight PDF generation
4. **React-PDF** - React components to PDF

### Esempio con PDFKit:

```typescript
// lib/main/pdf-generator.ts
import PDFDocument from 'pdfkit'

export function generateQuotePDF(quote: Quote, client: Client) {
  const doc = new PDFDocument()

  // Header
  doc.fontSize(20).text('PREVENTIVO', { align: 'center' })
  doc.fontSize(12).text(`N. ${quote.quote_number}`)

  // Client info
  doc.text(`Cliente: ${client.name}`)
  doc.text(`Email: ${client.email}`)

  // Items table
  quote.items.forEach(item => {
    doc.text(`${item.description} - ${item.quantity} x ${item.unit_price}€`)
  })

  // Total
  doc.fontSize(14).text(`TOTALE: ${quote.total}€`, { align: 'right' })

  return doc
}
```

---

## Email Sending

### Library: Nodemailer

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'user@example.com',
    pass: 'password'
  }
})

export async function sendQuoteEmail(
  to: string,
  quote: Quote,
  pdfPath: string
) {
  await transporter.sendMail({
    from: 'noreply@quotify.com',
    to,
    subject: `Preventivo N. ${quote.quote_number}`,
    text: `In allegato il preventivo richiesto.`,
    attachments: [{ path: pdfPath }]
  })
}
```

---

## Scripts NPM

```json
{
  "scripts": {
    "dev": "electron-vite dev -w",          // Development con hot reload
    "start": "electron-vite preview",       // Preview build
    "format": "prettier --write .",         // Format codice
    "lint": "eslint . --ext .ts,.tsx --fix", // Lint codice
    "vite:build:app": "electron-vite build", // Build app
    "build:win": "npm run vite:build:app && electron-builder --win",
    "build:mac": "npm run vite:build:app && electron-builder --mac",
    "build:linux": "npm run vite:build:app && electron-builder --linux"
  }
}
```

---

## Build & Distribuzione

### Electron Builder Config

**File**: `electron-builder.yml`

Configurazione per packaging e distribuzione:
- Windows: `.exe`, `.msi`
- macOS: `.dmg`, `.app`
- Linux: `.AppImage`, `.deb`, `.rpm`

---

## Best Practices

### 1. Security
- ✅ Context isolation abilitato
- ✅ Node integration disabilitato nel renderer
- ✅ Preload script per esporre API sicure
- ✅ Validazione input con Zod
- ⚠️ Sanitizzare input utente
- ⚠️ Non esporre credenziali sensibili nel renderer

### 2. Performance
- ✅ Lazy loading componenti
- ✅ Virtualizzazione liste lunghe
- ✅ Debounce su ricerche
- ✅ Memoization con `useMemo`/`useCallback`

### 3. Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configurati
- ✅ Error boundaries per gestione errori
- ✅ Path aliases per import puliti

### 4. Testing (da implementare)
- Unit tests: Vitest
- Integration tests: React Testing Library
- E2E tests: Playwright

---

## Struttura File Completa

```
electron-react-app/
├── app/                          # Renderer Process (React)
│   ├── components/
│   │   ├── ui/                   # Shadcn components
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-user.tsx
│   │   ├── team-switcher.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── welcome/              # Welcome kit
│   ├── hooks/
│   │   └── use-conveyor.ts       # IPC hook
│   ├── pages/                    # [DA CREARE] Route pages
│   │   ├── Dashboard.tsx
│   │   ├── clients/
│   │   ├── products/
│   │   ├── quotes/
│   │   └── settings/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── app.css
│   │   └── window.css
│   ├── app.tsx                   # Main component
│   ├── renderer.tsx              # React entry point
│   ├── index.html
│   └── index.d.ts
├── lib/                          # Shared library code
│   ├── conveyor/                 # IPC System
│   │   ├── api/
│   │   │   ├── index.ts
│   │   │   ├── app-api.ts
│   │   │   └── window-api.ts
│   │   ├── handlers/
│   │   │   ├── app-handler.ts
│   │   │   └── window-handler.ts
│   │   ├── schemas/
│   │   │   ├── index.ts
│   │   │   ├── app-schema.ts
│   │   │   └── window-schema.ts
│   │   └── README.md
│   ├── database/                 # [DA CREARE] Database layer
│   │   ├── client.ts
│   │   ├── migrations/
│   │   └── schema.ts
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── main/                     # Main Process
│   │   ├── main.ts
│   │   ├── app.ts
│   │   ├── protocols.ts
│   │   ├── shared.ts
│   │   └── index.d.ts
│   ├── preload/                  # Preload Scripts
│   │   ├── preload.ts
│   │   └── shared.ts
│   └── utils.ts
├── resources/                    # Build resources
│   ├── build/
│   │   ├── icon.icns
│   │   ├── icon.ico
│   │   ├── icon.png
│   │   └── icon.svg
│   └── icons/
├── out/                          # Build output (generated)
├── dist/                         # Distribution files (generated)
├── node_modules/                 # Dependencies (generated)
├── components.json               # Shadcn config
├── electron-builder.yml          # Electron builder config
├── electron.vite.config.ts       # Vite config
├── eslint.config.mjs             # ESLint config
├── package.json                  # NPM config
├── tsconfig.json                 # TypeScript config
├── tsconfig.node.json
├── tsconfig.web.json
├── claude.md                     # Questa documentazione
└── README.md                     # README progetto
```

---

## Prossimi Passi

### Fase 1: Setup Database
1. Installare SQLite (`better-sqlite3`)
2. Creare schema database
3. Implementare migrations
4. Creare layer di accesso dati

### Fase 2: Implementare Gestione Clienti
1. Creare IPC handlers per CRUD clienti
2. Creare pagine: lista, form, dettaglio
3. Implementare validazione form
4. Aggiungere ricerca e filtri

### Fase 3: Implementare Gestione Prodotti
1. Creare IPC handlers per CRUD prodotti
2. Creare pagine prodotti
3. Implementare categorie
4. Import/Export CSV

### Fase 4: Implementare Dashboard Preventivi
1. Creare IPC handlers per preventivi
2. Implementare creazione preventivo
3. Aggiungere calcolo automatico totali
4. Implementare generazione PDF
5. Implementare invio email

### Fase 5: Impostazioni e Rifinitura
1. Pagina impostazioni
2. Backup/Restore
3. Ottimizzazioni performance
4. Testing

---

## Note Importanti

- **Titolo App**: "Quotify" (modificabile in `lib/main/app.ts`)
- **Versione**: 12.0.0 (in `package.json`)
- **Licenza**: MIT
- **Node Version**: Compatibile con Node.js LTS

---

## Risorse Utili

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zod Docs](https://zod.dev)
- [Electron Vite](https://electron-vite.org)
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3)

---

**Ultimo aggiornamento**: 2025-10-09
**Versione Documento**: 1.0.0
