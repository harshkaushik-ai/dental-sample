import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";

// ── POST /api/appointments  (public — patient booking) ──────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, email, phone, date, timeSlot, reason } = body;

    if (!patientName || !email || !phone || !date || !timeSlot || !reason) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check double booking
    const conflict = await prisma.appointment.findFirst({
      where: { date, timeSlot, status: { not: "cancelled" } },
    });

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          message: `The slot at ${timeSlot} on ${date} is already booked. Please choose another time.`,
        },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: { patientName, email, phone, date, timeSlot, reason, status: "pending" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully!",
        appointment: { id: appointment.id, date: appointment.date, timeSlot: appointment.timeSlot },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// ── GET /api/appointments  (public: booked slots | admin: full list) ─────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const admin = getTokenFromRequest(req);

  // Admin: return all appointments with filters
  if (admin) {
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = {
      ...(status && status !== "all" ? { status } : {}),
      ...(search ? {
          OR: [
            { patientName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        } : {}),
      ...(date ? { date } : {}),
    };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({ appointments, total, page, limit });
  }

  // Public: just return booked slots for a date
  if (!date) return NextResponse.json({ bookedSlots: [] });

  const booked = await prisma.appointment.findMany({
    where: { date, status: { not: "cancelled" } },
    select: { timeSlot: true },
  });

  return NextResponse.json({ bookedSlots: booked.map((b) => b.timeSlot) });
}
