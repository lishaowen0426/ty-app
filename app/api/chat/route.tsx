import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TopicCursor, TopicResponse } from "@/components/ui/TopicCard";

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

const getTopics = async (cursor: TopicCursor) => {
  if (cursor.last_id == 0) {
    //initial request
    return prisma.topic.findMany({
      take: cursor.limit,
      orderBy: {
        id: "asc",
      },
    });
  } else {
    return prisma.topic.findMany({
      take: cursor.limit,
      skip: 1,
      cursor: {
        id: cursor.last_id,
      },
      orderBy: {
        id: "asc",
      },
    });
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

  if (!params.has("lastid") || !params.has("limit")) {
    return NextResponse.json(null, { status: 400 });
  }
  const last_id = parseInt(params.get("lastid")!);
  const limit = parseInt(params.get("limit")!);

  const topics = await getTopics({ last_id: last_id, limit: limit });

  if (topics.length == 0) {
    return NextResponse.json(
      { last_id: last_id, topics: topics },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { last_id: topics[topics.length - 1].id, topics: topics },
      { status: 200 }
    );
  }
}
