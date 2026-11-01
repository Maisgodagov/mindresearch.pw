import "@fontsource-variable/onest";
import "@fontsource/prata";
import type { PublicResult } from "./types";
import { formatScore } from "./types";

// One drawing supplies both the on-page preview and the shared story image.
export async function resultCard(result: PublicResult): Promise<Blob> {
  await Promise.all([
    document.fonts.load('700 32px "Manrope Variable"'),
    document.fonts.load('600 32px "Onest Variable"', "Мой результат Поддержка семьи 0123456789,из"),
    document.fonts.load('400 32px "Prata"', "Моя самоэффективность Моё отношение к себе Моя опора Моя поддержка"),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Браузер не поддерживает создание изображения");
  const ink = "#203e32", paper = "#fff5da";
  const main = result.scales[0];
  const additional = result.scales.slice(1);
  const multiple = additional.length > 0;
  // Continuous visual variation, not clinical thresholds or population norms.
  const span = main.max - main.min;
  const position = span > 0 ? Math.max(0, Math.min(1, (main.value - main.min) / span)) : 0;
  const mix = (a: number[], b: number[], t: number) =>
    `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  const accent = position < 0.5
    ? mix([153, 199, 223], [247, 181, 132], position * 2)
    : mix([247, 181, 132], [208, 235, 119], (position - 0.5) * 2);
  const highlight = position < 0.5 ? "#e67f55" : "#c8e878";
  const titles: Record<string, string[]> = {
    "general-self-efficacy": ["Моя", "самоэффективность"],
    "rosenberg-self-esteem": ["Моё отношение", "к себе"],
    "perceived-social-support": ["Моя опора.", "Моя поддержка."],
  };
  const title = titles[result.method.slug] ?? [result.method.title];
  const font = (size: number, weight = 500, serif = false) => {
    c.font = `${serif ? 400 : weight} ${size}px "${serif ? "Prata" : "Onest Variable"}", ${serif ? "serif" : "sans-serif"}`;
  };
  const text = (value: string, x: number, y: number, width: number, size: number, line = 1.4, weight = 500) => {
    font(size, weight);
    let row = "", cursor = y;
    for (const word of value.split(/\s+/)) {
      if (c.measureText((row + " " + word).trim()).width > width && row) {
        c.fillText(row, x, cursor);
        cursor += size * line;
        row = word;
      } else row = (row + " " + word).trim();
    }
    if (row) c.fillText(row, x, cursor);
    return cursor + size * line;
  };
  c.fillStyle = paper;
  c.fillRect(0, 0, 1080, 1920);
  c.fillStyle = ink;
  c.font = '750 44px "Manrope Variable", sans-serif';
  c.fillText("mindresearch.pro", 70, 118);
  c.textAlign = "right";
  font(27, 650);
  c.fillText(result.method.abbreviation, 1000, 116);
  c.textAlign = "left";
  let y = 290;
  for (const row of title) {
    let size = 102;
    font(size, 600, true);
    while (c.measureText(row).width > 940 && size > 46) font(--size, 600, true);
    c.fillText(row, 70, y);
    y += 118;
  }
  text(result.method.name, 74, 495, 920, 37, 1.35, 650);

  // A single continuous ring encodes position within the method's scale range.
  const centerX = 540, centerY = multiple ? 940 : 1100, radius = multiple ? 290 : 430;
  const orbitRadius = radius + 70;
  const start = -Math.PI / 2;
  const end = start + position * Math.PI * 2;
  // Keep the orbit quiet; depth belongs to the filled arc, not extra badges.
  c.lineCap = "round";
  c.strokeStyle = ink;
  c.lineWidth = 2;
  c.beginPath();
  c.arc(centerX, centerY, orbitRadius - 12, Math.PI * 0.76, Math.PI * 1.64);
  c.stroke();
  c.strokeStyle = highlight;
  c.lineWidth = 9;
  c.beginPath();
  c.arc(centerX, centerY, orbitRadius - 12, Math.PI * 1.82, Math.PI * 2.1);
  c.stroke();
  c.fillStyle = "#fff9e9";
  c.beginPath();
  c.arc(centerX, centerY, radius - 46, 0, Math.PI * 2);
  c.fill();
  const ringWidth = multiple ? 54 : 72;
  c.lineWidth = ringWidth;
  c.strokeStyle = accent;
  c.beginPath();
  c.arc(centerX, centerY, radius, 0, Math.PI * 2);
  c.stroke();
  if (position > 0) {
    const shading = c.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    shading.addColorStop(0, "#203e32");
    shading.addColorStop(1, "#527b61");
    c.strokeStyle = shading;
    c.beginPath();
    c.arc(centerX, centerY, radius, start, end);
    c.stroke();
  }
  // A compact endpoint with a clean paper keyline replaces the bulky badge.
  const markerX = centerX + Math.cos(end) * radius;
  const markerY = centerY + Math.sin(end) * radius;
  c.fillStyle = paper;
  c.beginPath();
  c.arc(markerX, markerY, ringWidth * 0.44, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = highlight;
  c.beginPath();
  c.arc(markerX, markerY, ringWidth * 0.3, 0, Math.PI * 2);
  c.fill();
  c.textAlign = "center";
  c.fillStyle = ink;
  font(32, 650);
  c.fillText(multiple ? "Общий результат" : "Мой результат", 540, centerY - (multiple ? 105 : 160));
  const value = formatScore(main.value);
  let scoreSize = multiple ? 200 : 290;
  font(scoreSize, 600);
  while (c.measureText(value).width > (multiple ? 430 : 610) && scoreSize > 100) font(--scoreSize, 600);
  c.fillText(value, 540, centerY + (multiple ? 75 : 110));
  font(multiple ? 38 : 49, 650);
  c.fillText(`из ${formatScore(main.max)}`, 540, centerY + (multiple ? 150 : 200));

  if (multiple) {
    c.fillStyle = ink;
    text(main.label, 540, 1335, 920, 36, 1.3, 650);
    text(main.explanation, 540, 1390, 920, 28, 1.3, 500);
    const columns = Math.min(3, additional.length);
    const rows = Math.ceil(additional.length / columns);
    const rowHeight = 430 / rows;
    const miniRadius = Math.min(108, (rowHeight - 130) / 2);
    for (let i = 0; i < additional.length; i++) {
      const scale = additional[i];
      const columnWidth = 1000 / columns;
      const x = 40 + columnWidth * (i % columns + 0.5);
      const y = 1490 + miniRadius + Math.floor(i / columns) * rowHeight;
      const range = scale.max - scale.min;
      const fraction = range > 0 ? Math.max(0, Math.min(1, (scale.value - scale.min) / range)) : 0;
      const color = fraction < 0.5
        ? mix([153, 199, 223], [247, 181, 132], fraction * 2)
        : mix([247, 181, 132], [208, 235, 119], (fraction - 0.5) * 2);
      c.lineWidth = 18;
      c.strokeStyle = color;
      c.beginPath();
      c.arc(x, y, miniRadius, 0, Math.PI * 2);
      c.stroke();
      if (fraction > 0) {
        const shading = c.createLinearGradient(x - miniRadius, y - miniRadius, x + miniRadius, y + miniRadius);
        shading.addColorStop(0, "#203e32");
        shading.addColorStop(1, "#527b61");
        c.strokeStyle = shading;
        c.beginPath();
        c.arc(x, y, miniRadius, start, start + fraction * Math.PI * 2);
        c.stroke();
      }
      c.fillStyle = ink;
      c.textAlign = "center";
      let size = 60;
      font(size, 750);
      const value = formatScore(scale.value);
      while (c.measureText(value).width > miniRadius * 1.6 && size > 24) font(--size, 750);
      c.fillText(value, x, y + 10);
      font(26, 600);
      c.fillText(`из ${formatScore(scale.max)}`, x, y + 48);
      text(scale.label, x, y + miniRadius + 60, columnWidth - 38, 32, 1.3, 650);
    }
  } else {
    font(28, 600);
    c.fillText(`Диапазон шкалы ${formatScore(main.min)}–${formatScore(main.max)}`, 540, 1635);
    text(main.label, 540, 1710, 900, 44, 1.3, 650);
    text(main.explanation, 540, 1790, 900, 32, 1.4, 500);
  }
  c.textAlign = "left";
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error("Не удалось создать карточку")), "image/png",
  ));
}
