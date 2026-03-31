# WeeklyFresh

Planificador semanal de comidas. Explora recetas, organiza tu semana y genera listas de compra.

**Live:** [weekly-fresh.vercel.app](https://weekly-fresh.vercel.app)

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Base de datos:** Neon Serverless PostgreSQL (local PG en dev)
- **ORM:** Drizzle
- **Auth:** Clerk
- **Almacenamiento:** Vercel Blob (imagenes)
- **UI:** Tailwind CSS v4 + shadcn/ui + Poppins
- **Idioma:** Español

## Funcionalidades

- **Catalógo de recetas** — 192 recetas de HelloFresh + recetas custom. Grid/lista, busqueda por nombre, filtro por ingredientes (tags multiples), filtro por utensilios.
- **Detalle de receta** — Imagen, ingredientes (enviados/no enviados), utensilios, instrucciones paso a paso con imagenes.
- **Plan semanal** — Selector de semana, elige recetas y asignalas a dias. Plan inmutable tras confirmacion, reset completo.
- **Lista de compra** — Checkboxes por receta con optimistic updates. Seccion de ingredientes custom.
- **Recetas custom** — Wizard mobile / accordion desktop. Subida de imagen a Vercel Blob.
- **Favoritos** — Toggle optimistico con corazon.
- **Compartir planes** — Invita por email. Roles: ver (solo plan) / editar (plan + lista). Invitaciones pendientes via Clerk.
- **Dark/light mode** con toggle.
- **Responsive** — Bottom tab bar en mobile, sidebar en desktop.

## Desarrollo

### Requisitos

- Node.js 20+
- PostgreSQL local

### Setup

```bash
git clone https://github.com/jeremy93-2008/WeeklyFresh.git
cd WeeklyFresh
npm install
```

Crea `.env.local`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/WeeklyFresh

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

BLOB_READ_WRITE_TOKEN=
```

### Base de datos

```bash
createdb WeeklyFresh
npm run db:push
npm run db:seed
```

### Imagenes en local

Symlink a las imagenes scrapeadas:

```bash
ln -s /ruta/a/hello-fresh-images public/recipe-images
```

### Arrancar

```bash
npm run dev
```

### Scripts disponibles

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run db:push` | Aplicar schema a la DB |
| `npm run db:seed` | Seed con 192 recetas HelloFresh |
| `npm run db:studio` | Drizzle Studio (explorar DB) |
| `npm run db:generate` | Generar migraciones |
| `npm run db:migrate` | Ejecutar migraciones |

## Estructura del proyecto

```
src/
├── app/                    Rutas (App Router)
│   ├── recetas/            Catalogo, detalle, crear, editar
│   ├── plan/               Plan semanal
│   ├── lista/              Lista de compra
│   ├── favoritos/          Favoritos
│   └── api/                Upload, webhooks
├── components/
│   ├── ui/                 shadcn/ui (generado)
│   ├── layout/             AppShell, Logo, ThemeToggle, AuthButton
│   ├── recipes/            Cards, grid, search, pagination
│   ├── plan/               WeekSelector, PlanBuilder, PlanConfirmed, PlanMembers
│   ├── shopping/           IngredientCheck, CustomItemSection
│   └── custom-recipe/      Secciones del formulario de receta
├── hooks/                  useRecipeForm
├── actions/                Server actions (recipes, plans, shopping, members, favorites)
├── queries/                DB queries (recipes, plans)
├── db/                     Schema Drizzle + conexion
└── lib/                    Utils, constantes, permisos, parser
```
