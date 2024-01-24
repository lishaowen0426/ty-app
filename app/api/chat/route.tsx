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

export async function POST(req: NextRequest) {
  const param = await req.json();
  console.log(req);
  try {
    createChatFn(param);
  } catch (e) {
    console.log(e);
  }
  return NextResponse.json({ status: 200 });
}

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const topics = await getTopics();
  return NextResponse.json({ status: 200, topic: topics });
}
