import { NextRequest, NextResponse } from "next/server";
import { resolveBasename } from "@/lib/basename";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing name",
      },
      { status: 400 }
    );
  }

  const normalized = name
    .trim()
    .replace(/^@/, "")
    .toLowerCase();

  if (!normalized.endsWith(".base.eth")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Not a Basename",
      },
      { status: 400 }
    );
  }

  const result = await resolveBasename(normalized);

  if (!result) {
    return NextResponse.json(
      {
        ok: false,
        error: "Basename could not be resolved",
        name: normalized,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
