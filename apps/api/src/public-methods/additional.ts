import { miniIpipInstrument } from "../data/miniIpip.js";
import { ppsInstrument } from "../data/pps.js";
import { genderPersonalityTypeTitovaRuInstrument, genderPersonalityTypeTitovaRuScoring } from "../data/genderPersonalityTypeTitovaRu.js";
import { scoreMiniIpip } from "../scoring/miniIpip.js";
import { scorePps } from "../scoring/pps.js";
// Public versions are isolated from research instruments and stored in assessment snapshots.
import { tipiRuInstrument } from "../data/tipiRu.js";
import { iafRuInstrument } from "../data/iafRu.js";
import { cavRuInstrument } from "../data/cavRu.js";
import { caasRuInstrument, caasRuScoring } from "../data/caasRu.js";
import { belongingExclusionRuInstrument, belongingExclusionRuScoring } from "../data/belongingExclusionRu.js";
import { methodology as smmg } from "../data/methodologies/method-0799.js";
import { methodology as scs } from "../data/methodologies/method-2416.js";
import { methodology as aaq } from "../data/methodologies/method-1138.js";
import { methodology as gad } from "../data/methodologies/method-0888.js";
import { methodology as phq } from "../data/methodologies/method-1599.js";
import { munInstrument } from "../data/mun.js";
import { scoreMun } from "../scoring/mun.js";
import { paqShortRuInstrument, paqShortRuScoring } from "../data/paqShortRu.js";
import { methodology as development } from "../data/methodologies/method-0233.js";
import { methodology as metacognition } from "../data/methodologies/method-2191.js";
import { scoreTipiRu } from "../scoring/tipiRu.js";
import { scoreIafRu } from "../scoring/iafRu.js";
import { scoreCavRu } from "../scoring/cavRu.js";
import { calculateConfigurableScores, configurableScaleBounds, type ConfigurableScoring } from "../scoring/configurable.js";
import type { SeedSection } from "../types.js";
import type { Scale } from "./model.js";

import { didsRuInstrument, didsScoring } from "../data/selfConstrualRu.js";
import { isriRuInstrument, isriRuScoring } from "../data/isriRu.js";
import { methodology as careerMotivation } from "../data/methodologies/method-0543.js";

export const additionalInstruments: Record<string, SeedSection> = Object.fromEntries([
  miniIpipInstrument, ppsInstrument, genderPersonalityTypeTitovaRuInstrument,
  tipiRuInstrument, iafRuInstrument, cavRuInstrument, caasRuInstrument,
  belongingExclusionRuInstrument, smmg.instrument, scs.instrument, aaq.instrument, gad.instrument, phq.instrument,
  munInstrument, paqShortRuInstrument, development.instrument, metacognition.instrument,
  didsRuInstrument, isriRuInstrument, careerMotivation.instrument,
].map(instrument => [instrument.code, instrument]));

const scale = (label: string, value: number, min: number, max: number, explanation: string): Scale => ({ label, value, min, max, explanation });
const neutral = "Более высокий балл означает большую выраженность названного свойства в ответах. Это не диагноз и не сравнение с населением.";
function configured(config: ConfigurableScoring, input: Map<number, number>) {
  const values = calculateConfigurableScores(config, Object.fromEntries(input));
  if (!values) throw new Error("Не удалось рассчитать показатели");
  return config.scales.map(s => {
    const bounds = configurableScaleBounds(config, s);
    if (!bounds) throw new Error("Не определён диапазон шкалы");
    return scale(s.label, values[s.key], ...bounds, neutral);
  });
}

