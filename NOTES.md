# 📝 MetaTask – Notes techniques (Front-end)

---

## 🛠️ 1. Stack détaillée

| Couche    | Lib / Tech                                         | Raison                                    |
| --------- | -------------------------------------------------- | ----------------------------------------- |
| Framework | **Next 15** (App Router)                           | Routing fichier + Server Components       |
| UI        | **shadcn/ui** + Tailwind 3                         | Accessibilité Radix, design rapide        |
| État      | **Zustand**                                        | 0 boilerplate, persistance `localStorage` |
| Réseau    | **SWR + Axios**                                    | Cache, revalidate, simplicité offline     |
| DnD       | **@dnd-kit/core / sortable**                       | Performant, a11y, animation µ-spring      |
| Table     | **@tanstack/react-virtual** (optionnel)            | Virtualisation >2k lignes                 |
| Tests     | **Jest + RTL**                                     | Couverture 87% (components + hooks)       |
| Qualité   | ESLint strict (`no-explicit-any`), Prettier, Husky |

---

## 📂 2. Structure

```
src/
├─ app/                       # pages Next 15
│  ├─ (auth)/login
│  ├─ (auth)/register
│  └─ (protected)/dashboard
│
├─ components/
│  ├─ ui/                     # atoms shadcn (Button, Badge…)
│  ├─ layout/                 # Header, Sidebar, Toolbar, ThemeToggle
│  ├─ kanban/                 # KanbanBoard, Column, TaskCard, AddTaskForm
│  ├─ table/                  # DataTableLite
│  ├─ pickers/                # StatusSelector, CategoryPicker, ProjectSelector
│  └─ dialogs/                # EditDialog, ColorPicker
│
├─ hooks/
│  ├─ api/                    # tasks.ts, projects.ts, metadata.ts
│  └─ ui/                     # helpers (outside-click, clipboard…)
│
├─ stores/                    # zustand (ui.ts, filters.ts)
├─ lib/                       # api.ts, auth.ts, utils.ts
└─ types/                     # model.ts, next-auth.d.ts
```

### 🪝 Hooks API consolidés

| Fichier           | Fonctions                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `api/tasks.ts`    | `useTasks`, `createTask`, `updateTask`, `deleteTask`, `setStatus`, `setProject`, `setCategories` |
| `api/projects.ts` | `useProjects`, `createProject`, `updateProject`, `deleteProject`                                 |
| `api/metadata.ts` | `useStatuses`, `useCategories`, CRUD statuts & catégories                                        |

---

## 🔍 3. Qualité de code

- **ESLint** : `next/core-web-vitals` + `@typescript-eslint/recommended`
  - règle stricte `no-explicit-any`
  - hooks : `react-hooks/exhaustive-deps`
- **Prettier** : 100 cols, simple quote, semi true
- **Husky** : `pre-commit` → `lint-staged` (`eslint --fix` + `prettier`)

---

## 🧪 4. Tests front

```bash
npm run test    # Jest + RTL
```

| Suite                 | Couvre                              | Remarques          |
| --------------------- | ----------------------------------- | ------------------ |
| `Toolbar.spec.tsx`    | Filtres projet / catégorie / statut | mock zustand       |
| `KanbanDrag.spec.tsx` | Drag-and-drop colonne ↔ tâche       | dnd-kit test-utils |
| `TableEdit.spec.tsx`  | Edition inline titre                | SWR mock           |

Couverture lignes **87%** ✅

---

## ♿ 5. Accessibilité & Performance

- Tous les composants de saisie = Radix → 100/100 axe a11y Lighthouse
- Score desktop : 99/100/100/100  
  Mobile : 91+ (drag overlay lourd => paint)
- Skeleton & lazy loading images (landing)

---

## 🔮 6. Roadmap post-test

| Prio   | Item                     | Détails                            |
| ------ | ------------------------ | ---------------------------------- |
| ⭐⭐⭐ | Password reset           | token signé + page /reset          |
| ⭐⭐   | Collaboration temps réel | socket.io + optimistic UI          |
| ⭐     | PWA offline complet      | service worker, push notifications |
| ⭐     | Role-based permissions   | owner / member sur projets         |

_Total temps réalisé : **≈ 6h** (dont 2h polish & docs)._
