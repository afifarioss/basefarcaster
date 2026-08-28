import { NextRequest, NextResponse } from "next/server";
import { resolveBasename } from "@/lib/basename";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing name",
        example: "/api/basename/resolve?name=afifarioss.base.eth",
      },
      { status: 400 }
    );
  }

  const result = await resolveBasename(name);

  if (!result) {
    return NextResponse.json(
      {
        ok: false,
        error: "Basename not found or has no resolved address",
        name,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