export function calculateAdditional(code: string, input: Map<number, number>): { scales: Scale[]; explanation: string; presentation: "profile" | "scales" } {
  let scales: Scale[];
  let explanation: string;
  let presentation: "profile" | "scales" = "profile";
  switch (code) {
    case "test_16": {
      const result = scoreMiniIpip(input);
      if (!result) throw new Error("Неполный протокол Mini-IPIP");
      const labels = ["Экстраверсия", "Доброжелательность", "Добросовестность", "Нейротизм", "Интеллект и воображение"];
      scales = Object.values(result.scales).map((row, index) => scale(labels[index], row.average, row.min, row.max, neutral));
      explanation = "Пять отдельных средних баллов от 1 до 5. Общий балл не рассчитывается.";
      break;
    }
    case "test_11": {
      const result = scorePps(input);
      if (!result) throw new Error("Неполный протокол PPS-12");
      const labels = ["Прокрастинация", "Откладывание решений", "Откладывание действий", "Опоздания и сроки"];
      scales = [result.overall, ...Object.values(result.scales)].map((row, index) => scale(labels[index], row.average, row.min, row.max, neutral));
      presentation = "scales";
      explanation = "Общий результат — среднее по 12 пунктам. Дополнительно показаны средние по трём группам пунктов.";
      break;
    }
    case "test_56":
      scales = configured(genderPersonalityTypeTitovaRuScoring, input);
      explanation = "Четыре суммы и два индекса по авторскому ключу, без типологической классификации.";
      break;
    case "test_21": {
      const result = scoreMun(input);
      if (!result) throw new Error("Неполный протокол МУН");
      const s = result.overall;
      scales = [scale("Мотивация успеха", s.score, 0, 20, `${s.category ?? "Для 0 баллов авторская категория не задана"}. Не прогноз достижений.`)];
      presentation = "scales";
      explanation = s.category
        ? `${s.category}. ${s.interpretation ?? ""} Это авторское правило интерпретации, а не универсальная популяционная норма и не диагноз.`
        : "Получено 0 совпадений с ключом. Для арифметически возможного нуля в источнике категория не задана; результат показан без присвоения категории.";
      break;
    }
    case "test_22":
      scales = configured(paqShortRuScoring, input);
      scales[0].label = "Трудности понимания эмоций";
      scales[0].explanation = "Выше балл — больше трудностей с распознаванием и описанием эмоций. Это не диагноз.";
      presentation = "scales";
      explanation = "Сумма шести ответов, 6–42. Русская PAQ-S оценивает только общий показатель алекситимии: отдельные подшкалы по двум пунктам не рассчитываются. Нормативные и диагностические пороги не применяются.";
      break;
    case "test_265": {
      const rows = configured(development.scoringConfig!, input);
      scales = [rows[3], ...rows.slice(0, 3)];
      presentation = "scales";
      explanation = "Общий балл 14–84 и три суммы по планированию (4–24), обучению (4–24), общению и внутреннему локусу контроля (6–36). Обратных пунктов нет. Суммы шкал разной длины нельзя напрямую сравнивать; общий балл не является оценкой ценности человека.";
      break;
    }
    case "test_2205":
      scales = configured(metacognition.scoringConfig!, input);
      scales[2].explanation = "Выше балл — больше уверенности в работе своей памяти в трудных ситуациях. Это самооценка, не объективная проверка памяти.";
      scales[3].explanation = "Выше балл — больше субъективной уверенности в понимании других людей. Правильность догадок о людях этим опросником не проверяется.";
      explanation = "Четыре независимых средних 1–5. Пункты 2, 6, 10, 13, 14, 15 и 17 инвертированы как 6 − ответ. Общий балл не предусмотрен. Результат описывает представления о своих ресурсах, а не выполнение объективных заданий.";
      break;
    case "test_14": {
      const result = scoreTipiRu(input);
      if (!result) throw new Error("Неполный профиль TIPI-RU");
      scales = Object.values(result.scales).map(s => scale(s.label, s.average, 1, 7, neutral));
      explanation = "Пять независимых черт: среднее двух пунктов каждой шкалы. Общего балла личности нет. Короткий опросник даёт лишь приблизительный профиль, без нормативных уровней.";
      break;
    }
    case "test_24": {
      const result = scoreIafRu(input);
      if (!result) throw new Error("Неполный профиль IAF");
      scales = Object.entries(result.scales).map(([key, s]) => scale(s.label, s.score, 1, 5,
        key === "control" ? "Чем выше балл, тем сильнее восприимчивость к внешнему и внутреннему давлению. Это обратная по смыслу сторона автономности." : neutral));
      explanation = "Три отдельных средних по пять пунктов. Общий индекс не рассчитывается: опубликованная формула недостаточна для независимого воспроизведения. Русская версия проверялась преимущественно на студентах.";
      break;
    }
    case "test_29": {
      const result = scoreCavRu(input);
      if (!result) throw new Error("Неполный профиль CAV");
      scales = Object.values(result.scales).map(s => scale(s.label, s.score, 0, 48, neutral));
      explanation = "Две независимые суммы: собственные агрессивные действия в сети и опыт агрессии со стороны других. Они не складываются в общий балл и не определяют вину человека.";
      break;
    }
    case "test_44":
      scales = configured(belongingExclusionRuScoring, input);
      explanation = "Три независимые шкалы принадлежности. У них разные диапазоны, поэтому сырые суммы напрямую не сравниваются. Это предварительная исследовательская модель, требующая дальнейшей проверки.";
      break;
    case "test_829":
      scales = configured(smmg.scoringConfig!, input);
      scales[1].label = "Стресс дезорганизует · обратный балл";
      scales[1].explanation = "Пункты о дезорганизующем стрессе инвертированы: более высокий балл означает меньшее согласие с ними, а не большую дезорганизацию.";
      explanation = "Две суммы по четыре пункта. Нечётные пункты пересчитываются как 4 − ответ. Общий балл и нормативные уровни не выводятся.";
      break;
    case "test_23": {
      const rows = configured(caasRuScoring, input);
      scales = [rows[4], ...rows.slice(0, 4)];
      presentation = "scales";
      explanation = "Общий балл 24–120 и четыре суммы 6–30. Русская адаптация проверялась на учащихся 15–19 лет. В этом публичном прохождении — только 18+; для людей старше 19 лет применимость и нормы не подтверждены.";
      break;
    }
    case "test_2434": {
      // Neff's overall score weights the SIX subscale means equally, not the 26 items.
      const config = { ...scs.scoringConfig!, scales: scs.scoringConfig!.scales.slice(0, 6) };
      const rows = configured(config, input);
      const negative = new Set([1, 3, 5]);
      rows.forEach((s, i) => { if (negative.has(i)) s.explanation = "Более высокий балл отражает больше самокритики, изоляции или поглощённости переживаниями; эта шкала показана без инверсии."; });
      const total = rows.reduce((sum, s, i) => sum + (negative.has(i) ? 6 - s.value : s.value), 0) / 6;
      scales = [scale("Сочувствие к себе · общий балл", total, 1, 5, "Среднее шести подшкал после инверсии трёх негативных. Чем выше, тем больше сочувствия к себе отражено в ответах."), ...rows];
      presentation = "scales";
      explanation = "Шесть подшкал показаны в исходных направлениях. Для общего балла негативные средние инвертируются как 6 − среднее; затем шесть средних имеют равный вес. Универсальные нормативные уровни не применяются.";
      break;
    }
    case "test_1168":
      scales = configured(aaq.scoringConfig!, input);
      scales[0].label = "Психологическая негибкость";
      scales[0].explanation = "Выше балл — больше негибкости в ответах. Русский перевод не валидирован. Не диагноз.";
      presentation = "scales";
      explanation = "Сумма семи ответов 7–49. Выше — больше избегания переживаний и психологической негибкости. Использован перевод ACBS с пометкой validation needed: это не валидированная адаптация Ясина и не клиническое заключение.";
      break;
    case "test_918":
      scales = configured(gad.scoringConfig!, input);
      scales[0].label = "Тревожные симптомы";
      scales[0].explanation = "Выше балл — чаще тревожные симптомы за последние две недели. Не диагноз.";
      presentation = "scales";
      explanation = "Сумма семи ответов за последние две недели, 0–21. Она отражает частоту тревожных симптомов. Русская популяционная адаптация не устанавливает диагностический порог. Если переживания мешают жить, обсудите их со специалистом.";
      break;
    case "test_1616":
      scales = configured(phq.scoringConfig!, input);
      explanation = "Две суммы по два ответа за последние две недели, каждая 0–6: тревожные и депрессивные симптомы. Это краткий скрининг, не диагноз. Если симптомы беспокоят или мешают повседневной жизни, обратитесь к специалисту.";
      break;
    case "test_39":
      scales = configured(didsScoring, input);
      explanation = "Пять отдельных средних, без общей суммы.";
      break;
    case "test_40":
      scales = configured(isriRuScoring, input);
      presentation = "scales";
      explanation = "Сумма шести ответов, от 0 до 24.";
      break;
    case "test_576":
      scales = configured(careerMotivation.scoringConfig!, input);
      explanation = "Четыре отдельные суммы по профессиональной установке и мотивам.";
      break;
    default: throw new Error("Неизвестная публичная методика");
  }
  return { scales, explanation, presentation };
}
