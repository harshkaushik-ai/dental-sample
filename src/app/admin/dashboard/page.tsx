"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays, Clock, CheckCircle, XCircle,
  TrendingUp, Users, ArrowRight, RefreshCw,
} from "lucide-react";

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  todayCount: number;
  tomorrowCount: number;
  cancelled: number;
}

interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-600 border-amber-100",
  confirmed: "bg-teal-50 text-teal-600 border-teal-100",
  cancelled: "bg-red-50 text-red-500 border-red-100",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setStats(data.stats);
      setRecent(data.recent);
    } catch {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const STAT_CARDS = stats
    ? [
        { label: "Total Appointments", value: stats.total, icon: Users, color: "brand", sub: "All time" },
        { label: "Pending Review", value: stats.pending, icon: Clock, color: "amber", sub: "Needs action" },
        { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "teal", sub: "Scheduled" },
        { label: "Today", value: stats.todayCount, icon: CalendarDays, color: "purple", sub: `Tomorrow: ${stats.tomorrowCount}` },
      ]
    : [];

  const colorMap: Record<string, string> = {
    brand:  "from-brand-500 to-brand-600",
    amber:  "from-amber-400 to-amber-500",
    teal:   "from-teal-500 to-teal-600",
    purple: "from-violet-500 to-purple-600",
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 bg-white border border-gray-200 rounded-xl px-4 py-2 transition-all hover:border-brand-200"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp size={17} className="text-brand-500" />
            <h2 className="font-semibold text-gray-800">Recent Appointments</h2>
          </div>
          <Link
            href="/admin/appointments"
            className="text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No appointments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                    {apt.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{apt.patientName}</div>
                    <div className="text-xs text-gray-400">{apt.reason}</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">{apt.date}</div>
                    <div className="text-xs text-gray-400">{apt.timeSlot}</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
