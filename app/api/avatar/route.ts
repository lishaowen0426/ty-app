import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const getAvatar = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      avatar: true,
    },
  });
  if (user && user.avatar) {
    return user.avatar;
  } else {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  if (!params.has("user")) {
    return new NextResponse(null, { status: 400 });
  } else {
    const id = params.get("user")!;
    const avatar = await getAvatar(id);
    console.log(avatar);
    if (!avatar) {
      return new NextResponse(null, { status: 400 });
    } else {
      return new NextResponse(new Blob([avatar]), { status: 200 });
    }
  }
}
