"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, CalendarDays, LogOut, Menu, X,
  Stethoscope, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/appointments", icon: CalendarDays, label: "Appointments" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const name = localStorage.getItem("admin_name");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (name) setAdminName(name);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    router.push("/admin/login");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
          <Stethoscope size={15} className="text-white" />
        </div>
        <div>
          <div className="font-display text-base font-semibold text-gray-900">
            Lumina<span className="text-brand-500">.</span>
          </div>
          <div className="text-[10px] text-gray-400 -mt-0.5">Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800 truncate">{adminName}</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <span className="font-display text-base font-semibold text-gray-900">
            Lumina<span className="text-brand-500">.</span>
          </span>
          <button onClick={handleLogout} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <LogOut size={18} />
          </button>
        </div>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
