"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Filter, Phone, Mail, CalendarDays, Clock,
  CheckCircle, XCircle, Trash2, StickyNote, ChevronLeft,
  ChevronRight, RefreshCw, Download,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-teal-50 text-teal-600 border-teal-200",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const LIMIT = 15;

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { search } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      });
      const res = await fetch(`/api/appointments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setAppointments(data.appointments || []);
      setTotal(data.total || 0);
    } catch {
      console.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, router]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Delete this appointment? This cannot be undone.")) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAppointments();
  };

  const saveNote = async () => {
    if (!selectedId) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/appointments/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes: noteText }),
    });
    setShowNoteModal(false);
    setSelectedId(null);
    setNoteText("");
    fetchAppointments();
  };

  const openNote = (apt: Appointment) => {
    setSelectedId(apt.id);
    setNoteText(apt.notes || "");
    setShowNoteModal(true);
  };

  const exportCSV = () => {
    const header = ["ID", "Patient", "Email", "Phone", "Date", "Time", "Reason", "Status", "Notes", "Created"];
    const rows = appointments.map((a) => [
      a.id, a.patientName, a.email, a.phone, a.date, a.timeSlot, a.reason, a.status, a.notes || "", new Date(a.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total appointments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 text-sm bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl hover:border-brand-300 hover:text-brand-600 transition-all"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 text-sm bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl hover:border-brand-300 hover:text-brand-600 transition-all"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-brand-400 transition-all">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-brand-400 transition-all">
          <Filter size={15} className="text-gray-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm text-gray-700 focus:outline-none bg-transparent capitalize"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s === "all" ? "All Status" : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No appointments found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["Patient", "Contact", "Date & Time", "Reason", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Patient */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-brand-600 font-semibold text-sm flex-shrink-0">
                            {apt.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{apt.patientName}</div>
                            <div className="text-xs text-gray-400">#{apt.id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <Mail size={11} /> {apt.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone size={11} /> {apt.phone}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                          <CalendarDays size={13} className="text-brand-400" /> {apt.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <Clock size={11} /> {apt.timeSlot}
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 max-w-[160px] block truncate">{apt.reason}</span>
                        {apt.notes && (
                          <span className="text-xs text-amber-500 mt-0.5 block">📝 Has notes</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <select
                          value={apt.status}
                          onChange={(e) => updateStatus(apt.id, e.target.value)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer capitalize focus:outline-none ${STATUS_STYLES[apt.status] || STATUS_STYLES.pending}`}
                        >
                          {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                            <option key={s} value={s} className="bg-white text-gray-700">{s}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => updateStatus(apt.id, "confirmed")}
                            title="Confirm"
                            className="w-8 h-8 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 flex items-center justify-center transition-colors"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => openNote(apt)}
                            title="Add Note"
                            className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors"
                          >
                            <StickyNote size={14} />
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, "cancelled")}
                            title="Cancel"
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                          >
                            <XCircle size={14} />
                          </button>
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            title="Delete"
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-brand-600 font-semibold">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{apt.patientName}</div>
                        <div className="text-xs text-gray-400">{apt.date} · {apt.timeSlot}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${STATUS_STYLES[apt.status] || STATUS_STYLES.pending}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{apt.reason}</div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(apt.id, "confirmed")} className="flex-1 py-2 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
                      Confirm
                    </button>
                    <button onClick={() => openNote(apt)} className="flex-1 py-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium">
                      Note
                    </button>
                    <button onClick={() => updateStatus(apt.id, "cancelled")} className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-medium">
                      Cancel
                    </button>
                    <button onClick={() => deleteAppointment(apt.id)} className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages} · {total} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNoteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-900 mb-1">Add / Edit Note</h3>
            <p className="text-gray-400 text-sm mb-4">Internal note visible only to staff</p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note about this appointment..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-brand-400 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
