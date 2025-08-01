// src/app/[id]/raw/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPaste } from "@/utils/editor-commons";

// Use RouteHandlerContext for the second argument
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(paste.content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "X-Paste-Language": paste.language || "plaintext",
      "X-Paste-ID": id,
    },
  });
}
