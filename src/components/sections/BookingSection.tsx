"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Video, ChevronLeft, ChevronRight,
  Clock, CheckCircle, Loader2, AlertCircle,
  User, Mail, Phone, MessageSquare, CalendarDays,
} from "lucide-react";

type ConsultType = "in-clinic" | "video";
interface TimeGroup { label: string; slots: string[] }

const SLOT_GROUPS: TimeGroup[] = [
  {
    label: "Morning",
    slots: ["9:00 AM","9:15 AM","9:30 AM","9:45 AM","10:00 AM","10:15 AM","10:30 AM","10:45 AM","11:00 AM","11:15 AM","11:30 AM","11:45 AM"],
  },
  {
    label: "Afternoon",
    slots: ["12:00 PM","12:15 PM","12:30 PM","2:00 PM","2:15 PM","2:30 PM","2:45 PM","3:00 PM","3:15 PM","3:30 PM","3:45 PM","4:00 PM","4:15 PM","4:30 PM","4:45 PM"],
  },
  {
    label: "Evening",
    slots: ["5:00 PM","5:15 PM","5:30 PM","5:45 PM","6:00 PM","6:15 PM","6:30 PM","6:45 PM","7:00 PM"],
  },
];

const REASONS = [
  "Routine Check-up & Cleaning","Teeth Whitening","Dental Implant Consultation",
  "Root Canal Treatment","Orthodontic Consultation","Smile Makeover Consultation",
  "Emergency / Pain","Other",
];

