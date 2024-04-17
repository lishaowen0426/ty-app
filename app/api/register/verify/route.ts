import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
export async function POST(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
}
export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  redirect("/started/email/success");
}
