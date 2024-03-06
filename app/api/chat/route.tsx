import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TopicCursor, TopicResponse } from "@/components/ui/TopicCard";
import type { Topic as TopicProp } from "@prisma/client";
import { UserAvatarInfo } from "@/components/ui/TopicCard";

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
      take: cursor.limit + 1, //take one more so we can decide hasMore
      orderBy: {
        id: "asc",
      },
    });
  } else {
    return prisma.topic.findMany({
      take: cursor.limit + 1, //take one more so we can decide hasMore
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

const getAvatar = async (topics: TopicProp[]) => {
  let ids = new Set<string>();
  topics.forEach((t) => ids.add(t.creatorId));
  let avatars: UserAvatarInfo[] = [];

  for (const i of ids) {
    const user = await prisma.user.findUnique({
      where: {
        id: i,
      },
    });
    if (user && user.avatar) {
      avatars.push({ id: i, avatar: user.avatar.toString("base64") });
    }
  }

  return avatars;
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

  if (params.has("lastid") && params.has("limit")) {
    const last_id = parseInt(params.get("lastid")!);
    const limit = parseInt(params.get("limit")!);

    let topics = await getTopics({ last_id: last_id, limit: limit });
    const hasMore = topics.length > limit;

    topics = topics.slice(0, limit); // getTopics tries to get one more, remove here

    if (topics.length == 0) {
      return NextResponse.json(
        { last_id: last_id, topics: topics, hasMore: hasMore },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          last_id: topics[topics.length - 1].id,
          topics: topics,
          hasMore: hasMore,
        },
        { status: 200 }
      );
    }
  }
  if (params.has("page") && params.has("count")) {
    const page = parseInt(params.get("page")!);
    const count = parseInt(params.get("count")!);
    if (isNaN(page) || isNaN(count) || page < 1) {
      return NextResponse.json(null, { status: 400 });
    }

    const topics = await prisma.topic.findMany({
      take: count, //take one more so we can decide hasMore
      skip: (page - 1) * count,
      orderBy: {
        id: "asc",
      },
    });
    const avatarInfo = await getAvatar(topics);
    return NextResponse.json(
      { topics: topics, avatar: avatarInfo },
      { status: 200 }
    );
  } else {
    return NextResponse.json(null, { status: 400 });
  }
}
