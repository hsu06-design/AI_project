import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

const photoPrefix = "closet/";

function getBucket() {
  if (!env.CLOSET_PHOTOS) {
    throw new Error("CLOSET_PHOTOS storage is unavailable.");
  }

  return env.CLOSET_PHOTOS;
}

function photoFromObject(object: R2Object) {
  return {
    id: object.key,
    name: decodeURIComponent(object.customMetadata?.originalName ?? "옷 사진"),
    src: `/api/closet?key=${encodeURIComponent(object.key)}`,
  };
}

async function listPhotos() {
  const result = await getBucket().list({
    prefix: photoPrefix,
    include: ["customMetadata"],
  });

  return result.objects
    .sort((a, b) => b.uploaded.getTime() - a.uploaded.getTime())
    .map(photoFromObject);
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");

  if (!key) {
    return Response.json({ photos: await listPhotos() });
  }

  if (!key.startsWith(photoPrefix)) {
    return new Response("Invalid photo key.", { status: 400 });
  }

  const object = await getBucket().get(key);

  if (!object) {
    return new Response("Photo not found.", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "private, max-age=3600");

  return new Response(object.body, { headers });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.type.startsWith("image/"));

  if (files.length === 0) {
    return Response.json({ error: "사진을 선택해 주세요." }, { status: 400 });
  }

  const bucket = getBucket();

  await Promise.all(
    files.map(async (file) => {
      const extension = file.name.match(/\.[a-zA-Z0-9]+$/)?.[0]?.toLowerCase() ?? "";
      const key = `${photoPrefix}${Date.now()}-${crypto.randomUUID()}${extension}`;

      await bucket.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
        customMetadata: { originalName: encodeURIComponent(file.name) },
      });
    }),
  );

  return Response.json({ photos: await listPhotos() });
}
