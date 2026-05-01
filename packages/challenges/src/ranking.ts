export const MIN_RANK = 0;

export const CHALLENGE_LEVEL_MMR = [2, 3, 8, 21, 55, 149, 404, 1097] as const;
export const MAX_CHALLENGE_LEVEL = CHALLENGE_LEVEL_MMR.length;
export const MAX_RANK = MAX_CHALLENGE_LEVEL - 1;

export interface RankBand {
  id: string;
  label: string;
  shortLabel: string;
  from: number;
  to: number;
  description: string;
  technicalLevel: string;
  assignmentRule: string;
  googleMapping: string;
}

export interface RankGrade {
  label: string;
  from: number;
  to: number;
  description: string;
  level?: string;
}

export interface RankGradeMapping {
  provider: string;
  description: string;
  grades: RankGrade[];
}

export interface RankProgress {
  rank: number;
  title: string;
  nextTitle: string | undefined;
  score: number;
  currentRankScore: number;
  nextRankScore: number;
  progressPercent: number;
  remainingScore: number;
}

export const RANK_BANDS: RankBand[] = [
  {
    id: "f1",
    label: "F1",
    shortLabel: "F1",
    from: 0,
    to: 0,
    description: "Первый контакт с темой: одна очевидная операция без развилок и ловушек.",
    technicalLevel:
      "Достаточно узнать нужный синтаксис и вернуть значение. Условие помещается в одну мысль, а решение обычно занимает 1-3 строки.",
    assignmentRule:
      "Ставь F1, если задача проверяет только узнавание конструкции: вернуть результат оператора, вызвать функцию, собрать строку или сделать прямое преобразование.",
    googleMapping:
      "Ниже L3. Это учебная микрозадача, а не самостоятельная инженерная задача уровня стажировки.",
  },
  {
    id: "f2",
    label: "F2",
    shortLabel: "F2",
    from: 1,
    to: 1,
    description: "Небольшая функция с одним правилом и несколькими понятными примерами.",
    technicalLevel:
      "Нужно применить базовую конструкцию к 2-4 входным случаям. Ошибка обычно связана с тем, что один простой вариант забыли обработать.",
    assignmentRule:
      "Ставь F2, если решение все еще линейное, но уже требует различать несколько фиксированных вариантов или один простой edge case.",
    googleMapping:
      "Ниже L3. Может быть частью разминки для стажера, но само по себе не показывает готовность к Google L3.",
  },
  {
    id: "f3",
    label: "F3",
    shortLabel: "F3",
    from: 2,
    to: 2,
    description: "Несколько входных случаев, где важно не перепутать порядок проверок.",
    technicalLevel:
      "Появляются разные ветки поведения, значения по умолчанию, nullish/NaN/Infinity или похожие случаи. Код остается компактным, но требует аккуратности.",
    assignmentRule:
      "Ставь F3, если задача решается одной функцией без сложной декомпозиции, но имеет реальные edge cases или несколько независимых правил.",
    googleMapping:
      "Ниже L3 или нижняя граница L3-подготовки. Это уверенная учебная база, но еще не уровень интервью-задачи.",
  },
  {
    id: "f4",
    label: "F4",
    shortLabel: "F4",
    from: 3,
    to: 3,
    description: "Комбинация нескольких правил внутри одной функции.",
    technicalLevel:
      "Нужно удерживать 2-3 условия одновременно: группировать варианты, проверять приоритеты, возвращать разные структуры данных или нормализовать вход.",
    assignmentRule:
      "Ставь F4, если решение уже нельзя написать на автопилоте: надо прочитать условие целиком и выбрать порядок правил.",
    googleMapping:
      "Близко к нижней границе Google L3, если задача дана без подсказок и включает нормальные тесты на крайние случаи.",
  },
  {
    id: "f5",
    label: "F5",
    shortLabel: "F5",
    from: 4,
    to: 4,
    description: "Задача требует уверенного чтения условия и небольшой декомпозиции.",
    technicalLevel:
      "Появляются вложенные данные, несколько шагов обработки, устойчивость к неверному входу или необходимость отделить проверку от вычисления.",
    assignmentRule:
      "Ставь F5, если хороший код уже выигрывает у короткого: решение лучше разбить на понятные части или явно назвать промежуточные состояния.",
    googleMapping:
      "Соответствует простым задачам Google L3: уверенная база языка, читаемый код, корректные edge cases.",
  },
  {
    id: "f6",
    label: "F6",
    shortLabel: "F6",
    from: 5,
    to: 5,
    description: "Больше состояния, вложенной логики или требований к устойчивости.",
    technicalLevel:
      "Нужно проектировать поведение: хранить состояние, обходить коллекции, учитывать порядок вызовов, ошибки, повторное использование или ограничения API.",
    assignmentRule:
      "Ставь F6, если задача проверяет не только синтаксис, но и способность удержать контракт функции и не сломать поведение на серии действий.",
    googleMapping:
      "Средняя зона Google L3 и подготовка к L4: самостоятельная реализация небольшой надежной утилиты.",
  },
  {
    id: "f7",
    label: "F7",
    shortLabel: "F7",
    from: 6,
    to: 6,
    description: "Продвинутая практика с несколькими связанными ограничениями.",
    technicalLevel:
      "Решение похоже на маленький компонент или мини-движок: есть состояние, порядок операций, несколько типов входа, пограничные случаи и цена плохой архитектуры.",
    assignmentRule:
      "Ставь F7, если задачу сложно надежно решить без плана, тесты должны покрывать сценарии, а код должен оставаться поддерживаемым.",
    googleMapping:
      "Верхняя зона Google L3 и часть L4: задача уже показывает инженерную зрелость, но не требует соревновательных алгоритмов.",
  },
  {
    id: "f8",
    label: "F8",
    shortLabel: "F8",
    from: 7,
    to: MAX_RANK,
    description: "Экспертная задача: алгоритм, мини-интерпретатор или сложный полифил.",
    technicalLevel:
      "Нужно самостоятельно спроектировать алгоритм или поведение уровня встроенного механизма: много edge cases, строгая совместимость, нетривиальная модель выполнения.",
    assignmentRule:
      "Ставь F8 только если задачу нельзя честно решить одной учебной конструкцией: требуется системное рассуждение, полноценный набор тестов и опыт уровня сильного JavaScript-разработчика.",
    googleMapping:
      "Google L4+ по технической сложности. В алгоритмическом варианте может приближаться к L5, если требует оптимизации и строгого доказательства корректности.",
  },
];

