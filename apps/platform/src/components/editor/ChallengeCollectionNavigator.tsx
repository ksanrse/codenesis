import {
  getChallengeLevel,
  getChallengeLevelLabel,
  type ChallengeDefinition,
} from "@foruntendo/challenges";
import { Check, Search, X } from "lucide-react";
import { memo, type RefObject } from "react";

interface ChallengeCollectionNavigatorProps {
  id: string;
  isOpen: boolean;
  title: string;
  count: number;
  search: string;
  challenges: ChallengeDefinition[];
  currentChallengeId: string;
  passedChallengeIds: Set<string>;
  drawerRef: RefObject<HTMLDivElement | null>;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onNavigate: (challengeId: string) => void;
}

export const ChallengeCollectionNavigator = memo(ChallengeCollectionNavigatorInner);

function ChallengeCollectionNavigatorInner({
  id,
  isOpen,
  title,
  count,
  search,
  challenges,
  currentChallengeId,
  passedChallengeIds,
  drawerRef,
  onSearchChange,
  onClose,
  onNavigate,
}: ChallengeCollectionNavigatorProps) {
  return (
    <div
      id={id}
      ref={drawerRef}
      className={isOpen ? "challenge-collection-drawer is-open" : "challenge-collection-drawer"}
    >
      <div className="challenge-collection-drawer-header">
        <div>
          <span>{title}</span>
          <small>{count} задач</small>
        </div>
        <button
          type="button"
          className="panel-tab-icon"
          aria-label="Закрыть список"
          onClick={onClose}
        >
          <X size={17} strokeWidth={2.25} />
        </button>
      </div>
      <label className="challenge-collection-search">
        <Search size={17} strokeWidth={2.15} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Ищи по списку"
        />
      </label>
      <div className="challenge-collection-table-head">
        <span>Задача</span>
        <span>Уровень</span>
      </div>
      <div className="challenge-collection-list">
        {challenges.map((challenge, index) => {
          const isCurrent = challenge.id === currentChallengeId;
          const isPassed = passedChallengeIds.has(challenge.id);
          const rankTone = Math.min(5, Math.max(0, getChallengeLevel(challenge.rank) - 1));

          return (
            <button
              key={challenge.id}
              type="button"
              className={isCurrent ? "challenge-collection-row active" : "challenge-collection-row"}
              onClick={() => onNavigate(challenge.id)}
            >
              <span
                className={`challenge-collection-row-status ${isPassed ? "passed" : ""}`}
                aria-hidden="true"
              >
                {isPassed ? <Check size={19} strokeWidth={3} /> : index + 1}
              </span>
              <span className="challenge-collection-row-title">{challenge.title}</span>
              <span className={`challenge-collection-row-rank rank-tone-${rankTone}`}>
                {getChallengeLevelLabel(challenge.rank)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
