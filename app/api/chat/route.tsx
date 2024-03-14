import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TopicCursor } from "@/components/ui/TopicCard";
import type { Topic as TopicProp } from "@prisma/client";
import { TopicWithAvatar } from "@/components/ui/TopicCard";
import SmartAsyncInterval from "@/lib/smartAsyncInterval";

const REFRESH_VIEW_DELAY_MS = 10 * 1000;

//refresh the view at launch
const refreshTopicView = new SmartAsyncInterval(async () => {
  //console.log(`refresh topic view...${Date.now()}`);
  return await prisma.$executeRaw`REFRESH MATERIALIZED VIEW "TopicByCreationDate"`;
}, REFRESH_VIEW_DELAY_MS);
console.log(`start topic view refresher ${Date.now}`);
refreshTopicView.start();

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

const getAvatar = async (topics: TopicProp[]) => {
  let topics_with_avatar: TopicWithAvatar[] = [];
  for (const t of topics) {
    const user = await prisma.user.findUnique({
      where: {
        id: t.creatorId,
      },
    });
    if (user && user.avatar) {
      topics_with_avatar.push({
        ...t,
        avatar: user && user.avatar ? user.avatar.toString("base64") : null,
      });
    }
  }

  return topics_with_avatar;
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
  console.log(params);

  let limit = params.get("limit");
  const cursor = params.get("cursor");
  let page = params.get("page");

  if (
    limit === undefined || //limit must be defined
    (cursor && page) // they can neither be both defined
  ) {
    return NextResponse.json(null, { status: 400 });
  } else if (page) {
    //pagination
    return NextResponse.json(null, { status: 200 });
  } else {
    // infinite scroll
    return NextResponse.json(null, { status: 200 });
  }
}