export const MMR_GRADE_BANDS = [
  {
    id: "intern",
    label: "Интерн",
    from: 0,
    to: 119,
    description: "База языка и первые самостоятельные решения.",
  },
  {
    id: "junior",
    label: "Джун",
    from: 120,
    to: 699,
    description: "Уверенное решение небольших задач и чтение требований.",
  },
  {
    id: "middle",
    label: "Мидл",
    from: 700,
    to: 2499,
    description: "Стабильная работа со сложными условиями, edge cases и декомпозицией.",
  },
  {
    id: "senior",
    label: "Сеньор",
    from: 2500,
    to: Number.POSITIVE_INFINITY,
    description: "Сильная инженерная база, сложные ограничения и системное мышление.",
  },
] as const;

export const RANK_GRADE_MAPPINGS: RankGradeMapping[] = [
  {
    provider: "MMR",
    description: "Временная шкала уровня профиля. Позже названия и пороги можно уточнить.",
    grades: MMR_GRADE_BANDS.map((grade) => ({
      label: grade.label,
      level: grade.label,
      from: grade.from,
      to: Number.isFinite(grade.to) ? grade.to : grade.from,
      description: grade.description,
    })),
  },
];

export function clampRank(rank: number): number {
  return Math.min(MAX_RANK, Math.max(MIN_RANK, Math.trunc(rank)));
}

export function getChallengeLevel(rank: number): number {
  return Math.min(MAX_CHALLENGE_LEVEL, clampRank(rank) + 1);
}

export function getChallengeLevelLabel(rank: number): string {
  return `F${getChallengeLevel(rank)}`;
}

export function getChallengePoints(rank: number): number {
  return CHALLENGE_LEVEL_MMR[getChallengeLevel(rank) - 1] ?? CHALLENGE_LEVEL_MMR[0];
}

export function getRankBand(rank: number): RankBand {
  const safeRank = clampRank(rank);
  return RANK_BANDS.find((band) => safeRank >= band.from && safeRank <= band.to) ?? RANK_BANDS[0];
}

export function getRankTitle(rank: number): string {
  const safeRank = Math.min(rank, MMR_GRADE_BANDS.length - 1);
  return MMR_GRADE_BANDS[safeRank]?.label ?? MMR_GRADE_BANDS[0].label;
}

export function getUserRank(score: number): number {
  const safeScore = Math.max(0, Math.trunc(score));
  const gradeIndex = MMR_GRADE_BANDS.findIndex(
    (grade) => safeScore >= grade.from && safeScore <= grade.to,
  );
  return gradeIndex === -1 ? MMR_GRADE_BANDS.length - 1 : gradeIndex;
}

export function getRankProgress(score: number): RankProgress {
  const safeScore = Math.max(0, Math.trunc(score));
  const rank = getUserRank(safeScore);
  const currentGrade = MMR_GRADE_BANDS[rank] ?? MMR_GRADE_BANDS[0];
  const nextGrade = MMR_GRADE_BANDS[rank + 1];
  const currentRankScore = currentGrade.from;
  const nextRankScore = nextGrade?.from ?? currentRankScore;
  const span = Math.max(1, nextRankScore - currentRankScore);
  const progressPercent = nextGrade
    ? Math.min(100, Math.round(((safeScore - currentRankScore) / span) * 100))
    : 100;

  return {
    rank,
    title: currentGrade.label,
    nextTitle: nextGrade?.label,
    score: safeScore,
    currentRankScore,
    nextRankScore,
    progressPercent,
    remainingScore: nextGrade ? Math.max(0, nextRankScore - safeScore) : 0,
  };
}
