import {
  RANK_BANDS,
  type Category,
  type ChallengeSort,
  type Language,
} from "@foruntendo/challenges";

const categories: Category[] = [
  "JavaScript",
  "TypeScript",
  "UI Components",
  "CSS",
  "Performance",
  "Architecture",
  "React",
  "Svelte",
  "Vue",
  "Accessibility",
];
const languages: Language[] = ["javascript", "typescript", "react", "svelte", "vue"];

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  rankRange: string;
  onRankRangeChange: (v: string) => void;
  category: Category | "";
  onCategoryChange: (v: Category | "") => void;
  groups: string[];
  group: string;
  onGroupChange: (v: string) => void;
  language: Language | "";
  onLanguageChange: (v: Language | "") => void;
  sort: ChallengeSort;
  onSortChange: (v: ChallengeSort) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  rankRange,
  onRankRangeChange,
  category,
  onCategoryChange,
  groups,
  group,
  onGroupChange,
  language,
  onLanguageChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-search"
        placeholder="Поиск задач..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="filter-select"
        value={rankRange}
        onChange={(e) => onRankRangeChange(e.target.value)}
      >
        <option value="">Все уровни</option>
        {RANK_BANDS.map((band) => (
          <option key={band.id} value={`${band.from}-${band.to}`}>
            {band.label} · {band.description}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as Category | "")}
      >
        <option value="">Все категории</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={group}
        onChange={(e) => onGroupChange(e.target.value)}
      >
        <option value="">Все группы</option>
        {groups.map((currentGroup) => (
          <option key={currentGroup} value={currentGroup}>
            {currentGroup}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language | "")}
      >
        <option value="">Все языки</option>
        {languages.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as ChallengeSort)}
        aria-label="Сортировка"
      >
        <option value="default">По порядку</option>
        <option value="rank-asc">Сложность ↑</option>
        <option value="rank-desc">Сложность ↓</option>
      </select>
    </div>
  );
}
