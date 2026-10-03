import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { AuthProvider } from "@/context/AuthContext";
import { Login } from "@/pages/Login";
import { appRoutes } from "@/routes/routes";
import { PermissionProvider } from "./context/PermissionContext";

// App.tsx wires Sidebar + Header + Footer + Router directly — no separate Layout page.
// Route definitions themselves live in src/routes/routes.tsx.
const AppShell = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginRoute = location.pathname === "/login";

  if (isLoginRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-5">
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
         <PermissionProvider>
        <AppShell />
        </PermissionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;