function getDayLabel(offset: number): string {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset === 2) return "Day After";
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function getDateObj(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDay(d: Date): string {
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function BookingSection() {
  const [dateOffset, setDateOffset] = useState(0);
  const [stripStart, setStripStart] = useState(0);
  const VISIBLE_DAYS = 7;
  const [consultType, setConsultType] = useState<ConsultType>("in-clinic");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientName: "", email: "", phone: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedId, setConfirmedId] = useState("");

  const selectedDate = getDateObj(dateOffset);
  const selectedDateStr = formatDate(selectedDate);

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    setShowForm(false);
    try {
      const res = await fetch(`/api/appointments?date=${selectedDateStr}`);
      const data = await res.json();
      setBookedSlots(data.bookedSlots || []);
    } catch {
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDateStr]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleSlotClick = (slot: string) => {
    if (bookedSlots.includes(slot)) return;
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDateStr,
          timeSlot: selectedSlot,
          reason: form.reason || "General Consultation",
          consultType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setConfirmedId(data.appointment?.id || "");
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong.");
        fetchSlots();
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStatus("idle");
    setShowForm(false);
    setSelectedSlot(null);
    setForm({ patientName: "", email: "", phone: "", reason: "" });
    setConfirmedId("");
    fetchSlots();
  };

  const availableCount = (group: TimeGroup) =>
    group.slots.filter((s) => !bookedSlots.includes(s)).length;

  return (
    <section id="booking" className="py-24 lg:py-36 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-400" />
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">Book Appointment</span>
            <div className="h-px w-10 bg-brand-400" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-gray-900 mb-3">Schedule a Consultation</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            with <strong className="text-gray-700">Dr. Sophia Merritt</strong> — Lead Cosmetic Dentist at Lumina Dental
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-teal-500" />
              </div>
              <h3 className="font-display text-2xl font-medium text-gray-900 mb-2">Appointment Confirmed!</h3>
              <p className="text-gray-500 mb-1"><strong>{formatDay(selectedDate)}</strong> · <strong>{selectedSlot}</strong></p>
              <p className="text-gray-500 text-sm mb-1 capitalize">
                {consultType === "in-clinic" ? "🏥 In-Clinic Visit" : "🎥 Video Consult"}
              </p>
              {confirmedId && <p className="text-xs text-gray-400 mb-6">Ref: {confirmedId}</p>}
              <p className="text-gray-500 text-sm mb-8">Confirmation sent to <strong>{form.email}</strong></p>
              <button onClick={reset} className="bg-brand-500 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-brand-600 transition-colors">
                Book Another
              </button>
            </motion.div>
          ) : (
            <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Doctor bar */}
              <div className="bg-gradient-to-r from-brand-600 to-teal-600 px-6 py-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-display text-xl text-white font-light flex-shrink-0">SM</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg">Dr. Sophia Merritt</h3>
                  <p className="text-white/70 text-sm">Dentist · BDS, MDS · 15+ Years Experience</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-white/80 text-sm">
                  <Phone size={13} />(123) 456-7890
                </div>
              </div>

              <div className="p-6 lg:p-8">
                {/* Consult type */}
                <div className="mb-7">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Consultation Type</p>
                  <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
                    {(["in-clinic","video"] as ConsultType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setConsultType(type)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          consultType === type ? "bg-white text-brand-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {type === "in-clinic" ? <Building2 size={15} /> : <Video size={15} />}
                        {type === "in-clinic" ? "In-Clinic Consult" : "Video Consult"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date strip */}
                <div className="mb-7">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Select Date</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStripStart((s) => Math.max(0, s - 1))}
                      disabled={stripStart === 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:border-brand-300 hover:text-brand-500 disabled:opacity-30 transition-all flex-shrink-0"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <div className="flex gap-2 overflow-hidden flex-1">
                      {Array.from({ length: VISIBLE_DAYS }).map((_, i) => {
                        const offset = stripStart + i;
                        const d = getDateObj(offset);
                        const isSelected = offset === dateOffset;
                        return (
                          <button
                            key={offset}
                            onClick={() => { setDateOffset(offset); setShowForm(false); setSelectedSlot(null); }}
                            className={`flex-1 min-w-0 flex flex-col items-center py-2.5 px-1 rounded-xl border transition-all ${
                              isSelected
                                ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-200/50"
                                : "border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-500"
                            }`}
                          >
                            <span className="text-[10px] font-semibold tracking-wide truncate w-full text-center">
                              {getDayLabel(offset)}
                            </span>
                            <span className={`text-sm font-bold mt-0.5 ${isSelected ? "text-white" : ""}`}>{d.getDate()}</span>
                            <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                              {d.toLocaleDateString("en-US", { month: "short" })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setStripStart((s) => s + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-all flex-shrink-0"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Time slots */}
                <div className="mb-7">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Available Time Slots</p>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm">Loading slots...</span>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {SLOT_GROUPS.map((group) => {
                        const avail = availableCount(group);
                        return (
                          <div key={group.label}>
                            <div className="flex items-center gap-2 mb-2.5">
                              <Clock size={13} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">{group.label}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${avail === 0 ? "bg-red-50 text-red-400" : "bg-teal-50 text-teal-600"}`}>
                                {avail === 0 ? "Fully booked" : `${avail} slots available`}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.slots.map((slot) => {
                                const booked = bookedSlots.includes(slot);
                                const selected = selectedSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    disabled={booked}
                                    onClick={() => handleSlotClick(slot)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                      selected
                                        ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-200/50"
                                        : booked
                                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed line-through"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50"
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Patient form */}
                <AnimatePresence>
                  {showForm && selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-brand-400 font-medium uppercase tracking-wide mb-0.5">Selected Appointment</p>
                          <p className="text-brand-700 font-semibold">{formatDay(selectedDate)} · {selectedSlot}</p>
                          <p className="text-brand-500 text-xs mt-0.5">
                            {consultType === "in-clinic" ? "🏥 In-Clinic" : "🎥 Video Consult"}
                          </p>
                        </div>
                        <button onClick={() => { setShowForm(false); setSelectedSlot(null); }} className="text-brand-400 hover:text-brand-600 text-xs font-medium underline">
                          Change
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Your Details</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField icon={User} label="Full Name" required>
                            <input type="text" required placeholder="Jane Doe" value={form.patientName}
                              onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none" />
                          </FormField>
                          <FormField icon={Phone} label="Phone Number" required>
                            <input type="tel" required placeholder="+91 98765 43210" value={form.phone}
                              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none" />
                          </FormField>
                        </div>
                        <FormField icon={Mail} label="Email Address" required>
                          <input type="email" required placeholder="jane@example.com" value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none" />
                        </FormField>
                        <FormField icon={MessageSquare} label="Reason for Visit">
                          <select value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                            className="w-full bg-transparent text-sm text-gray-800 focus:outline-none">
                            <option value="">Select reason (optional)</option>
                            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </FormField>

                        <AnimatePresence>
                          {status === "error" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl p-3">
                              <AlertCircle size={15} className="flex-shrink-0" />{errorMsg}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button type="submit" disabled={submitting}
                          className="w-full bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold py-4 rounded-2xl hover:shadow-lg hover:shadow-brand-200/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                          {submitting ? <><Loader2 size={18} className="animate-spin" /> Confirming...</> : <><CalendarDays size={17} /> Confirm Appointment</>}
                        </button>
                        <p className="text-center text-gray-400 text-xs">No payment required · Free first consultation</p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showForm && !loadingSlots && (
                  <div className="text-center py-4 text-gray-400 text-sm">👆 Select a time slot above to continue</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {[
            { icon: "🏥", title: "Lumina Dental Clinic", sub: "123 Lumina Plaza, New York" },
            { icon: "📞", title: "(123) 456-7890", sub: "Mon–Sat, 9 AM – 6 PM" },
            { icon: "✅", title: "Free First Consultation", sub: "No hidden charges" },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{title}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormField({ icon: Icon, label, required, children }: {
  icon: React.ElementType; label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label} {required && <span className="text-brand-400">*</span>}
      </label>
      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50/50 focus-within:border-brand-400 focus-within:bg-white focus-within:shadow-sm transition-all">
        <Icon size={15} className="text-gray-400 flex-shrink-0" />
        {children}
      </div>
    </div>
  );
}
