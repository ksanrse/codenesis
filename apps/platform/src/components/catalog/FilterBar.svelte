<script lang="ts">
  import { RANK_BANDS, type Category, type ChallengeSort, type Language } from "@codenesis/challenges";
  import SelectMenu, { type SelectOption } from "../ui/SelectMenu.svelte";

  export let search = "";
  export let rankRange = "";
  export let category: Category | "" = "";
  export let groups: string[] = [];
  export let group = "";
  export let language: Language | "" = "";
  export let sort: ChallengeSort = "default";

  export let onSearchChange: (value: string) => void = () => undefined;
  export let onRankRangeChange: (value: string) => void = () => undefined;
  export let onCategoryChange: (value: Category | "") => void = () => undefined;
  export let onGroupChange: (value: string) => void = () => undefined;
  export let onLanguageChange: (value: Language | "") => void = () => undefined;
  export let onSortChange: (value: ChallengeSort) => void = () => undefined;

  const categories: Category[] = ["JavaScript", "TypeScript", "UI Components", "CSS", "Performance", "Architecture", "React", "Svelte", "Vue", "Accessibility"];
  const languages: Language[] = ["javascript", "typescript", "react", "svelte", "vue"];
  const rankOptions: SelectOption[] = [
    { value: "", label: "Все уровни" },
    ...RANK_BANDS.map((band) => ({ value: `${band.from}-${band.to}`, label: band.label })),
  ];
  const categoryOptions: SelectOption[] = [
    { value: "", label: "Все категории" },
    ...categories.map((item) => ({ value: item, label: item })),
  ];
  $: groupOptions = [{ value: "", label: "Все группы" }, ...groups.map((item) => ({ value: item, label: item }))];
  const languageLabels: Record<Language, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
  };
  const languageOptions: SelectOption[] = [
    { value: "", label: "Все языки" },
    ...languages.map((item) => ({ value: item, label: languageLabels[item] })),
  ];
  const sortOptions: SelectOption[] = [
    { value: "default", label: "По порядку" },
    { value: "rank-asc", label: "Сложность ↑" },
    { value: "rank-desc", label: "Сложность ↓" },
  ];
</script>

<div class="filter-bar">
  <input class="filter-search" type="text" placeholder="Поиск задач..." bind:value={search} on:input={() => onSearchChange(search)} />
  <SelectMenu label="Все уровни" ariaLabel="Уровень" options={rankOptions} value={rankRange} onChange={(next) => { rankRange = next; onRankRangeChange(next); }} />
  <SelectMenu label="Все категории" ariaLabel="Категория" options={categoryOptions} value={category} onChange={(next) => { category = next as Category | ""; onCategoryChange(category); }} />
  <SelectMenu label="Все группы" ariaLabel="Группа" options={groupOptions} value={group} onChange={(next) => { group = next; onGroupChange(next); }} />
  <SelectMenu label="Все языки" ariaLabel="Язык" options={languageOptions} value={language} onChange={(next) => { language = next as Language | ""; onLanguageChange(language); }} />
  <SelectMenu label="По порядку" ariaLabel="Сортировка" options={sortOptions} value={sort} onChange={(next) => { sort = next as ChallengeSort; onSortChange(sort); }} />
</div>
