import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export interface ChatCreateReq {
  creatorId: string;
  topic: string;
  tags?: string[];
}

export interface TopicReq {}

const createChatFn = async (req: ChatCreateReq) => {
  await prisma.topic.create({
    data: {
      creatorId: req.creatorId,
      topic: req.topic,
    },
  });
};

const getTopics = async (req?: TopicReq) => {
  if (!req) {
    let topics = await prisma.topic.findMany();
    return topics;
  }
};

export async function POST(params: NextRequest) {
  const req = (await params.json()) as ChatCreateReq;
  console.log(req);
  try {
    createChatFn(req);
  } catch (e) {
    console.log(e);
  }
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest, res: NextResponse) {
  const topics = await getTopics();
  console.log(topics);
}
