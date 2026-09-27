import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Get the most recent address
    const address = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Fetch address error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, street, city, state, pincode, country = "India" } = body;

    const existingAddress = await prisma.address.findFirst({ where: { userId } });
    if (existingAddress) {
      const updatedAddress = await prisma.address.update({
        where: { id: existingAddress.id },
        data: { name, phone, street, city, state, pincode, country }
      });
      return NextResponse.json({ success: true, address: updatedAddress });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId, name, phone, street, city, state, pincode, country
      }
    });
    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json({ success: false, message: "Failed to add address" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, phone, street, city, state, pincode, country = "India" } = body;

    const existingAddress = await prisma.address.findUnique({ where: { id } });
    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json({ success: false, message: "Address not found or unauthorized" }, { status: 403 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { name, phone, street, city, state, pincode, country }
    });
    return NextResponse.json({ success: true, address: updatedAddress });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ success: false, message: "Failed to update address" }, { status: 500 });
  }
}
