import { db } from "~/server/db";
import z from "zod";
import { getSettings, isLocked } from "~/server/utils";

const RequestType = z.object({
  longitude: z.number(),
  latitude: z.number(),
  id: z.string(),
});

const ResponseType = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const hasLock = (
  settings: Record<string, string>,
): settings is { unlockAt: string; lockAt: string } => {
  if ("lockAt" in settings && "unlockAt" in settings) {
    return true;
  }

  return false;
};

export async function GET() {
  const settings = await getSettings();

  if (hasLock(settings) && isLocked(settings)) {
    return Response.json({ hidden: true }, { status: 200 });
  }

  const coordinates = await db.location.findFirst({
    where: { name: "k0mpass" },
  });

  if (!coordinates) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(ResponseType.parse(coordinates), {});
}

export async function PUT(request: Request) {
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

export async function POST(request: Request) {
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
    await db.locations.create({
      data: {
        name,
        latitude,
        longitude,
      },
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
