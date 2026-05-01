import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  getChallengeById,
  getChallengeCollectionById,
  getChallengeCollections,
  getChallengeLevel,
  getRankBand,
  type ChallengeCollection,
  type ChallengeDefinition,
} from "@foruntendo/challenges";
import { ArrowRight, Check, CircleStop, RefreshCcw } from "lucide-react";
import { useDatabaseSnapshot } from "../../hooks/useDatabaseSnapshot.ts";
import { getCollectionProgress } from "../../lib/collection-progress.ts";
import { setActiveCollectionId, type ChallengeAttempt } from "../../lib/local-db.ts";
import { getPassedChallengeIds } from "../../lib/progress.ts";
import { routeTree } from "../__root.tsx";

export const collectionRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/collections/$collectionId",
  component: CollectionPage,
});

function LearnJavaScriptRuIcon() {
  return (
    <svg className="learn-js-icon" viewBox="0 0 100 100" role="img" aria-label="Learn JavaScript">
      <g fill="currentColor">
        <path d="M26 15 45 34 37 31 43 38 36 36 48 52 21 25 30 28 25 21 33 24z" />
        <path d="M74 15 55 34 63 31 57 38 64 36 52 52 79 25 70 28 75 21 67 24z" />
        <path d="M11 40 36 48 27 49 38 56 29 54 48 66 15 47 26 46 19 43 31 43z" />
        <path d="M89 40 64 48 73 49 62 56 71 54 52 66 85 47 74 46 81 43 69 43z" />
      </g>
      <circle cx="50" cy="49" r="10" fill="currentColor" />
      <circle cx="50" cy="49" r="4.5" className="learn-js-icon-hole" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 57 35 85" strokeWidth="8" />
        <path d="M56 57 65 85" strokeWidth="8" />
        <path d="M47 62 60 72" strokeWidth="6" />
        <path d="M41 76 64 85" strokeWidth="6" />
      </g>
    </svg>
  );
}

function CollectionHeroDescription({ isCourse, text }: { isCourse: boolean; text: string }) {
  if (!isCourse) {
    return <p className="collection-hero-description">{text}</p>;
  }

  return (
    <div className="collection-hero-description">
      <span>Практический маршрут по JavaScript: типы, условия и функции.</span>
      <span>
        Основан на логике{" "}
        <a href="https://learn.javascript.ru/" target="_blank" rel="noreferrer">
          learn.javascript.ru
        </a>
        .
      </span>
    </div>
  );
}

