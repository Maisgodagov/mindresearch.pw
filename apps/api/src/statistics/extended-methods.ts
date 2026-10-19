export type StatisticsMethod = {
  id: string; label: string; kind: "single" | "independent" | "paired" | "multiple" | "repeated" | "multivariate" | "paired_groups" | "manual";
  description: string; minInputs?: number; maxInputs?: number; roles?: string[];
  vectors?: { key: string; label: string; placeholder: string }[];
  parameters?: { key: string; label: string; value: number; min?: number; max?: number; integer?: boolean; options?: { value: number; label: string }[] }[];
};
export const extendedMethods: StatisticsMethod[] = [
  {
    "id": "frequency",
    "label": "Частотная таблица",
    "kind": "single",
    "description": "Абсолютные, относительные и накопленные частоты числовых категорий.",
    "parameters": [
      {
        "key": "bins",
        "label": "Интервалов группировки · 0 для отдельных значений",
        "value": 0,
        "min": 0,
        "max": 50,
        "integer": true
      }
    ]
  },
  {
    "id": "ranks",
    "label": "Ранжирование",
    "kind": "single",
    "description": "Средние ранги совпадающих значений; проверка суммы рангов."
  },
  {
    "id": "standardize",
    "label": "Z-оценки и стандартная шкала",
    "kind": "single",
    "description": "Z-преобразование по выборке или явно заданным внешним параметрам; линейная стандартная шкала.",
    "parameters": [
      {
        "key": "targetMean",
        "label": "Среднее новой шкалы",
        "value": 50
      },
      {
        "key": "targetSd",
        "label": "Стандартное отклонение новой шкалы",
        "value": 10,
        "min": 1e-06
      },
      {
        "key": "basis",
        "label": "База стандартизации",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Выбранная выборка"
          },
          {
            "value": 1,
            "label": "Внешние параметры · задайте ниже"
          }
        ]
      },
      {
        "key": "referenceMean",
        "label": "Внешнее среднее · используется при внешней базе",
        "value": 0
      },
      {
        "key": "referenceSd",
        "label": "Внешнее SD · используется при внешней базе",
        "value": 1,
        "min": 1e-06
      }
    ]
  },
  {
    "id": "ks_normal",
    "label": "Колмогоров—Смирнов · заданное распределение",
    "kind": "single",
    "description": "Полностью заданное нормальное, равномерное или экспоненциальное распределение. Параметры задаются независимо от проверяемой выборки.",
    "parameters": [
      {
        "key": "distribution",
        "label": "Теоретическое распределение",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Нормальное"
          },
          {
            "value": 1,
            "label": "Равномерное на [loc; loc+scale]"
          },
          {
            "value": 2,
            "label": "Экспоненциальное · loc + Exp(scale)"
          }
        ]
      },
      {
        "key": "referenceMean",
        "label": "Расположение · μ / loc",
        "value": 0
      },
      {
        "key": "referenceSd",
        "label": "Масштаб · σ / scale",
        "value": 1,
        "min": 1e-06
      }
    ]
  },
  {
    "id": "lilliefors",
    "label": "Нормальность · Лиллиефорс",
    "kind": "single",
    "description": "KS с корректной калибровкой для среднего и дисперсии, оценённых по этим данным."
  },
  {
    "id": "ks_two",
    "label": "Колмогоров—Смирнов · две группы",
    "kind": "independent",
    "description": "Сравнение распределений двух независимых групп. При совпадениях непрерывная модель требует осторожности."
  },
  {
    "id": "variance_f",
    "label": "F-критерий дисперсий",
    "kind": "independent",
    "description": "Двустороннее сравнение двух дисперсий при нормальности данных."
  },
  {
    "id": "levene",
    "label": "Ливен · равенство дисперсий",
    "kind": "multiple",
    "description": "Сравнение дисперсий с центрированием по среднему."
  },
  {
    "id": "brown_forsythe",
    "label": "Браун—Форсайт · равенство дисперсий",
    "kind": "multiple",
    "description": "Устойчивый вариант Ливена с центрированием по медиане."
  },
  {
    "id": "t_independent",
    "label": "t Стьюдента · независимые группы",
    "kind": "independent",
    "description": "Разность средних с объединённой оценкой дисперсии; предполагается равенство дисперсий."
  },
  {
    "id": "friedman",
    "label": "Хи-квадрат Фридмана",
    "kind": "repeated",
    "minInputs": 3,
    "description": "Сравнение трёх и более связанных показателей одних участников."
  },
  {
    "id": "page",
    "label": "L Пейджа",
    "kind": "repeated",
    "minInputs": 3,
    "description": "Направленная проверка возрастания связанных условий. Порядок показателей задаёт ожидаемое возрастание."
  },
  {
    "id": "jonckheere",
    "label": "Джонкира—Терпстры",
    "kind": "multiple",
    "description": "Направленная тенденция возрастания независимых групп в указанном порядке; перестановочный p с фиксированным seed."
  },
  {
    "id": "runs",
    "label": "Критерий серий",
    "kind": "single",
    "description": "Двусторонняя проверка случайности последовательности относительно медианы. Порядок — порядок сохранённого состава; равные медиане исключаются."
  },
  {
    "id": "chisquare_gof",
    "label": "Хи-квадрат согласия",
    "kind": "single",
    "description": "Наблюдаемые и теоретические частоты. Можно задать вероятности для наблюдаемых категорий; ожидаемые частоты показаны в отчёте.",
    "parameters": [],
    "vectors": [
      {
        "key": "probabilities",
        "label": "Ожидаемые вероятности по возрастанию кодов категорий · необязательно",
        "placeholder": "Например: 0.2, 0.3, 0.5. Пусто — равные вероятности"
      }
    ]
  },
  {
    "id": "chisquare",
    "label": "Хи-квадрат независимости",
    "kind": "paired",
    "description": "Связь двух категориальных показателей с числовыми кодами; таблица сопряжённости и ожидаемые частоты.",
    "roles": [
      "Категория по строкам",
      "Категория по столбцам"
    ]
  },
  {
    "id": "fisher",
    "label": "Точный критерий Фишера",
    "kind": "paired",
    "description": "Двусторонний точный тест для таблицы 2×2; каждый показатель должен иметь две категории.",
    "roles": [
      "Первый бинарный показатель",
      "Второй бинарный показатель"
    ]
  },
  {
    "id": "mcnemar",
    "label": "Мак-Немара · точный",
    "kind": "paired",
    "description": "Сравнение связанных бинарных исходов с кодами 0 и 1; точный биномиальный p.",
    "roles": [
      "Первый замер · 0/1",
      "Второй замер · 0/1"
    ]
  },
  {
    "id": "binomial",
    "label": "Биномиальный критерий",
    "kind": "single",
    "description": "Проверка доли единиц среди исходов 0/1 относительно заданной вероятности.",
    "parameters": [
      {
        "key": "probability",
        "label": "Вероятность по нулевой гипотезе",
        "value": 0.5,
        "min": 1e-06,
        "max": 0.999999
      }
    ]
  },
  {
    "id": "phi_star",
    "label": "φ* · угловое преобразование Фишера",
    "kind": "independent",
    "description": "Двустороннее сравнение долей единиц в независимых бинарных группах; асимптотический p."
  },
  {
    "id": "pointbiserial",
    "label": "Точечно-бисериальная корреляция",
    "kind": "paired",
    "description": "Связь естественной бинарной переменной 0/1 с количественной.",
    "roles": [
      "Бинарный показатель · 0/1",
      "Количественный показатель"
    ]
  },
  {
    "id": "biserial",
    "label": "Бисериальная корреляция",
    "kind": "paired",
    "description": "Оценка связи при искусственном разбиении скрытой нормальной переменной на 0/1; отдельный p не определяется.",
    "roles": [
      "Искусственная дихотомия · 0/1",
      "Количественный показатель"
    ]
  },
  {
    "id": "rankbiserial",
    "label": "Рангово-бисериальная корреляция",
    "kind": "independent",
    "description": "Связь рангов с принадлежностью к группе; положительное значение означает более высокие значения первой группы."
  },
  {
    "id": "eta",
    "label": "Корреляционное отношение η",
    "kind": "paired",
    "description": "Доля вариации числового показателя, объясняемая числовыми кодами категорий.",
    "roles": [
      "Групповой фактор · код категории",
      "Количественный показатель"
    ]
  },
  {
    "id": "partial",
    "label": "Частная корреляция Пирсона",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Связь первых двух показателей после линейного контроля остальных.",
    "roles": [
      "Первый показатель",
      "Второй показатель",
      "Контролируемый показатель"
    ]
  },
  {
    "id": "correlation_matrix",
    "label": "Матрица корреляций",
    "kind": "multivariate",
    "description": "Пирсон, Спирмен или Кендалл; полные случаи по всем показателям и поправка Холма по уникальным парам.",
    "parameters": [
      {
        "key": "coefficient",
        "label": "Коэффициент связи",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Пирсон"
          },
          {
            "value": 1,
            "label": "Спирмен"
          },
          {
            "value": 2,
            "label": "Кендалл τ-b"
          }
        ]
      }
    ]
  },
  {
    "id": "compare_correlations",
    "label": "Различие зависимых корреляций · общая переменная",
    "kind": "multivariate",
    "minInputs": 3,
    "maxInputs": 3,
    "description": "Критерий Уильямса для r(X,Y) и r(X,Z) на одних участниках.",
    "roles": [
      "Общая переменная X",
      "Переменная Y",
      "Переменная Z"
    ]
  },
  {
    "id": "welch_anova",
    "label": "Однофакторный ANOVA Уэлча",
    "kind": "multiple",
    "description": "Сравнение средних независимых групп при неравенстве дисперсий."
  },
  {
    "id": "repeated_anova",
    "label": "ANOVA · повторные измерения",
    "kind": "repeated",
    "minInputs": 3,
    "description": "Однофакторный связанный план, поправка Гринхауса—Гейссера и оценка сферичности."
  },
  {
    "id": "tukey",
    "label": "Post-hoc · Тьюки / Крамер",
    "kind": "multiple",
    "description": "Все попарные разности средних с контролем семейной ошибки и доверительными интервалами."
  },
  {
    "id": "games_howell",
    "label": "Post-hoc · Геймс—Хауэлл",
    "kind": "multiple",
    "description": "Попарные разности независимых средних при неравных дисперсиях."
  },
  {
    "id": "dunn",
    "label": "Post-hoc · Данн",
    "kind": "multiple",
    "description": "Попарные сравнения объединённых средних рангов с поправкой на совпадения и Холма."
  },
  {
    "id": "nemenyi",
    "label": "Post-hoc · Немени для связанных данных",
    "kind": "repeated",
    "minInputs": 3,
    "description": "Сравнение средних внутриблочных рангов; не независимый книжный вариант Немени."
  },
  {
    "id": "regression",
    "label": "Линейная регрессия",
    "kind": "multivariate",
    "description": "Первый показатель — зависимая переменная, остальные — предикторы; интерсепт, ДИ, R² и диагностика.",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор X"
    ]
  },
  {
    "id": "regression_hierarchical",
    "label": "Иерархическая регрессия",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Последовательное добавление предикторов в указанном порядке; ΔR² и вложенные F-тесты.",
    "roles": [
      "Зависимая переменная Y",
      "Первый предиктор",
      "Следующий предиктор"
    ]
  },
  {
    "id": "regression_quadratic",
    "label": "Квадратичная регрессия",
    "kind": "paired",
    "description": "Модель Y = b₀ + b₁X + b₂X², коэффициенты и диагностика.",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор X"
    ]
  },
  {
    "id": "regression_exponential",
    "label": "Экспоненциальная регрессия",
    "kind": "paired",
    "description": "ln(Y) = b₀ + b₁X; только положительные Y. Ошибки и вывод относятся к логарифму Y.",
    "roles": [
      "Положительная зависимая Y",
      "Предиктор X"
    ]
  },
  {
    "id": "regression_power",
    "label": "Степенная регрессия",
    "kind": "paired",
    "description": "ln(Y) = b₀ + b₁ln(X); только положительные X и Y; логарифмическая модель ошибок.",
    "roles": [
      "Положительная зависимая Y",
      "Положительный предиктор X"
    ]
  },
  {
    "id": "factorial_anova",
    "label": "Многофакторный независимый ANOVA",
    "kind": "multivariate",
    "minInputs": 3,
    "maxInputs": 5,
    "description": "От двух до четырёх фиксированных факторов со всеми взаимодействиями; суммы квадратов типа II, минимум два наблюдения в каждой ячейке.",
    "roles": [
      "Зависимая переменная Y",
      "Первый фактор · код категории",
      "Следующий фактор · код категории"
    ]
  },
  {
    "id": "manova",
    "label": "MANOVA",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Первая колонка — групповой фактор, остальные — зависимые показатели; Pillai, Wilks, Hotelling, Roy.",
    "roles": [
      "Групповой фактор · код категории",
      "Первый зависимый показатель",
      "Следующий зависимый показатель"
    ]
  },
  {
    "id": "pca",
    "label": "Метод главных компонент · PCA",
    "kind": "multivariate",
    "description": "Стандартизованные показатели, собственные значения, нагрузки и оценки компонент.",
    "parameters": [
      {
        "key": "components",
        "label": "Число компонент",
        "value": 2,
        "min": 1,
        "max": 7,
        "integer": true
      },
      {
        "key": "basis",
        "label": "Матрица разложения",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Корреляционная · Z-оценки"
          },
          {
            "value": 1,
            "label": "Ковариационная · исходные единицы"
          }
        ]
      },
      {
        "key": "selection",
        "label": "Как определить число осей",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Задать вручную"
          },
          {
            "value": 1,
            "label": "Кайзер · λ > 1"
          },
          {
            "value": 2,
            "label": "Параллельный анализ · 95%, 200 повторов"
          }
        ]
      }
    ]
  },
  {
    "id": "efa_pa",
    "label": "Факторный анализ · главные оси",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Извлечение общих факторов методом главных осей; varimax, общности, KMO и тест Бартлетта.",
    "parameters": [
      {
        "key": "components",
        "label": "Число факторов",
        "value": 1,
        "min": 1,
        "max": 6,
        "integer": true
      },
      {
        "key": "rotation",
        "label": "Вращение факторов",
        "value": 1,
        "options": [
          {
            "value": 0,
            "label": "Без вращения"
          },
          {
            "value": 1,
            "label": "Varimax"
          },
          {
            "value": 2,
            "label": "Quartimax"
          },
          {
            "value": 3,
            "label": "Equamax"
          },
          {
            "value": 4,
            "label": "Oblimin · γ=0"
          },
          {
            "value": 5,
            "label": "Promax · k=2"
          }
        ]
      },
      {
        "key": "selection",
        "label": "Как определить число осей",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Задать вручную"
          },
          {
            "value": 1,
            "label": "Кайзер · λ > 1"
          },
          {
            "value": 2,
            "label": "Параллельный анализ · 95%, 200 повторов"
          }
        ]
      }
    ]
  },
  {
    "id": "efa_ml",
    "label": "Факторный анализ · максимальное правдоподобие",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Общие факторы ML; varimax, общности и диагностика сходимости.",
    "parameters": [
      {
        "key": "components",
        "label": "Число факторов",
        "value": 1,
        "min": 1,
        "max": 6,
        "integer": true
      },
      {
        "key": "rotation",
        "label": "Вращение факторов",
        "value": 1,
        "options": [
          {
            "value": 0,
            "label": "Без вращения"
          },
          {
            "value": 1,
            "label": "Varimax"
          },
          {
            "value": 2,
            "label": "Quartimax"
          },
          {
            "value": 3,
            "label": "Equamax"
          },
          {
            "value": 4,
            "label": "Oblimin · γ=0"
          },
          {
            "value": 5,
            "label": "Promax · k=2"
          }
        ]
      },
      {
        "key": "selection",
        "label": "Как определить число осей",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Задать вручную"
          },
          {
            "value": 1,
            "label": "Кайзер · λ > 1"
          },
          {
            "value": 2,
            "label": "Параллельный анализ · 95%, 200 повторов"
          }
        ]
      }
    ]
  },
  {
    "id": "discriminant",
    "label": "Линейный дискриминантный анализ",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Первая колонка — известный класс, остальные — признаки; канонические координаты и проверка leave-one-out.",
    "roles": [
      "Класс · код категории",
      "Первый признак",
      "Следующий признак"
    ]
  },
  {
    "id": "cluster",
    "label": "Иерархическая кластеризация",
    "kind": "multivariate",
    "description": "Кластеризация профилей участников: выбор связи, расстояния и стандартизации; история объединений.",
    "parameters": [
      {
        "key": "clusters",
        "label": "Число кластеров",
        "value": 2,
        "min": 2,
        "max": 20,
        "integer": true
      },
      {
        "key": "linkage",
        "label": "Способ объединения",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Уорд"
          },
          {
            "value": 1,
            "label": "Одиночная связь"
          },
          {
            "value": 2,
            "label": "Полная связь"
          },
          {
            "value": 3,
            "label": "Средняя связь"
          },
          {
            "value": 4,
            "label": "Взвешенная связь"
          },
          {
            "value": 5,
            "label": "Центроид"
          },
          {
            "value": 6,
            "label": "Медианная связь"
          }
        ]
      },
      {
        "key": "metric",
        "label": "Расстояние",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Евклидово"
          },
          {
            "value": 1,
            "label": "Квадрат евклидова"
          },
          {
            "value": 2,
            "label": "Манхэттенское"
          },
          {
            "value": 3,
            "label": "Чебышёва"
          },
          {
            "value": 4,
            "label": "Косинусное"
          },
          {
            "value": 5,
            "label": "Корреляционное"
          },
          {
            "value": 6,
            "label": "Хэмминга"
          },
          {
            "value": 7,
            "label": "Жаккара"
          },
          {
            "value": 8,
            "label": "χ² · частотные профили"
          }
        ]
      },
      {
        "key": "standardize",
        "label": "Стандартизация признаков",
        "value": 1,
        "options": [
          {
            "value": 1,
            "label": "Z по выборке"
          },
          {
            "value": 0,
            "label": "Исходные значения"
          }
        ]
      },
      {
        "key": "objects",
        "label": "Что кластеризовать",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Участников"
          },
          {
            "value": 1,
            "label": "Показатели · профили по участникам"
          }
        ]
      }
    ]
  },
  {
    "id": "mds_classical",
    "label": "Метрическое шкалирование Торгерсона",
    "kind": "multivariate",
    "description": "Евклидовы расстояния между стандартизованными профилями участников; собственные значения и координаты.",
    "parameters": [
      {
        "key": "components",
        "label": "Размерность",
        "value": 2,
        "min": 1,
        "max": 3,
        "integer": true
      }
    ]
  },
  {
    "id": "mds_nonmetric",
    "label": "Неметрическое шкалирование",
    "kind": "multivariate",
    "description": "Порядок евклидовых расстояний между стандартизованными профилями; фиксированный seed, stress и сходимость.",
    "parameters": [
      {
        "key": "components",
        "label": "Размерность",
        "value": 2,
        "min": 1,
        "max": 3,
        "integer": true
      }
    ]
  },
  {
    "id": "normal_scores",
    "label": "Нормализованные ранговые оценки",
    "kind": "single",
    "description": "Ранговая нормализация по формуле Блома; не опубликованные психологические нормы."
  },
  {
    "id": "kendall_a",
    "label": "Корреляция Кендалла τ-a",
    "kind": "paired",
    "description": "Доля согласованных минус несогласованных пар среди всех пар. Совпадения остаются в знаменателе; перестановочный p."
  },
  {
    "id": "rosenbaum",
    "label": "Q Розенбаума · перестановочный",
    "kind": "independent",
    "description": "Сумма крайних наблюдений в направлении первой группы выше второй; перестановочный p вместо книжных критических таблиц."
  },
  {
    "id": "paired_posthoc",
    "label": "Post-hoc · парные Вилкоксоны",
    "kind": "repeated",
    "minInputs": 3,
    "description": "Попарные связанные сравнения с поправкой Холма по всему семейству."
  },
  {
    "id": "scheffe",
    "label": "Post-hoc · Шеффе",
    "kind": "multiple",
    "description": "Попарные контрасты независимых средних с защитой семейства всех линейных контрастов."
  },
  {
    "id": "repeated_factorial",
    "label": "Двухфакторный ANOVA · повторные измерения",
    "kind": "repeated",
    "minInputs": 4,
    "description": "Полный связанный план A×B. Колонки идут A1B1, A1B2, …, A2B1, A2B2. Поправка GG отдельно для каждого эффекта.",
    "parameters": [
      {
        "key": "levelsA",
        "label": "Уровней фактора A",
        "value": 2,
        "min": 2,
        "max": 4,
        "integer": true
      }
    ]
  },
  {
    "id": "mixed_anova",
    "label": "Смешанный ANOVA · группа × замер",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Первый показатель — независимая группа, далее связанные замеры. В этой версии размеры групп должны быть равны; GG для связанных эффектов.",
    "roles": [
      "Группа · код категории",
      "Первый замер",
      "Следующий замер"
    ]
  },
  {
    "id": "regression_forward",
    "label": "Регрессия · прямое включение",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Добавление предикторов по снижению AIC. Вся траектория сохраняется; p после отбора не подтверждающие.",
    "roles": [
      "Зависимая переменная Y",
      "Кандидат в предикторы"
    ]
  },
  {
    "id": "regression_backward",
    "label": "Регрессия · обратное исключение",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Исключение предикторов по снижению AIC; траектория и ограничения post-selection inference.",
    "roles": [
      "Зависимая переменная Y",
      "Кандидат в предикторы"
    ]
  },
  {
    "id": "regression_stepwise",
    "label": "Регрессия · пошаговый отбор",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Включение и исключение предикторов по снижению AIC; результаты отбора разведочные.",
    "roles": [
      "Зависимая переменная Y",
      "Кандидат в предикторы"
    ]
  },
  {
    "id": "sample_size_mean",
    "label": "Объём выборки · точность среднего",
    "kind": "single",
    "description": "Приближённый объём для заданной полуширины нормального ДИ. Дисперсия оценивается по выбранной предварительной выборке.",
    "parameters": [
      {
        "key": "precision",
        "label": "Допустимая ошибка среднего · ±",
        "value": 1,
        "min": 1e-06
      },
      {
        "key": "population",
        "label": "Размер совокупности · 0 если неизвестен",
        "value": 0,
        "min": 0,
        "max": 1000000000,
        "integer": true
      }
    ]
  },
  {
    "id": "sample_size_proportion",
    "label": "Объём выборки · точность доли",
    "kind": "single",
    "description": "Нормальное приближение для доли; исходы 0/1 в предварительной выборке. Не гарантирует репрезентативность отбора.",
    "parameters": [
      {
        "key": "precision",
        "label": "Допустимая ошибка доли · ±",
        "value": 0.05,
        "min": 1e-06,
        "max": 0.5
      },
      {
        "key": "population",
        "label": "Размер совокупности · 0 если неизвестен",
        "value": 0,
        "min": 0,
        "max": 1000000000,
        "integer": true
      }
    ]
  },
  {
    "id": "compare_independent_correlations",
    "label": "Различие независимых корреляций Пирсона",
    "kind": "paired_groups",
    "minInputs": 4,
    "maxInputs": 4,
    "description": "Две пары показателей в двух непересекающихся выборках. Fisher z; не применим к зависимым выборкам или ранговым коэффициентам.",
    "roles": [
      "Первая выборка · X",
      "Первая выборка · Y",
      "Вторая выборка · X",
      "Вторая выборка · Y"
    ]
  },
  {
    "id": "linkwallace",
    "label": "Линка—Уоллеса · перестановочный",
    "kind": "multiple",
    "minInputs": 3,
    "maxInputs": 8,
    "description": "Книжная статистика размахов для равных независимых групп; p по перестановкам, а не по критической таблице."
  },
  {
    "id": "nemenyi_independent",
    "label": "Немени · независимые группы",
    "kind": "multiple",
    "minInputs": 3,
    "maxInputs": 10,
    "description": "Равные независимые группы, объединённые ранги и попарные сравнения studentized range; отдельный вариант от связанных блоков."
  },
  {
    "id": "mds_matrix_classical",
    "label": "Торгерсон · заданная матрица различий",
    "kind": "manual",
    "description": "Квадратная симметричная матрица неотрицательных различий с нулевой диагональю; одинаковый порядок объектов по строкам и столбцам.",
    "parameters": [
      {
        "key": "components",
        "label": "Размерность",
        "value": 2,
        "min": 1,
        "max": 3,
        "integer": true
      }
    ]
  },
  {
    "id": "mds_matrix_nonmetric",
    "label": "Неметрическое MDS · заданная матрица",
    "kind": "manual",
    "description": "Квадратная матрица различий; вне диагонали нужны положительные значения. Фиксированный seed, stress и сходимость.",
    "parameters": [
      {
        "key": "components",
        "label": "Размерность",
        "value": 2,
        "min": 1,
        "max": 3,
        "integer": true
      }
    ]
  },
  {
    "id": "mds_individual",
    "label": "Индивидуальные различия · INDSCAL",
    "kind": "manual",
    "description": "Массив из 2–10 согласованных матриц различий. Общая конфигурация и неотрицательные веса индивидуальных осей; минимизация strain скалярных произведений.",
    "parameters": [
      {
        "key": "components",
        "label": "Размерность",
        "value": 2,
        "min": 1,
        "max": 3,
        "integer": true
      }
    ]
  },
  {
    "id": "mds_preference",
    "label": "Развёртывание предпочтений · unfolding",
    "kind": "manual",
    "description": "Прямоугольная матрица различий «участник × объект»: меньшее значение означает большее предпочтение. Метрическая модель расстояний; локальное решение, четыре старта.",
    "parameters": [
      {
        "key": "components",
        "label": "Размерность",
        "value": 2,
        "min": 1,
        "max": 3,
        "integer": true
      }
    ]
  },
  {
    "id": "efa_uls",
    "label": "Факторный анализ · невзвешенные наименьшие квадраты",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Невзвешенные наименьшие квадраты: общий факторный план с положительной уникальностью, заданным вращением и диагностикой оптимизации.",
    "parameters": [
      {
        "key": "components",
        "label": "Число факторов",
        "value": 1,
        "min": 1,
        "max": 6,
        "integer": true
      },
      {
        "key": "rotation",
        "label": "Вращение факторов",
        "value": 1,
        "options": [
          {
            "value": 0,
            "label": "Без вращения"
          },
          {
            "value": 1,
            "label": "Varimax"
          },
          {
            "value": 2,
            "label": "Quartimax"
          },
          {
            "value": 3,
            "label": "Equamax"
          },
          {
            "value": 4,
            "label": "Oblimin · γ=0"
          },
          {
            "value": 5,
            "label": "Promax · k=2"
          }
        ]
      },
      {
        "key": "selection",
        "label": "Как определить число осей",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Задать вручную"
          },
          {
            "value": 1,
            "label": "Кайзер · λ > 1"
          },
          {
            "value": 2,
            "label": "Параллельный анализ · 95%, 200 повторов"
          }
        ]
      }
    ]
  },
  {
    "id": "efa_gls",
    "label": "Факторный анализ · обобщённые наименьшие квадраты",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Обобщённые наименьшие квадраты: общий факторный план с положительной уникальностью, заданным вращением и диагностикой оптимизации.",
    "parameters": [
      {
        "key": "components",
        "label": "Число факторов",
        "value": 1,
        "min": 1,
        "max": 6,
        "integer": true
      },
      {
        "key": "rotation",
        "label": "Вращение факторов",
        "value": 1,
        "options": [
          {
            "value": 0,
            "label": "Без вращения"
          },
          {
            "value": 1,
            "label": "Varimax"
          },
          {
            "value": 2,
            "label": "Quartimax"
          },
          {
            "value": 3,
            "label": "Equamax"
          },
          {
            "value": 4,
            "label": "Oblimin · γ=0"
          },
          {
            "value": 5,
            "label": "Promax · k=2"
          }
        ]
      },
      {
        "key": "selection",
        "label": "Как определить число осей",
        "value": 0,
        "options": [
          {
            "value": 0,
            "label": "Задать вручную"
          },
          {
            "value": 1,
            "label": "Кайзер · λ > 1"
          },
          {
            "value": 2,
            "label": "Параллельный анализ · 95%, 200 повторов"
          }
        ]
      }
    ]
  },
  {
    "id": "discriminant_stepwise",
    "label": "Дискриминантный анализ · прямой отбор",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Включение признаков по внутренней 2-fold balanced accuracy; внешняя 3-fold проверка переобучает и отбор, и LDA. До 200 участников, минимум 6 на класс.",
    "roles": [
      "Класс · код категории",
      "Кандидат в признаки"
    ]
  },
  {
    "id": "multiple_correlation",
    "label": "Множественная корреляция R",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Связь зависимой переменной с совокупностью предикторов: R=√R² линейной регрессии; общий F-тест.",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор"
    ]
  },
  {
    "id": "box_m",
    "label": "M Бокса · ковариационные матрицы",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Первая колонка — групповой фактор, остальные — количественные показатели; χ²-приближение и поправка.",
    "roles": [
      "Группа · код категории",
      "Количественный показатель"
    ]
  },
  {
    "id": "manova_repeated",
    "label": "Повторные измерения · многомерный подход",
    "kind": "repeated",
    "minInputs": 3,
    "description": "Связанные замеры преобразуются в независимые контрасты; T² Хотеллинга и точный F при многомерной нормальности."
  },
  {
    "id": "difference_pearson",
    "label": "Различие зависимых связей Пирсона · bootstrap",
    "kind": "multivariate",
    "minInputs": 4,
    "maxInputs": 4,
    "description": "Разность связей первых двух и последних двух показателей на общих участниках; парный bootstrap строк, 1999 повторов, percentile-ДИ и приближённый центрированный p.",
    "roles": [
      "Первая связь · X",
      "Первая связь · Y",
      "Вторая связь · X",
      "Вторая связь · Y"
    ]
  },
  {
    "id": "difference_spearman",
    "label": "Различие зависимых связей Спирмена · bootstrap",
    "kind": "multivariate",
    "minInputs": 4,
    "maxInputs": 4,
    "description": "Разность связей первых двух и последних двух показателей на общих участниках; парный bootstrap строк, 1999 повторов, percentile-ДИ и приближённый центрированный p.",
    "roles": [
      "Первая связь · X",
      "Первая связь · Y",
      "Вторая связь · X",
      "Вторая связь · Y"
    ]
  },
  {
    "id": "difference_kendall",
    "label": "Различие зависимых связей Кендалла · bootstrap",
    "kind": "multivariate",
    "minInputs": 4,
    "maxInputs": 4,
    "description": "Разность связей первых двух и последних двух показателей на общих участниках; парный bootstrap строк, 1999 повторов, percentile-ДИ и приближённый центрированный p.",
    "roles": [
      "Первая связь · X",
      "Первая связь · Y",
      "Вторая связь · X",
      "Вторая связь · Y"
    ]
  },
  {
    "id": "contrast",
    "label": "Плановый контраст независимых средних",
    "kind": "multiple",
    "description": "Коэффициенты контраста в порядке групп, сумма должна быть нулевой. Общая остаточная дисперсия ANOVA; один заранее заданный контраст.",
    "vectors": [
      {
        "key": "weights",
        "label": "Веса контраста",
        "placeholder": "Например: -1, 0.5, 0.5"
      }
    ]
  },
  {
    "id": "runs_two",
    "label": "Вальд—Вольфовиц · две группы",
    "kind": "independent",
    "description": "Число серий меток групп в объединённом сортированном ряду. Только без совпадений; двустороннее перестановочное сравнение."
  },
  {
    "id": "regression_logarithmic",
    "label": "Логарифмическая регрессия",
    "kind": "paired",
    "description": "Y=b₀+b₁ln(X); положительный X, исходная шкала Y и остатков.",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор X"
    ]
  },
  {
    "id": "regression_inverse",
    "label": "Обратная / гиперболическая регрессия",
    "kind": "paired",
    "description": "Y=b₀+b₁/X; X≠0, исходная шкала Y.",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор X"
    ]
  },
  {
    "id": "regression_cubic",
    "label": "Кубическая регрессия",
    "kind": "paired",
    "description": "Y=b₀+b₁X+b₂X²+b₃X³; исходная шкала Y и остатков.",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор X"
    ]
  },
  {
    "id": "regression_compare",
    "label": "Сравнение вложенных линейных моделей",
    "kind": "multivariate",
    "minInputs": 3,
    "description": "Полная модель включает все предикторы. Сокращённая — первые K предикторов. Одинаковые наблюдения, F изменения и ΔR².",
    "roles": [
      "Зависимая переменная Y",
      "Предиктор · в порядке включения"
    ],
    "parameters": [
      {
        "key": "basePredictors",
        "label": "Предикторов в сокращённой модели",
        "value": 1,
        "min": 1,
        "max": 13,
        "integer": true
      }
    ]
  },
  {
    "id": "cluster_matrix",
    "label": "Кластеризация · заданная матрица различий",
    "kind": "manual",
    "description": "Квадратная симметричная матрица различий между объектами; одиночная, полная, средняя или взвешенная связь.",
    "parameters": [
      {
        "key": "clusters",
        "label": "Число кластеров",
        "value": 2,
        "min": 2,
        "max": 59,
        "integer": true
      },
      {
        "key": "linkage",
        "label": "Способ объединения",
        "value": 2,
        "options": [
          {
            "value": 0,
            "label": "Одиночная связь"
          },
          {
            "value": 1,
            "label": "Полная связь"
          },
          {
            "value": 2,
            "label": "Средняя связь"
          },
          {
            "value": 3,
            "label": "Взвешенная связь"
          }
        ]
      }
    ]
  }
];
