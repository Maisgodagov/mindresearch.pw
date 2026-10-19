import type { MethodologyRegistration } from '../methodologyRegistry.js';
import { priorityQuestions } from '../instrumentForms.js';

export const methodology: MethodologyRegistration = {
  "instrument": {
    "code": "test_3004",
    "title": "Шкала субъективного благополучия, адаптация М. В. Соколовой (1996)",
    "description": "Шкала из 17 утверждений оценивает эмоциональный компонент субъективного благополучия взрослых: настроение, напряжение, удовлетворённость повседневностью, поддержку и самочувствие.",
    "questions": priorityQuestions("test_3004")
  },
  "categoryIds": [
    "meaning-satisfaction"
  ],
  "scoringConfig": {
    "min": 1,
    "max": 7,
    "scales": [
      {
        "key": "emotional_discomfort",
        "label": "Эмоциональный дискомфорт",
        "items": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17
        ],
        "reverseItems": [
          2,
          6,
          9,
          10,
          12,
          14,
          16,
          17
        ],
        "aggregation": "sum"
      }
    ]
  },
  "validationCases": [
    {
      "title": "Ручной расчёт: все ответы 1",
      "answers": {
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 1,
        "5": 1,
        "6": 1,
        "7": 1,
        "8": 1,
        "9": 1,
        "10": 1,
        "11": 1,
        "12": 1,
        "13": 1,
        "14": 1,
        "15": 1,
        "16": 1,
        "17": 1
      },
      "expected": {
        "emotional_discomfort": 65
      }
    },
    {
      "title": "Ручной расчёт: все ответы 7",
      "answers": {
        "1": 7,
        "2": 7,
        "3": 7,
        "4": 7,
        "5": 7,
        "6": 7,
        "7": 7,
        "8": 7,
        "9": 7,
        "10": 7,
        "11": 7,
        "12": 7,
        "13": 7,
        "14": 7,
        "15": 7,
        "16": 7,
        "17": 7
      },
      "expected": {
        "emotional_discomfort": 71
      }
    }
  ],
  "formulaVersion": "test_3004-reviewed-2026-10-19-v1",
  "details": {
    "author": "A. Perrudet-Badoux, G. Mendelsohn, J. Chiche; М. В. Соколова",
    "version": "test_3004-reviewed-2026-10-19-v1",
    "summary": "Шкала из 17 утверждений оценивает эмоциональный компонент субъективного благополучия взрослых: настроение, напряжение, удовлетворённость повседневностью, поддержку и самочувствие.",
    "steps": [
      "Суммируются баллы соответствующих пунктов с учётом обратного кодирования.",
      "Больший суммарный балл означает более выраженный эмоциональный дискомфорт и меньшее субъективное благополучие; меньший балл — больший эмоциональный комфорт."
    ],
    "keys": [
      {
        "label": "Эмоциональный дискомфорт",
        "value": "Пункты: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17. Обратные: 2, 6, 9, 10, 12, 14, 16, 17."
      }
    ],
    "notes": [
      "Больший суммарный балл означает более выраженный эмоциональный дискомфорт и меньшее субъективное благополучие; меньший балл — больший эмоциональный комфорт."
    ],
    "sources": [
      {
        "title": "Описание русской версии и библиография",
        "url": "https://psytests.org/life/bienetre.html"
      },
      {
        "title": "Источник структуры и ключа",
        "url": "https://dip-psi.ru/psikhologicheskiye-testy/post/shkala-sub-ektivnogo-blagopoluchiya-g-perue-badu-adaptaciya-m-v-sokolovoj"
      }
    ]
  }
};
