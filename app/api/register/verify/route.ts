import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { redis, prisma } from "@/lib/db";
import { createJWSAndCookie } from "@/lib/actions";
import { JWTPayload } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const email = params.get("email");
  const token = params.get("token");

  let redirectTo: string | undefined = undefined;

  if (!email || !token) {
    //missing parameter
    redirect("/info/invalid?h=link");
  }

  const storedToken = await redis.get(email);
  //token not exist
  if (!storedToken || storedToken != token) {
    redirect("/info/invalid?h=link");
  }

  const userRecord = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      emailVerified: true,
    },
  });

  if (!userRecord) {
    redirect("/info/invalid?h=nonexist");
  } else if (userRecord.emailVerified) {
    redirect("/info/invalid?h=exist");
  }
  /*
   the correct case
   1. update db
   2. remove token
   3. set session
  */
  try {
    // 1
    const verifiedUser = (await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        avatar: true,
        name: true,
      },
    })) satisfies JWTPayload;

    // 2
    await redis.del(email);

    // 3
    createJWSAndCookie(verifiedUser);
  } catch (e) {
    console.log(e);
    redirect("/info/invalid?h=internal");
  }
  redirect("/info/verified");
}
