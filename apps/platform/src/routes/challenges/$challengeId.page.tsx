import { useParams } from "@tanstack/react-router";
import { getChallengeById } from "@foruntendo/challenges";
import { Suspense, lazy } from "react";

const ChallengeLayout = lazy(() =>
  import("../../components/editor/ChallengeLayout.tsx").then((module) => ({
    default: module.ChallengeLayout,
  })),
);

export function ChallengeDetailPage() {
  const { challengeId } = useParams({ from: "/challenges/$challengeId" });
  const challenge = getChallengeById(challengeId);

  if (!challenge) {
    return (
      <div className="container">
        <h1>Задача не найдена</h1>
        <p>Нет задачи с id "{challengeId}".</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="container">Загрузка задачи...</div>}>
      <ChallengeLayout challenge={challenge} />
    </Suspense>
  );
}
