export function distributionQuestionKey(question: { questionId?: string; code: string; text: string }) {
  return question.questionId || JSON.stringify([question.code, question.text]);
}
