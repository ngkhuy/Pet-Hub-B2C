import { log } from "console";

export async function POST(req: Request) {
  const res = await req.json();
  log(res);
  return Response.json({ res });
}
