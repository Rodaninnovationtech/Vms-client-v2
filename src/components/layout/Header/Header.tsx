import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // backend returns a relative path like /media/...; prefix the API host
  const logoSrc = user?.site_logo
    ? user.site_logo.startsWith("http")
      ? user.site_logo
      : `${API_BASE_URL}${user.site_logo}`
    : null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-primary-50 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-primary-700"
        >
          <Menu size={22} />
        </button>
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Site logo"
            className="lg:hidden h-9 w-auto max-w-[120px] object-contain shrink-0"
          />
        )}
        <div className="hidden md:flex items-center gap-2 bg-primary-50/60 rounded-lg px-3 py-2 w-full max-w-xs">
          <Search size={16} className="text-primary-400 shrink-0" />
          <input
            type="text"
            placeholder="Search visitor, pass, tenant..."
            className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative text-slate-500 hover:text-primary-700">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user?.login_id?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-medium text-slate-800">{user?.login_id || "User"}</p>
              <p className="text-xs text-slate-400">
                {user?.is_superuser ? "Super Admin" : user?.is_staff ? "Staff" : "User"}
              </p>
            </div>
            <ChevronDown size={14} className="hidden sm:block text-slate-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card border border-primary-50 py-1.5 z-20">
                <button className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700">
                  <UserCircle size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
