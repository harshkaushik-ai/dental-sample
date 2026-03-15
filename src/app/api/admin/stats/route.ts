import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [total, pending, confirmed, todayCount, tomorrowCount, cancelled, recent] =
    await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "pending" } }),
      prisma.appointment.count({ where: { status: "confirmed" } }),
      prisma.appointment.count({ where: { date: today } }),
      prisma.appointment.count({ where: { date: tomorrow } }),
      prisma.appointment.count({ where: { status: "cancelled" } }),
      prisma.appointment.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return NextResponse.json({
    stats: { total, pending, confirmed, todayCount, tomorrowCount, cancelled },
    recent,
  });
}
