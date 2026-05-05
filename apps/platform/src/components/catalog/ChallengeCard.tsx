import type { ChallengeMeta } from "@foruntendo/challenges";
import { getChallengeLevelLabel, getRankBand } from "@foruntendo/challenges";
import { LanguageIcon } from "../ui/LanguageIcon.tsx";

interface ChallengeCardProps {
  challenge: ChallengeMeta;
  onClick: () => void;
}

export function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const rankBand = getRankBand(challenge.rank);

  return (
    <article
      className="challenge-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      <div className="card-header">
        <span className="badge badge-rank">{getChallengeLevelLabel(challenge.rank)}</span>
        <span className="card-category">{challenge.group}</span>
      </div>
      <h3 className="card-title">{challenge.title}</h3>
      <p className="card-desc">{challenge.description.split("\n")[0]}</p>
      <div className="card-footer">
        <span className="card-rep">{rankBand.label}</span>
        <span className="card-rep">+{challenge.reputation} MMR</span>
        <span className="card-languages">
          {challenge.languages.map((language) => (
            <LanguageIcon key={language} language={language} size={16} />
          ))}
        </span>
      </div>
    </article>
  );
}