function CollectionHero({
  collection,
  attempts,
  isActive,
  isNestedSet,
  onToggleActive,
}: {
  collection: ChallengeCollection;
  attempts: ChallengeAttempt[];
  isActive: boolean;
  isNestedSet: boolean;
  onToggleActive: () => void;
}) {
  const progress = getCollectionProgress(collection, attempts);
  const startLabel = collection.kind === "course" ? "Начать курс" : "Начать обучение";
  const hasStarted = isActive || progress.completed > 0;
  const isCourse = collection.kind === "course";
  const isSet = collection.kind === "set";
  const showLearningAction = isCourse || !isNestedSet;
  const heroMark = collection.tag.split("/")[1] ?? "JS";

  return (
    <section
      className={`collection-hero ${isActive ? "active" : ""} ${isSet ? "set" : ""} ${
        isNestedSet ? "nested-set" : ""
      }`}
    >
      <div className="collection-hero-main">
        <div className="collection-hero-copy">
          <div className="collection-hero-title-row">
            {!isSet && (
              <div
                className={`collection-hero-mark ${isCourse ? "course-icon" : ""}`}
                aria-hidden="true"
              >
                {isCourse ? <LearnJavaScriptRuIcon /> : heroMark}
              </div>
            )}
            <div>
              <h1>{collection.title}</h1>
            </div>
          </div>
          {!isSet && (
            <CollectionHeroDescription isCourse={isCourse} text={collection.description} />
          )}
        </div>
        {isNestedSet && (
          <div className="collection-hero-inline-progress" aria-label={`${progress.percent}%`}>
            <div>
              <span className="collection-hero-inline-percent">{progress.percent}%</span>
              <span className="collection-hero-inline-count">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <div className="collection-progress" aria-hidden="true">
              <span style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}
        {showLearningAction && hasStarted ? (
          <div className="collection-hero-progress">
            <div className="collection-hero-progress-header">
              <span className="knowledge-stat-value">{progress.percent}% Прогресс</span>
              <div className="collection-hero-progress-actions">
                <button
                  type="button"
                  className="collection-progress-icon"
                  onClick={onToggleActive}
                  aria-label={isActive ? "Курс уже активен" : "Сделать курс активным"}
                  disabled={isActive}
                >
                  <RefreshCcw size={18} />
                </button>
                <button
                  type="button"
                  className="collection-progress-icon"
                  onClick={onToggleActive}
                  aria-label="Убрать курс из активных"
                  disabled={!isActive}
                >
                  <CircleStop size={18} />
                </button>
              </div>
            </div>
            <div className="collection-hero-progress-row">
              <div className="collection-progress large" aria-label={`${progress.percent}%`}>
                <span style={{ width: `${progress.percent}%` }} />
              </div>
              <span className="collection-progress-completed">
                {progress.completed}/{progress.total} completed
              </span>
            </div>
          </div>
        ) : showLearningAction ? (
          <button type="button" className="collection-start-button" onClick={onToggleActive}>
            {startLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function getLanguageBadge(language: string) {
  if (language === "javascript") return "JS";
  if (language === "typescript") return "TS";
  return language.toUpperCase();
}

function ChallengeListRow({
  challenge,
  index,
  isPassed,
  onClick,
}: {
  challenge: ChallengeDefinition;
  index: number;
  isPassed: boolean;
  onClick: () => void;
}) {
  const rankBand = getRankBand(challenge.rank);
  const rankTone = Math.min(5, Math.max(0, getChallengeLevel(challenge.rank) - 1));

  return (
    <button type="button" className="collection-task-row" onClick={onClick}>
      <span className={`collection-task-status ${isPassed ? "passed" : ""}`} aria-hidden="true">
        {isPassed ? <Check size={26} strokeWidth={3} /> : index + 1}
      </span>
      <span className="collection-task-body">
        <span className="collection-task-title">{challenge.title}</span>
        <span className="collection-task-description">{challenge.description.split("\n")[0]}</span>
        <span className="collection-task-meta">
          <span className="collection-task-kind">JS</span>
          <span>{challenge.group}</span>
          <span className={`collection-task-rank rank-tone-${rankTone}`}>{rankBand.label}</span>
          {challenge.languages.map((language) => (
            <span key={language} className={`collection-task-language ${language}`}>
              {getLanguageBadge(language)}
            </span>
          ))}
        </span>
      </span>
      <ArrowRight
        className="collection-task-arrow"
        size={32}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </button>
  );
}

function groupChildCollections(collections: ChallengeCollection[]) {
  const groups = new Map<
    string,
    {
      description: string | undefined;
      collections: ChallengeCollection[];
    }
  >();

  for (const collection of collections) {
    const title = collection.sectionTitle ?? "Раздел";
    const group = groups.get(title) ?? {
      description: collection.sectionDescription,
      collections: [],
    };

    group.collections.push(collection);
    groups.set(title, group);
  }

  return [...groups.entries()].map(([title, group]) => ({
    title,
    ...group,
  }));
}

function CollectionPage() {
  const navigate = useNavigate();
  const { collectionId } = useParams({ from: "/collections/$collectionId" });
  const collection = getChallengeCollectionById(collectionId);
  const { activeCollectionId, attempts } = useDatabaseSnapshot();

  if (!collection) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Набор не найден</h1>
          <p className="page-subtitle">Нет набора с id "{collectionId}".</p>
        </div>
      </div>
    );
  }

  const collections = getChallengeCollections();
  const childCollections = collection.childCollectionIds
    .map((childCollectionId) =>
      collections.find((currentCollection) => currentCollection.id === childCollectionId),
    )
    .filter((childCollection): childCollection is ChallengeCollection => Boolean(childCollection));
  const childCollectionGroups = groupChildCollections(childCollections);
  const challenges = collection.challengeIds
    .map((challengeId) => getChallengeById(challengeId))
    .filter((challenge): challenge is ChallengeDefinition => Boolean(challenge));
  const isActive = collection.id === activeCollectionId;
  const isNestedSet = collection.kind === "set" && Boolean(collection.parentCollectionId);
  const passedChallengeIds = getPassedChallengeIds(attempts);

  return (
    <div className="container">
      <CollectionHero
        collection={collection}
        attempts={attempts}
        isActive={isActive}
        isNestedSet={isNestedSet}
        onToggleActive={() => {
          const nextActiveCollectionId = isActive ? undefined : collection.id;
          setActiveCollectionId(nextActiveCollectionId);
        }}
      />

      {childCollections.length > 0 && (
        <section className="course-content">
          <div className="section-heading">
            <h2>Содержание</h2>
            <p>
              Разделы курса ведут в отдельные списки задач. Их прогресс входит в общий прогресс.
            </p>
          </div>

          <div className="course-section-list">
            {childCollectionGroups.map((group) => (
              <section key={group.title} className="course-section">
                <div className="course-section-heading">
                  <h3>{group.title}</h3>
                  {group.description && <p>{group.description}</p>}
                </div>

                <div className="course-list">
                  {group.collections.map((childCollection) => {
                    const childProgress = getCollectionProgress(childCollection, attempts);
                    const isChildActive = childCollection.id === activeCollectionId;

                    return (
                      <button
                        key={childCollection.id}
                        type="button"
                        className={`course-list-item ${isChildActive ? "active" : ""}`}
                        onClick={() =>
                          void navigate({
                            to: "/collections/$collectionId",
                            params: { collectionId: childCollection.id },
                          })
                        }
                      >
                        <div>
                          <span className="collection-title">{childCollection.title}</span>
                          <span className="collection-desc">{childCollection.description}</span>
                        </div>
                        <div className="course-list-progress">
                          <span className="collection-meta">
                            {childProgress.completed}/{childProgress.total} задач
                          </span>
                          <div
                            className="collection-progress"
                            aria-label={`${childProgress.percent}%`}
                          >
                            <span style={{ width: `${childProgress.percent}%` }} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {childCollections.length === 0 && (
        <>
          <div className="collection-task-list">
            {challenges.map((challenge, index) => (
              <ChallengeListRow
                key={challenge.id}
                challenge={challenge}
                index={index}
                isPassed={passedChallengeIds.has(challenge.id)}
                onClick={() =>
                  void navigate({
                    to: "/challenges/$challengeId",
                    params: { challengeId: challenge.id },
                  })
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
