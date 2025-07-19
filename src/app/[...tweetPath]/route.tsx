import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { Tweet, fetchTweetData } from "@/components/Tweet";
import satori from "satori";
import sharp from "sharp";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tweetPath: string[] }>;
  }
) {
  const fonts = await loadFonts();

  const tweetPath = (await params).tweetPath.join("/");
  const tweetData = await fetchTweetData(tweetPath);

  const componentWidth = 600;

  const tweetElement = Tweet({
    data: tweetData,
    useSatori: true,
  });

  const svg = await satori(tweetElement, {
    width: componentWidth,
    fonts: createFontConfig(fonts),
  });

  const pngBuffer = await sharp(Buffer.from(svg))
    .resize({
      width: componentWidth * 2,
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}

async function loadFonts() {
  const fontsDir = path.join(process.cwd(), "public/fonts");

  try {
    const [chirpRegular, chirpMedium, chirpBold, chirpHeavy] =
      await Promise.all([
        readFile(path.join(fontsDir, "chirp-regular.ttf")),
        readFile(path.join(fontsDir, "chirp-medium.ttf")),
        readFile(path.join(fontsDir, "chirp-bold.ttf")),
        readFile(path.join(fontsDir, "chirp-heavy.ttf")),
      ]);

    return {
      regular: chirpRegular,
      medium: chirpMedium,
      bold: chirpBold,
      heavy: chirpHeavy,
    };
  } catch (error: any) {
    throw new Error(`Failed to load fonts: ${error.message}`);
  }
}

function createFontConfig(fonts: any) {
  return [
    {
      name: "Chirp",
      data: fonts.bold,
      style: "normal" as const,
      weight: 700 as const,
    },
    {
      name: "Chirp",
      data: fonts.heavy,
      style: "normal" as const,
      weight: 900 as const,
    },
    {
      name: "Chirp",
      data: fonts.medium,
      style: "normal" as const,
      weight: 500 as const,
    },
    {
      name: "Chirp",
      data: fonts.regular,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}
