import { expect, it } from 'vitest';
import { distributionQuestionKey } from './questionKey';
it('separates questions with equal codes across sections', () => {
  expect(distributionQuestionKey({code:'q1',text:'Ваш возраст'})).not.toBe(distributionQuestionKey({code:'q1',text:'Да или нет'}));
});
it('uses stable question IDs including identical text and codes', () => {
  expect(distributionQuestionKey({questionId:'age',code:'q1',text:'Возраст'})).toBe('age');
  expect(distributionQuestionKey({questionId:'other',code:'q1',text:'Возраст'})).toBe('other');
});
