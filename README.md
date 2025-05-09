# 🚀 MetaTask

> ### _Notion-like Kanban & Table_

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?style=flat-square)](https://ui.shadcn.com/)

---

## ⚡ Installation rapide

```bash
git clone <repo-frontend>.git
cd todo-frontend
cp env.example .env.local     # renseigner NEXT_PUBLIC_API_URL si ≠ localhost:4000 & NextAuthSecret
npm install
npm run dev                    # http://localhost:3000
```

## 📋 Scripts disponibles

| Script            | Action                           |
| ----------------- | -------------------------------- |
| `dev`             | Développement avec HMR           |
| `build` / `start` | Build statique puis serveur Node |
| `lint`            | ESLint strict                    |

## ✨ Fonctionnalités

- 🔄 **Kanban drag-and-drop** (dnd-kit) + édition inline
- 📊 **Table filtrable** (statut / catégorie / projet / recherche)
- 🌓 **Thème clair/sombre** persistant (Zustand)
- 🔌 **Offline-first** : queue IndexedDB → sync auto API
- 🔐 **Auth NextAuth** (JWT) : login / register / middleware
- 🪝 **Hooks API** consolidés (`hooks/api/*`) + SWR cache
