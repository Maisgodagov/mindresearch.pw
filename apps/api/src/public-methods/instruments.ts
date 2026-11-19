import { bsmasRuInstrument } from "../data/bsmasRu.js";

// Verbatim appendix form (Kornienko et al., 2023, CC BY-NC 4.0).
// Keep existing research questionnaires and their response snapshots unchanged.
const bsmasStatements = [
  "…тратил много времени, размышляя о том, как использовать социальные сети, и планируя действия в них?",
  "…испытывал потребность все больше и больше пользоваться социальными сетями?",
  "…использовал социальные сети, чтобы забыть о личных проблемах?",
  "…безуспешно пытался сократить использование социальных сетей?",
  "…беспокоился или волновался, если тебе запретили пользоваться социальными сетями?",
  "…пользовался социальными сетями настолько часто, что это отрицательно сказалось на делах, учебе?",
];
export const publicBsmasInstrument = {
  ...bsmasRuInstrument,
  questions: bsmasRuInstrument.questions.map((q, i) => ({
    ...q, text: `Как часто за последний год ты${bsmasStatements[i]}`,
  })),
};
