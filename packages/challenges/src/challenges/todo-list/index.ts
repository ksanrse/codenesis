import type { ChallengeDefinition } from "../../types.ts";
import { meta } from "./meta.ts";
import { solutionFiles } from "./solution.ts";
import { starterFiles } from "./starter.ts";
import { testFiles } from "./test.ts";

export const todoList: ChallengeDefinition = {
  ...meta,
  starterFiles,
  testFiles,
  solutionFiles,
  dependencies: {
    javascript: {},
    typescript: {},
    react: {},
    svelte: {},
    vue: {},
  },
};
