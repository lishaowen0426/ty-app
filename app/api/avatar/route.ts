import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({}, { status: 400 });
  } else {
    return Response.json({}, { status: 200 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({}, { status: 400 });
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        avatar: true,
      },
    });
    return Response.json({ url: user?.avatar }, { status: 200 });
  }
}
