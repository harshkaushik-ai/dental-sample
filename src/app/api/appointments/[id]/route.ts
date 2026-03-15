import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";

// Next.js 15 requires params to be a Promise
type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/appointments/[id] — update status or notes
export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, notes } = body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update appointment." },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] — delete appointment
export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete appointment." },
      { status: 500 }
    );
  }
}