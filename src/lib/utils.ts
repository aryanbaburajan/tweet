import { createCanvas } from "canvas";

export function createClassPropHelper(useSatori: boolean) {
  const useTw = (classes: string) => ({ tw: classes });
  const useClassName = (classes: string) => ({ className: classes });
  return useSatori ? useTw : useClassName;
}

export function shortenNumber(n: number) {
  if (n >= 100000) return Math.round(n / 10000) / 10 + "M";
  if (n >= 1000) return Math.round(n / 100) / 10 + "K";
  return n;
}

export function wrapText(
  text: string,
  maxWidth: number,
  fontSize = 16,
  fontFamilyName: string
) {
  const canvas = createCanvas(0, 0);
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px "${fontFamilyName}"`;

  const lines = [];

  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }

    const words = paragraph.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      const { width } = ctx.measureText(testLine);

      if (width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) lines.push(line);
  }

  if (lines[lines.length - 1] === "") lines.pop();

  return lines;
}
