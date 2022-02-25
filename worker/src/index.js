import DataExtractor from "./DataExtractor";
import aggregate from "./Cron";
import { nanoid } from "nanoid";

export default {
  async fetch(req, env) {
    const data = await req.formData(),
      extracted = new DataExtractor(data);
    if(typeof extracted === "string") return new Response(`Invalid Data: ${extracted}`, { status: 400 });
    await env.KV.put(nanoid(), JSON.stringify(extracted));
    return new Response("OK");
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(aggregate(env));
  }
};