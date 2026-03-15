import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

// One-time setup endpoint to create the first admin
// Call: POST /api/admin/setup  with { setupKey, username, password, name }
export async function POST(req: NextRequest) {
  try {
    const { setupKey, username, password, name } = await req.json();

    // Verify setup key
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json({ message: "Invalid setup key." }, { status: 403 });
    }

    // Check if any admin already exists
    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { message: "Admin with this username already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
      data: { username, password: hashed, name },
    });

    return NextResponse.json({
      success: true,
      message: `Admin "${admin.name}" created successfully. You can now log in.`,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
