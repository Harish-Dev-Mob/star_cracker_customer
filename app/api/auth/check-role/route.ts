import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/check-role
 * Lightweight endpoint to check if an identifier belongs to an ADMIN.
 * Used by the customer login page to show a helpful error message instead
 * of a generic "invalid credentials" when an admin tries to login here.
 *
 * NOTE: This does NOT expose the password or any sensitive data.
 * It only reveals whether the account is an admin — which is intentional
 * so we can give a clear redirect message.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = body?.identifier as string | undefined;

    if (!identifier) {
      return NextResponse.json({ isAdmin: false });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      select: { role: true },
    });

    return NextResponse.json({ isAdmin: user?.role === "ADMIN" });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
