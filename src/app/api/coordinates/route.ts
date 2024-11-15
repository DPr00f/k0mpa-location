import { db } from "~/server/db";
import z from "zod";
import { env } from "~/env";

const RequestType = z.object({
  longitude: z.number(),
  latitude: z.number(),
  id: z.string(),
});

const ResponseType = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export async function GET() {
  const coordinates = await db.location.findFirst({
    where: { name: "k0mpass" },
  });

  if (!coordinates) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(ResponseType.parse(coordinates), {});
}

export async function PUT(request: Request) {
  const apiPassword = request.headers.get("x-api-password");

  if (apiPassword !== env.API_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as z.infer<typeof RequestType>;
  try {
    RequestType.parse(body);
  } catch (error) {
    return Response.json(
      {
        error,
      },
      { status: 400 },
    );
  }

  const { id: name, latitude, longitude } = body;

  try {
    await db.location.upsert({
      where: { name },
      update: { latitude, longitude },
      create: { name, latitude, longitude },
    });
  } catch (ex) {
    return Response.json(
      {
        error: ex,
      },
      { status: 500 },
    );
  }

  return Response.json({ status: 200 });
}
