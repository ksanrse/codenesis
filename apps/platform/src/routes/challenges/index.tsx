import { createRoute, useNavigate } from "@tanstack/react-router";
import {
  filterChallenges,
  type Category,
  type ChallengeSort,
  getChallengeGroups,
  type Language,
} from "@foruntendo/challenges";
import { useState } from "react";
import { ChallengeCard } from "../../components/catalog/ChallengeCard.tsx";
import { FilterBar } from "../../components/catalog/FilterBar.tsx";
import { routeTree } from "../__root.tsx";

export const challengesRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/challenges",
  component: ChallengesPage,
});

function ChallengesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rankRange, setRankRange] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [group, setGroup] = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [sort, setSort] = useState<ChallengeSort>("default");
  const groups = getChallengeGroups();
  const [minRank, maxRank] = rankRange
    ? rankRange.split("-").map((value) => Number(value))
    : [undefined, undefined];

  const challenges = filterChallenges({
    search: search || undefined,
    minRank,
    maxRank,
    category: category || undefined,
    group: group || undefined,
    language: language || undefined,
    sort,
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1>Все задачи</h1>
        <p className="page-subtitle">
          Общий каталог задач с поиском, фильтрами по рангу, категории, группе и языку.
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        rankRange={rankRange}
        onRankRangeChange={setRankRange}
        category={category}
        onCategoryChange={setCategory}
        groups={groups}
        group={group}
        onGroupChange={setGroup}
        language={language}
        onLanguageChange={setLanguage}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onClick={() =>
              void navigate({
                to: "/challenges/$challengeId",
                params: { challengeId: challenge.id },
              })
            }
          />
        ))}
        {challenges.length === 0 && <p className="empty-state">По этим фильтрам задач нет.</p>}
      </div>
    </div>
  );
}
