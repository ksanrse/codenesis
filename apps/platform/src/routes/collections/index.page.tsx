import { useNavigate } from "@tanstack/react-router";
import { getChallengeCollections } from "@foruntendo/challenges";
import { ArrowRight, BookOpen } from "lucide-react";
import { useMemo } from "react";
import { useDatabaseSnapshot } from "../../hooks/useDatabaseSnapshot.ts";
import { getCollectionProgress } from "../../lib/collection-progress.ts";

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

export function CollectionsPage() {
  const navigate = useNavigate();
  const { activeCollectionId, attempts } = useDatabaseSnapshot();
  const collections = useMemo(
    () =>
      getChallengeCollections()
        .filter((collection) => !collection.parentCollectionId)
        .sort((left, right) => {
          if (left.id === activeCollectionId) return -1;
          if (right.id === activeCollectionId) return 1;
          return left.title.localeCompare(right.title);
        }),
    [activeCollectionId],
  );
  const courseCollections = useMemo(
    () => collections.filter((collection) => collection.kind === "course"),
    [collections],
  );
  const taskCollections = useMemo(
    () => collections.filter((collection) => collection.kind !== "course"),
    [collections],
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Наборы задач</h1>
        <p className="page-subtitle">
          Отдельные учебные треки с прогрессом, задачами и кнопкой начала обучения.
        </p>
      </div>

      {courseCollections.length > 0 && (
        <section className="collection-section">
          <div className="section-heading">
            <h2>Учебники и курсы</h2>
            <p>Маршруты из нескольких наборов задач с общим прогрессом.</p>
          </div>

          <div className="course-card-list">
            {courseCollections.map((collection) => {
              const progress = getCollectionProgress(collection, attempts);
              const isActive = collection.id === activeCollectionId;

              return (
                <button
                  key={collection.id}
                  type="button"
                  className={`course-card ${isActive ? "active" : ""}`}
                  onClick={() =>
                    void navigate({
                      to: "/collections/$collectionId",
                      params: { collectionId: collection.id },
                    })
                  }
                >
                  <span className="course-card-icon">
                    {collection.id === "javascript-textbook" ? (
                      <LearnJavaScriptRuIcon />
                    ) : (
                      <BookOpen size={30} />
                    )}
                  </span>
                  <span className="course-card-body">
                    <span className="course-card-title-row">
                      <span className="course-card-title">{collection.title}</span>
                      {isActive && <span className="collection-active-badge">обучение</span>}
                    </span>
                    <span className="course-card-desc">{collection.description}</span>
                    <span className="course-card-progress-row">
                      <BookOpen size={18} />
                      <strong>
                        {progress.completed}/{progress.total}
                      </strong>
                      <span>задач</span>
                      <span className="collection-progress" aria-label={`${progress.percent}%`}>
                        <span style={{ width: `${progress.percent}%` }} />
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="course-card-arrow" size={26} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {taskCollections.length > 0 && (
        <section className="collection-section">
          <div className="section-heading">
            <h2>Наборы задач</h2>
            <p>Отдельные темы без вложенных курсов.</p>
          </div>

          <div className="collection-grid">
            {taskCollections.map((collection) => {
              const progress = getCollectionProgress(collection, attempts);
              const isActive = collection.id === activeCollectionId;

              return (
                <button
                  key={collection.id}
                  type="button"
                  className={`collection-card ${isActive ? "active" : ""}`}
                  onClick={() =>
                    void navigate({
                      to: "/collections/$collectionId",
                      params: { collectionId: collection.id },
                    })
                  }
                >
                  <div className="collection-card-topline">
                    <span className="collection-title">{collection.title}</span>
                    {isActive && <span className="collection-active-badge">обучение</span>}
                  </div>
                  <span className="collection-desc">{collection.description}</span>
                  <div className="collection-progress" aria-label={`${progress.percent}%`}>
                    <span style={{ width: `${progress.percent}%` }} />
                  </div>
                  <span className="collection-meta">
                    {progress.completed}/{progress.total} задач · {collection.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
