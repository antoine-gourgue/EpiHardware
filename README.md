<div align="center">

# EpiHardware

**A modern, full-stack hardware store — Next.js 15 monorepo.**

Cartes graphiques, processeurs et périphériques gaming, avec un espace client complet et un back-office d'administration.

</div>

---

## ✨ Aperçu

EpiHardware est la refonte complète d'une ancienne application e-commerce (Create React App + Symfony) en une architecture moderne, typée de bout en bout, dans un **monorepo Turborepo**.

- 🛍️ **Catalogue** — filtres par catégorie & marque, tri, pagination, recherche instantanée
- 🧾 **Fiche produit** — galerie, stock, produits liés, ajout au panier avec quantité
- 🛒 **Panier persistant** — quantités réelles (cookie), livraison offerte dès 100 €
- 🔐 **Authentification** — Auth.js (JWT), rôles `USER` / `ADMIN`, inscription
- 👤 **Espace compte** — profil éditable, historique de commandes, **facture PDF**
- 🛠️ **Back-office admin** — tableau de bord, CRUD produits **protégé par rôle**
- 🌗 **Dark mode**, animations, design responsive
- 🧪 **Mode démo** — l'app tourne **sans base de données** avec un catalogue mocké

## 🧱 Stack

| Domaine         | Choix                                                       |
| --------------- | ----------------------------------------------------------- |
| Framework       | **Next.js 15** (App Router, Server Actions, Route Handlers) |
| Langage         | **TypeScript** strict                                       |
| UI              | **Tailwind CSS** + design system maison (`@epihardware/ui`) |
| Base de données | **PostgreSQL** + **Prisma**                                 |
| Auth            | **Auth.js v5** (Credentials, JWT)                           |
| Animations      | **Framer Motion**                                           |
| PDF             | **@react-pdf/renderer**                                     |
| Monorepo        | **Turborepo** + **pnpm workspaces**                         |

## 📁 Structure

```
epihardware/
├─ apps/
│  └─ web/              # Application Next.js (front + API + admin)
├─ packages/
│  ├─ db/               # Schéma Prisma, client, seed, catalogue démo
│  ├─ ui/               # Design system (Button, Card, Input…)
│  └─ config/           # Tailwind preset, tsconfig & ESLint partagés
├─ docker-compose.yml   # PostgreSQL local
└─ turbo.json
```

## 🚀 Démarrage

### Prérequis

Node ≥ 20, pnpm ≥ 10. (Docker uniquement pour le mode base de données.)

### Option A — Mode démo (aucune base requise)

```bash
pnpm install
cp apps/web/.env.example apps/web/.env      # puis générer AUTH_SECRET
pnpm dev
```

L'app démarre sur http://localhost:3000 avec un catalogue mocké.

Comptes de démonstration :

| Rôle   | Email                   | Mot de passe |
| ------ | ----------------------- | ------------ |
| Client | `demo@epihardware.dev`  | `password`   |
| Admin  | `admin@epihardware.dev` | `password`   |

### Option B — Avec PostgreSQL

```bash
pnpm install
docker compose up -d                        # démarre Postgres
cp packages/db/.env.example packages/db/.env
cp apps/web/.env.example apps/web/.env       # NEXT_PUBLIC_DEMO_MODE=false + DATABASE_URL
pnpm db:push                                 # applique le schéma
pnpm db:seed                                 # 29 produits, 2 comptes, commandes
pnpm dev
```

> `AUTH_SECRET` se génère avec `openssl rand -base64 32`.

## 📜 Scripts

| Commande                                 | Effet                                   |
| ---------------------------------------- | --------------------------------------- |
| `pnpm dev`                               | Démarre l'app en développement          |
| `pnpm build`                             | Build de production (tout le monorepo)  |
| `pnpm lint`                              | ESLint                                  |
| `pnpm typecheck`                         | Vérification des types                  |
| `pnpm format`                            | Formatage Prettier                      |
| `pnpm db:push` / `db:seed` / `db:studio` | Prisma : schéma / données / explorateur |

## 🔒 Améliorations vs. version d'origine

Cette refonte corrige les faiblesses de l'ancienne app :

- **Quantités du panier persistées** (l'ancienne version les perdait entre deux requêtes).
- **Lignes de commande figées** (`OrderItem` avec snapshot nom/prix), au lieu de réutiliser la table produit.
- **Rôle administrateur** et endpoints d'écriture réellement protégés (avant : ouverts à tout utilisateur connecté).
- **Types partagés** de la base à l'UI, plus de couche Redux morte.

## 📄 Licence

Projet de démonstration.
