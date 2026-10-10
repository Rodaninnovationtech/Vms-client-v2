# VMS 2.0 — Visitor Management System

React + TypeScript + Tailwind CSS frontend.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 — login with any Login ID and Password (demo auth, no backend).

## Structure
```
src/
  components/
    ui/            reusable UI kit (Button, Card, Input, Select, Table, Tabs, Pagination, Badge, Modal, PageHeader)
    layout/         Sidebar, Header, Footer
    common/         CrudPage — generic list+form template used by most modules
  context/          AuthContext (session-based demo auth)
  routes/           ProtectedRoute
  pages/            Login, Dashboard, Visitor, PreRegistration, Approval,
                     PropertyManagement (Key/Pass tabs), SystemConfig (7 sub-pages),
                     Reports, Settings
  App.tsx           Sidebar + Header + Footer + Router wired directly (no layout wrapper)
  main.tsx          App entry point
```

## Theme
Purple + white, with light-purple (`primary-100`) active/hover highlighting.
Colors are defined in `tailwind.config.js` under `theme.extend.colors.primary`.
Breakpoints: `sm` `md` `lg` `xl` `2xl` (Tailwind defaults).
