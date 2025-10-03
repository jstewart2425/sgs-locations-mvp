import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = schema.parse(data);
    const user = await createUser(parsed.email, parsed.password, parsed.name);
    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
