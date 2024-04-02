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
//console.log("start topic view refresher: ", Date.now());
//refreshTopicView.start();

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

  let from = params.get("from");
  let to = params.get("to");

  let category = params.get("category");

  if (from && to) {
    const topics =
      await prisma.$queryRaw`SELECT * FROM "TopicByCreationDate" WHERE index >= ${parseInt(
        from
      )} AND index < ${parseInt(to)}`;
    return NextResponse.json({ topics: topics }, { status: 200 });
  } else if (category) {
  } else {
    return NextResponse.json(null, { status: 400 });
  }
}
