import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";

const PORT =
  process.env.AES_PASSPHRASE ??
  (() => {
    throw new Error("aes passphrase undefined");
  })();

export interface ProfileInfo {
  email: string;
  password: string | null;
  name: string | null;
  avatar: File | null;
}

const setProfile = async (profile: FormData) => {
  const email = profile.get("email")! as string;
  let info: any = {};

  if (profile.get("name")) {
    info.name = profile.get("name")! as string;
  }
  if (profile.get("password")) {
    info.password = SHA256(profile.get("password")! as string).toString(Hex);
  }
  if (profile.get("avatar")) {
    let f = profile.get("avatar") as File;
    info.avatar = Buffer.from(await f.arrayBuffer());
  }

  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: {
      ...info,
    },
  });
};
export async function POST(request: NextRequest) {
  let profile = await request.formData();

  setProfile(profile);

  return NextResponse.json({ status: 200 });
}
