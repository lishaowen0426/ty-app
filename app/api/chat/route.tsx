import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export interface ChatCreateReq {
  creatorId: string;
  topic: string;
  tags?: string[];
}

const createChatFn = async (req: ChatCreateReq) => {
  await prisma.topic.create({
    data: {
      creatorId: req.creatorId,
      topic: req.topic,
    },
  });
};

export async function POST(params: NextRequest) {
  console.log(params);
  const req = (await params.json()) as ChatCreateReq;
  try {
    createChatFn(req);
  } catch (e) {
    console.log(e);
  }
  return new NextResponse(null, { status: 200 });
}
