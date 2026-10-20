import type { PublicResult } from "./types";
import { formatScore } from "./types";
export async function resultCard(result: PublicResult): Promise<Blob> {
  await document.fonts.load('600 32px "Manrope Variable"');
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Браузер не поддерживает создание изображения");
  c.fillStyle = "#f6f8f3";
  c.fillRect(0, 0, 1080, 1920);
  const font = (size: number, weight = 500) => {
    c.font = `${weight} ${size}px "Manrope Variable", sans-serif`;
  };
  const text = (
    value: string,
    x: number,
    y: number,
    width: number,
    size: number,
    line = 1.4,
    weight = 500,
  ) => {
    font(size, weight);
    let row = "",
      cursor = y;
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
  c.strokeStyle = "#52764b";
  c.lineWidth = 5;
  c.lineCap = "round";
  c.save();
  c.lineWidth = 1.8;
  c.translate(78, 80);
  c.scale(2, 2);
  c.stroke(
    new Path2D(
      "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10ZM2 22c0-3 1.9-5.4 5-6 2.3-.5 4.6-1 6-2",
    ),
  );
  c.restore();
  c.fillStyle = "#284432";
  font(38, 750);
  c.fillText("mindresearch", 146, 117);
  c.fillStyle = "#5d705f";
  text("Мой результат", 80, 235, 920, 28);
  c.fillStyle = "#284432";
  let y = text(result.method.name, 80, 320, 920, 62, 1.18, 650) + 50;
  const main = result.scales[0];
  font(144, 650);
  c.fillText(formatScore(main.value), 76, y + 110);
  const metricWidth = c.measureText(formatScore(main.value)).width;
  font(32);
  c.fillStyle = "#5d705f";
  c.fillText(`из ${main.max}`, 96 + metricWidth, y + 108);
  y += 190;
  c.fillStyle = "#284432";
  y = text(main.label, 80, y, 900, 32, 1.35, 650) + 38;
  for (const scale of result.scales.length > 1
    ? result.scales.slice(1)
    : [main]) {
    c.fillStyle = "#284432";
    font(29, 600);
    c.fillText(
      result.scales.length > 1 ? scale.label : "Диапазон шкалы",
      80,
      y,
    );
    c.textAlign = "right";
    c.fillText(`${formatScore(scale.value)} / ${scale.max}`, 1000, y);
    c.textAlign = "left";
    y += 26;
    c.fillStyle = "#dde6d8";
    c.beginPath();
    c.roundRect(80, y, 920, 16, 8);
    c.fill();
    const width =
      Math.max(
        0,
        Math.min(1, (scale.value - scale.min) / (scale.max - scale.min)),
      ) * 920;
    if (width > 0) {
      c.fillStyle = "#52764b";
      c.beginPath();
      c.roundRect(80, y, width, 16, 8);
      c.fill();
    }
    y += 96;
  }
  c.fillStyle = "#5d705f";
  y =
    text(
      result.scales.length > 1
        ? "Профиль воспринимаемой поддержки. Более высокий балл — более выраженное ощущение доступности помощи."
        : main.explanation,
      80,
      y + 14,
      920,
      29,
      1.5,
    ) + 30;
  c.strokeStyle = "#cedacb";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(80, 1530);
  c.lineTo(1000, 1530);
  c.stroke();
  c.fillStyle = "#5d705f";
  text(
    "Самоотчёт, не диагноз. Результат не определяет вашу ценность и не заменяет консультацию специалиста.",
    80,
    1595,
    920,
    27,
    1.5,
  );
  c.fillStyle = "#5d705f";
  text(
    `${result.method.abbreviation} · ${result.method.version}`,
    80,
    1695,
    920,
    20,
  );
  c.fillStyle = "#284432";
  font(32, 650);
  c.fillText("Пройти на mindresearch.pro", 80, 1780);
  font(22);
  c.fillStyle = "#5d705f";
  text(`/methods/${result.method.slug}`, 80, 1820, 920, 22);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Не удалось создать PNG")),
      "image/png",
    ),
  );
}
