import "react-mosaic-component/react-mosaic-component.css";
import { useNavigate } from "@tanstack/react-router";
import {
  getChallengeById,
  getChallengeCollections,
  getChallengeLevelLabel,
  getRankBand,
  type ChallengeDefinition,
  type Language,
} from "@foruntendo/challenges";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Filter,
  FileText,
  Keyboard,
  ListChecks,
  MoreHorizontal,
  PanelBottom,
  Play,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Mosaic, MosaicWindow, type MosaicNode } from "react-mosaic-component";
import { useWebContainer } from "../../hooks/useWebContainer.ts";
import { canRunInBrowser, runBrowserTests } from "../../lib/browser-test-runner.ts";
import {
  getCurrentSourceFiles,
  getSourceFiles,
  shouldRecordAttempt,
} from "../../lib/challenge-files.ts";
import { activeHotkeys, leetcodeReferenceHotkeys } from "../../lib/hotkeys.ts";
import { addAttempt, clearDraft, getAttempts, getDraft, saveDraft } from "../../lib/local-db.ts";
import { getPassedChallengeIds } from "../../lib/progress.ts";
import type { TestResult } from "../../lib/test-runner.ts";
import { parseTestResults } from "../../lib/test-runner.ts";
import { AttemptHistoryPanel } from "./AttemptHistoryPanel.tsx";
import { ChallengeCollectionNavigator } from "./ChallengeCollectionNavigator.tsx";
import { ChallengeDescription } from "./ChallengeDescription.tsx";
import { OutputPanel } from "./OutputPanel.tsx";

interface ChallengeLayoutProps {
  challenge: ChallengeDefinition;
}

type EditorView = "code" | "tests" | "full-tests" | "shortcuts" | "new-tab";
type SidebarView = "description" | "solution" | "attempts";
type SolutionReveal = "prompt" | "hint" | "full";

const EditorPanel = lazy(() =>
  import("./EditorPanel.tsx").then((module) => ({ default: module.EditorPanel })),
);

const monacoShortcuts = [
  { title: "Вырезать строку без выделения", keys: ["Ctrl", "X"] },
  { title: "Скопировать строку без выделения", keys: ["Ctrl", "C"] },
  { title: "Удалить строку", keys: ["Shift", "Ctrl", "K"] },
  { title: "Отменить", keys: ["Ctrl", "Z"] },
  { title: "Повторить", keys: ["Shift", "Ctrl", "Z"] },
  { title: "Перейти к парной скобке", keys: ["Shift", "Ctrl", "\\"] },
  { title: "Сдвинуть строку вправо", keys: ["Ctrl", "]"] },
  { title: "Сдвинуть строку влево", keys: ["Ctrl", "["] },
  { title: "Переместить строку вниз", keys: ["Alt", "↓"] },
  { title: "Переместить строку вверх", keys: ["Alt", "↑"] },
  { title: "Скопировать строку вниз", keys: ["Shift", "Alt", "↓"] },
  { title: "Скопировать строку вверх", keys: ["Shift", "Alt", "↑"] },
  {
    title: "Добавить следующее совпадение к выделению",
    keys: ["Ctrl", "D"],
  },
  { title: "Выделить текущую строку", keys: ["Ctrl", "L"] },
] as const;

function getInitialEditorTheme() {
  return localStorage.getItem("editorTheme") ?? "vs-dark";
}

function getInitialEditorFontSize() {
  const saved = Number(localStorage.getItem("editorFontSize"));
  if (Number.isFinite(saved) && saved >= 12 && saved <= 24) return saved;
  return 14;
}

type ViewId = "description" | "editor" | "output";

const MOSAIC_TREE_KEY = "editorMosaicTree";

const DEFAULT_MOSAIC_TREE: MosaicNode<ViewId> = {
  type: "split",
  direction: "row",
  children: [
    "description",
    {
      type: "split",
      direction: "column",
      children: ["editor", "output"],
      splitPercentages: [65, 35],
    },
  ],
  splitPercentages: [38, 62],
};

const EMPTY_TOOLBAR_CONTROLS = <></>;

function getInitialMosaicTree(): MosaicNode<ViewId> {
  if (typeof window === "undefined") return DEFAULT_MOSAIC_TREE;
  try {
    const saved = window.localStorage.getItem(MOSAIC_TREE_KEY);
    if (!saved) return DEFAULT_MOSAIC_TREE;
    const parsed = JSON.parse(saved) as MosaicNode<ViewId> | null;
    return parsed ?? DEFAULT_MOSAIC_TREE;
  } catch {
    return DEFAULT_MOSAIC_TREE;
  }
}

export function ChallengeLayout({ challenge }: ChallengeLayoutProps) {
  const navigate = useNavigate();
  const rankBand = getRankBand(challenge.rank);
  const availableLangs = challenge.languages;
  const [language, setLanguage] = useState<Language>(availableLangs[0]!);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Черновик не сохранен");
  const [lastCheckPassed, setLastCheckPassed] = useState(false);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
  const [draftVersion, setDraftVersion] = useState(0);
  const [sidebarView, setSidebarView] = useState<SidebarView>("description");
  const [solutionReveal, setSolutionReveal] = useState<SolutionReveal>("prompt");
  const [editorView, setEditorView] = useState<EditorView>("code");
  const [showFullTests, setShowFullTests] = useState(false);
  const [editorTheme, setEditorTheme] = useState(getInitialEditorTheme);
  const [editorFontSize, setEditorFontSize] = useState(getInitialEditorFontSize);
  const [isEditorMenuOpen, setIsEditorMenuOpen] = useState(false);
  const [isCollectionNavigatorOpen, setIsCollectionNavigatorOpen] = useState(false);
  const [mosaicTree, setMosaicTree] = useState<MosaicNode<ViewId> | null>(getInitialMosaicTree);
  const [collectionSearch, setCollectionSearch] = useState("");
  const [attemptsVersion, setAttemptsVersion] = useState(0);
  const fileChangesRef = useRef<Record<string, string>>({});
  const runTokenRef = useRef(0);
  const editorMenuRef = useRef<HTMLDivElement>(null);
  const editorMenuBtnRef = useRef<HTMLButtonElement>(null);
  const editorDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const collectionNavigatorRef = useRef<HTMLDivElement>(null);
  const collectionDrawerRef = useRef<HTMLDivElement>(null);
  const challengeInfoRef = useRef<HTMLDivElement>(null);

  const collectionContext = useMemo(() => {
    const collections = getChallengeCollections();
    const directCollection =
      collections.find(
        (collection) =>
          collection.kind === "set" &&
          collection.directChallengeIds.includes(challenge.id) &&
          collection.parentCollectionId,
      ) ??
      collections.find(
        (collection) =>
          collection.kind === "set" && collection.directChallengeIds.includes(challenge.id),
      ) ??
      collections.find((collection) => collection.challengeIds.includes(challenge.id));

    if (!directCollection) return undefined;

    const challenges = directCollection.challengeIds
      .map((challengeId) => getChallengeById(challengeId))
      .filter((currentChallenge): currentChallenge is ChallengeDefinition =>
        Boolean(currentChallenge),
      );
    const currentIndex = challenges.findIndex(
      (currentChallenge) => currentChallenge.id === challenge.id,
    );

    return {
      collection: directCollection,
      challenges,
      currentIndex,
      previous: currentIndex > 0 ? challenges[currentIndex - 1] : undefined,
      next:
        currentIndex >= 0 && currentIndex < challenges.length - 1
          ? challenges[currentIndex + 1]
          : undefined,
    };
  }, [challenge.id]);

  const passedChallengeIds = useMemo(() => {
    void attemptsVersion;
    return getPassedChallengeIds(getAttempts());
  }, [attemptsVersion]);

  const currentChallengeAttempts = useMemo(() => {
    void attemptsVersion;
    return getAttempts().filter(
      (attempt) => attempt.challengeId === challenge.id && attempt.language === language,
    );
  }, [attemptsVersion, challenge.id, language]);

  const filteredCollectionChallenges = useMemo(() => {
    const query = collectionSearch.trim().toLowerCase();
    const challenges = collectionContext?.challenges ?? [];
    if (!query) return challenges;
    return challenges.filter((currentChallenge) =>
      [currentChallenge.title, currentChallenge.description, currentChallenge.group]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [collectionContext?.challenges, collectionSearch]);

  const navigateToChallenge = useCallback(
    (challengeId: string) => {
      setIsCollectionNavigatorOpen(false);
      void navigate({
        to: "/challenges/$challengeId",
        params: { challengeId },
      });
    },
    [navigate],
  );

  const allFiles = useMemo(() => {
    const starter = challenge.starterFiles[language] ?? [];
    const tests = challenge.testFiles[language] ?? [];
    const draft = getDraft(challenge.id, language);
    const files = [...starter, ...tests];
    if (!draft) return files;
    return files.map((file) => ({
      ...file,
      content: draft.files[file.path] ?? file.content,
    }));
  }, [challenge, language, draftVersion]);

  const fullTestsForLanguage = useMemo(
    () => challenge.fullTestFiles?.[language] ?? challenge.testFiles[language] ?? [],
    [challenge.fullTestFiles, challenge.testFiles, language],
  );

  const deps = useMemo(() => challenge.dependencies[language] ?? {}, [challenge, language]);
  const expectedTests = useMemo(() => {
    const tests = challenge.testFiles[language] ?? [];
    return tests.flatMap((file) =>
      Array.from(file.content.matchAll(/\b(?:it|test)\(\s*["'`](.+?)["'`]/g), (match) => match[1]!),
    );
  }, [challenge, language]);

  const browserRunnerAvailable = canRunInBrowser(allFiles);
  const { status, writeFile, runTests } = useWebContainer(allFiles, deps, !browserRunnerAvailable);
  const canRunTests = status === "ready" || browserRunnerAvailable;
  const runButtonLabel = isRunning
    ? "Запуск..."
    : canRunTests
      ? "Проверить"
      : status === "installing"
        ? "Установка..."
        : status === "error"
          ? "Ошибка"
          : "Загрузка...";

  useEffect(() => {
    runTokenRef.current += 1;
    fileChangesRef.current = {};
    setOutput("");
    setTestResults([]);
    setIsRunning(false);
    setSaveStatus("Черновик не сохранен");
    setLastCheckPassed(false);
    setIsChallengeCompleted(false);
    setShowFullTests(false);
    setSolutionReveal("prompt");
    setSidebarView("description");
    setEditorView("code");
    setIsEditorMenuOpen(false);
    setIsCollectionNavigatorOpen(false);
  }, [challenge.id, language]);

  const handleFileChange = useCallback(
    (path: string, content: string) => {
      fileChangesRef.current[path] = content;
      setLastCheckPassed(false);
      setIsChallengeCompleted(false);
      writeFile(path, content);
    },
    [writeFile],
  );

  const handleRunTests = useCallback(
    async (mode: "check" | "submit" = "check") => {
      if (isRunning || !canRunTests) return;

      const runToken = (runTokenRef.current += 1);
      const isCurrentRun = () => runTokenRef.current === runToken;

      setIsRunning(true);
      setOutput(mode === "submit" ? "Запуск полной проверки..." : "Запуск тестов...");
      setTestResults([]);
      if (mode === "submit") {
        setShowFullTests(true);
      }

      try {
        const runtimeFiles = allFiles.map((file) => ({
          ...file,
          content: fileChangesRef.current[file.path] ?? file.content,
        }));
        const submittedFiles = getCurrentSourceFiles(allFiles, fileChangesRef.current);
        const filesForRun =
          mode === "submit"
            ? [
                ...runtimeFiles.filter(
                  (file) => !file.path.includes(".test.") && file.path !== "package.json",
                ),
                ...fullTestsForLanguage,
                ...runtimeFiles.filter((file) => file.path === "package.json"),
              ]
            : runtimeFiles;
        const testPathsForRun =
          mode === "submit" ? fullTestsForLanguage.map((file) => file.path) : undefined;
        const result = browserRunnerAvailable
          ? runBrowserTests(filesForRun)
          : await runTests(filesForRun, testPathsForRun);
        if (!isCurrentRun()) return;

        setOutput(result.raw);
        const parsedResults: TestResult[] =
          "results" in result ? (result.results as TestResult[]) : parseTestResults(result.raw);
        const passed = parsedResults.filter((test) => test.status === "pass").length;
        const failed = parsedResults.filter((test) => test.status === "fail").length;
        setTestResults(parsedResults);
        const total = parsedResults.length;
        const didPass = result.exitCode === 0;
        if (mode === "check") {
          setLastCheckPassed(didPass);
          setIsChallengeCompleted(false);
        } else {
          setIsChallengeCompleted(didPass);
          setLastCheckPassed(didPass);
        }
        if (mode === "submit") {
          const previousAttempts = getAttempts().filter(
            (attempt) => attempt.challengeId === challenge.id && attempt.language === language,
          );
          const nextStatus = result.exitCode === 0 ? "passed" : "failed";

          if (
            shouldRecordAttempt(
              submittedFiles,
              getSourceFiles(challenge.starterFiles[language] ?? []),
              previousAttempts,
              nextStatus,
              total,
            )
          ) {
            addAttempt({
              challengeId: challenge.id,
              challengeTitle: challenge.title,
              language,
              status: nextStatus,
              passed,
              failed,
              total,
              files: submittedFiles,
              output: result.raw,
            });
            setAttemptsVersion((version) => version + 1);
          } else {
            setSaveStatus("Отправка без новой попытки");
          }
        }
      } catch (err) {
        if (isCurrentRun()) {
          setOutput(err instanceof Error ? err.message : "Неизвестная ошибка");
        }
      } finally {
        if (isCurrentRun()) {
          setIsRunning(false);
        }
      }
    },
    [
      allFiles,
      browserRunnerAvailable,
      canRunTests,
      challenge.fullTestFiles,
      challenge.id,
      challenge.starterFiles,
      challenge.testFiles,
      challenge.title,
      fullTestsForLanguage,
      isRunning,
      language,
      runTests,
    ],
  );

  const handleCompleteOrNext = useCallback(() => {
    if (isChallengeCompleted) {
      if (collectionContext?.next) {
        navigateToChallenge(collectionContext.next.id);
      }
      return;
    }

    void handleRunTests("submit");
  }, [collectionContext?.next, handleRunTests, isChallengeCompleted, navigateToChallenge]);

  const handleSave = useCallback(
    (files: Record<string, string>) => {
      saveDraft(challenge.id, language, files);
      setSaveStatus("Сохранено");
    },
    [challenge.id, language],
  );

  const handleReset = useCallback(() => {
    fileChangesRef.current = {};
    setLastCheckPassed(false);
    setIsChallengeCompleted(false);
    clearDraft(challenge.id, language);
    setDraftVersion((version) => version + 1);
    setOutput("");
    setTestResults([]);
    setSaveStatus("Черновик сброшен");
  }, [challenge.id, language]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && event.altKey && key === "l") {
        event.preventDefault();
        handleReset();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void handleRunTests();
        return;
      }

      if (event.key === "Escape") {
        setIsEditorMenuOpen(false);
        setIsCollectionNavigatorOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        editorMenuRef.current &&
        !editorMenuRef.current.contains(event.target as Node) &&
        editorDropdownRef.current &&
        !editorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEditorMenuOpen(false);
      }
      if (
        collectionNavigatorRef.current &&
        !collectionNavigatorRef.current.contains(event.target as Node) &&
        collectionDrawerRef.current &&
        !collectionDrawerRef.current.contains(event.target as Node)
      ) {
        setIsCollectionNavigatorOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handleReset, handleRunTests]);

  useLayoutEffect(() => {
    if (isEditorMenuOpen && editorMenuBtnRef.current) {
      const rect = editorMenuBtnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  }, [isEditorMenuOpen]);

  const openEditorView = (view: EditorView) => {
    setEditorView(view);
    setIsEditorMenuOpen(false);
  };

  const handleEditorThemeChange = (theme: string) => {
    setEditorTheme(theme);
    localStorage.setItem("editorTheme", theme);
  };

  const handleEditorFontSizeChange = (fontSize: number) => {
    setEditorFontSize(fontSize);
    localStorage.setItem("editorFontSize", String(fontSize));
  };

  const renderChallengeDescription = () => (
    <ChallengeDescription markdown={challenge.description} />
  );

  const renderSolution = () => {
    const solutionFiles = challenge.solutionFiles[language] ?? [];
    const solutionText = solutionFiles.map((file) => file.content.trim()).join("\n\n");

    if (solutionReveal === "prompt") {
      return (
        <div className="challenge-helper-card">
          <h2>Ты хочешь получить подсказку?</h2>
          <p>Подсказка не покажет готовый код, но направит к ключевой идее решения.</p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setSolutionReveal("hint")}
          >
            Да, показать подсказку
          </button>
        </div>
      );
    }

    if (solutionReveal === "hint") {
      return (
        <div className="challenge-helper-stack">
          <div className="challenge-helper-card">
            <h2>Подсказка</h2>
            <p>
              Начни с интерфейса из условия. Верни ровно то значение, которое проверяют тесты, и
              держи промежуточное состояние внутри function expression или замыкания, если оно
              требуется задачей.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setSolutionReveal("full")}
          >
            Открыть полное решение
          </button>
        </div>
      );
    }

    return (
      <div className="challenge-helper-stack">
        <div className="challenge-helper-card">
          <h2>Полное решение</h2>
          {solutionText ? (
            <>
              <p>
                Решение сохраняет значение из внешней функции и возвращает новую функцию, которая
                использует это значение при вызове.
              </p>
              <pre className="solution-code">
                <code>{solutionText}</code>
              </pre>
            </>
          ) : (
            <p>Для этой задачи решение еще не добавлено в базу.</p>
          )}
        </div>
      </div>
    );
  };

  const renderSidebarContent = () => {
    if (sidebarView === "solution") return renderSolution();
    if (sidebarView === "attempts") {
      return <AttemptHistoryPanel attempts={currentChallengeAttempts} />;
    }
    return renderChallengeDescription();
  };

  const renderEditorContent = () => {
    if (editorView === "shortcuts") {
      return <EditorShortcutsPanel />;
    }

    if (editorView === "new-tab") {
      return (
        <EditorNewTabPanel
          onOpenCode={() => openEditorView("code")}
          onOpenTests={() => openEditorView("tests")}
          onOpenShortcuts={() => openEditorView("shortcuts")}
          onRunTests={() => {
            openEditorView("code");
            void handleRunTests();
          }}
        />
      );
    }

    return (
      <Suspense fallback={<div className="editor-loading">Загрузка редактора...</div>}>
        <EditorPanel
          key={`${challenge.id}:${language}:${draftVersion}`}
          files={allFiles}
          fullTestFiles={fullTestsForLanguage}
          onFileChange={handleFileChange}
          onRunTests={handleRunTests}
          onSave={handleSave}
          view={editorView}
          theme={editorTheme}
          fontSize={editorFontSize}
        />
      </Suspense>
    );
  };

  const renderDescriptionToolbar = () => (
    <div className="challenge-panel-tabs">
      <button
        type="button"
        className={sidebarView === "description" ? "panel-tab active" : "panel-tab"}
        onClick={() => setSidebarView("description")}
      >
        Описание
      </button>
      <button
        type="button"
        className={sidebarView === "solution" ? "panel-tab active" : "panel-tab"}
        onClick={() => {
          setSidebarView("solution");
          setSolutionReveal("prompt");
        }}
      >
        Решение
      </button>
      <button
        type="button"
        className={sidebarView === "attempts" ? "panel-tab active" : "panel-tab"}
        onClick={() => setSidebarView("attempts")}
      >
        Попытки
      </button>
    </div>
  );

  const renderEditorToolbar = () => (
    <div className="challenge-panel-tabs editor-panel-tabs">
      <button
        type="button"
        className="panel-tab-icon"
        aria-label="Добавить вкладку редактора"
        data-testid="editor-add-tab"
        onClick={() => setEditorView("new-tab")}
      >
        <Plus size={16} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        data-testid="editor-code-tab"
        className={editorView === "code" ? "panel-tab active" : "panel-tab"}
        onClick={() => setEditorView("code")}
      >
        Код
      </button>
      <button
        type="button"
        data-testid="editor-tests-tab"
        className={editorView === "tests" ? "panel-tab active" : "panel-tab"}
        onClick={() => setEditorView("tests")}
      >
        Тесткейсы
      </button>
      {showFullTests && (
        <button
          type="button"
          data-testid="editor-full-tests-tab"
          className={editorView === "full-tests" ? "panel-tab active" : "panel-tab"}
          onClick={() => setEditorView("full-tests")}
        >
          Все тесты
        </button>
      )}
      {editorView === "shortcuts" && (
        <button
          type="button"
          data-testid="editor-shortcuts-tab"
          className="panel-tab active panel-tab-with-close"
          onClick={() => setEditorView("shortcuts")}
        >
          Шорткаты редактора
          <span
            role="button"
            tabIndex={0}
            aria-label="Закрыть вкладку шорткатов"
            className="panel-tab-close"
            onClick={(event) => {
              event.stopPropagation();
              setEditorView("code");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                setEditorView("code");
              }
            }}
          >
            <X size={13} strokeWidth={2.25} />
          </span>
        </button>
      )}
      {editorView === "new-tab" && (
        <button
          type="button"
          data-testid="editor-new-tab"
          className="panel-tab active panel-tab-with-close"
          onClick={() => setEditorView("new-tab")}
        >
          Новая вкладка
          <span
            role="button"
            tabIndex={0}
            aria-label="Закрыть новую вкладку"
            className="panel-tab-close"
            onClick={(event) => {
              event.stopPropagation();
              setEditorView("code");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                setEditorView("code");
              }
            }}
          >
            <X size={13} strokeWidth={2.25} />
          </span>
        </button>
      )}
      <div className="language-selector">
        {availableLangs.map((lang) => (
          <button
            key={lang}
            type="button"
            className={`lang-btn ${lang === language ? "active" : ""}`}
            onClick={() => setLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="editor-menu" ref={editorMenuRef}>
        <button
          ref={editorMenuBtnRef}
          type="button"
          data-testid="editor-menu-button"
          className="panel-tab-icon panel-tab-menu"
          aria-expanded={isEditorMenuOpen}
          aria-controls="editor-options"
          aria-label="Меню редактора"
          onClick={() => setIsEditorMenuOpen((current) => !current)}
        >
          <MoreHorizontal size={17} strokeWidth={2.25} />
        </button>
        {createPortal(
          <div
            ref={editorDropdownRef}
            id="editor-options"
            className={isEditorMenuOpen ? "editor-dropdown is-open" : "editor-dropdown"}
            style={dropdownPos ? { top: dropdownPos.top, right: dropdownPos.right } : undefined}
          >
            <div className="editor-theme-control">
              <label htmlFor="editor-theme">Editor Theme</label>
              <select
                id="editor-theme"
                value={editorTheme}
                onChange={(event) => handleEditorThemeChange(event.target.value)}
              >
                <option value="vs-dark">Dracula</option>
                <option value="hc-black">High Contrast</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div className="editor-theme-control">
              <label htmlFor="editor-font-size">Размер шрифта</label>
              <select
                id="editor-font-size"
                value={editorFontSize}
                onChange={(event) => handleEditorFontSizeChange(Number(event.target.value))}
              >
                <option value={12}>12 px</option>
                <option value={13}>13 px</option>
                <option value={14}>14 px</option>
                <option value={15}>15 px</option>
                <option value={16}>16 px</option>
                <option value={18}>18 px</option>
                <option value={20}>20 px</option>
                <option value={22}>22 px</option>
                <option value={24}>24 px</option>
              </select>
            </div>
            <button
              type="button"
              data-testid="editor-menu-shortcuts"
              className="editor-dropdown-item editor-dropdown-item-large"
              onClick={() => openEditorView("shortcuts")}
            >
              <Keyboard size={16} strokeWidth={2.25} />
              Keyboard shortcuts
            </button>
            <button
              type="button"
              data-testid="editor-menu-run"
              className="editor-dropdown-item"
              onClick={() => {
                setIsEditorMenuOpen(false);
                void handleRunTests();
              }}
            >
              Запустить тесты
            </button>
            <button
              type="button"
              data-testid="editor-menu-switch-view"
              className="editor-dropdown-item"
              onClick={() => openEditorView(editorView === "code" ? "tests" : "code")}
            >
              {editorView === "code" ? "Показать тесты" : "Показать код"}
            </button>
            <button
              type="button"
              data-testid="editor-menu-reset"
              className="editor-dropdown-item"
              onClick={() => {
                setIsEditorMenuOpen(false);
                handleReset();
              }}
            >
              Сбросить решение
            </button>
          </div>,
          document.body,
        )}
      </div>
    </div>
  );

  const renderTile = (id: ViewId, path: number[]) => {
    if (id === "description") {
      return (
        <MosaicWindow<ViewId>
          path={path}
          title="Описание"
          toolbarControls={EMPTY_TOOLBAR_CONTROLS}
          renderToolbar={() => renderDescriptionToolbar()}
        >
          <div className="challenge-info" ref={challengeInfoRef}>
            <div className="challenge-info-header">
              <h1 className="challenge-title">{challenge.title}</h1>
              <span className="badge badge-rank">{getChallengeLevelLabel(challenge.rank)}</span>
              {(isChallengeCompleted || passedChallengeIds.has(challenge.id)) && (
                <span className="badge badge-completed">Сделано</span>
              )}
            </div>
            <div className="challenge-meta">
              <span>{challenge.category}</span>
              <span>{challenge.group}</span>
              <span>{rankBand.label}</span>
              <span>+{challenge.reputation} MMR</span>
            </div>
            {renderSidebarContent()}
          </div>
        </MosaicWindow>
      );
    }
    if (id === "editor") {
      return (
        <MosaicWindow<ViewId>
          path={path}
          title="Редактор"
          toolbarControls={EMPTY_TOOLBAR_CONTROLS}
          renderToolbar={() => renderEditorToolbar()}
        >
          <div className="editor-code-block mosaic-tile-body">{renderEditorContent()}</div>
        </MosaicWindow>
      );
    }
    return (
      <MosaicWindow<ViewId>
        path={path}
        title="Вывод"
        toolbarControls={<></>}
        renderToolbar={() => (
          <div className="mosaic-output-toolbar">
            <span className="mosaic-output-title">
              <span className="mosaic-output-glyph">{">_"}</span>
              Вывод
            </span>
          </div>
        )}
      >
        <OutputPanel
          output={output}
          testResults={testResults}
          isRunning={isRunning}
          expectedTests={expectedTests}
          hideHeader
        />
      </MosaicWindow>
    );
  };

  const handleMosaicChange = (next: MosaicNode<ViewId> | null) => {
    setMosaicTree(next);
    if (next) localStorage.setItem(MOSAIC_TREE_KEY, JSON.stringify(next));
  };

  return (
    <div className="challenge-layout challenge-layout-mosaic">
      <div className="challenge-mosaic-shell">
        <Mosaic<ViewId>
          className="mosaic-foruntendo"
          renderTile={renderTile}
          value={mosaicTree}
          onChange={handleMosaicChange}
        />
      </div>

      <div className="challenge-action-bar">
        <div className="challenge-action-left">
          <span className="save-status">{saveStatus}</span>
        </div>
        <div className="challenge-action-center">
          <button
            type="button"
            className="challenge-nav-button"
            onClick={() =>
              collectionContext?.previous && navigateToChallenge(collectionContext.previous.id)
            }
            disabled={!collectionContext?.previous}
            aria-label="Предыдущая задача"
          >
            <ArrowLeft size={16} strokeWidth={2.25} />
          </button>
          <div className="challenge-collection-switcher" ref={collectionNavigatorRef}>
            <button
              type="button"
              className="challenge-collection-button"
              aria-expanded={isCollectionNavigatorOpen}
              aria-controls="challenge-collection-navigator"
              onClick={() => setIsCollectionNavigatorOpen((current) => !current)}
            >
              <Filter size={15} strokeWidth={2.25} />
              <span>
                {collectionContext?.collection.title ?? challenge.tags[0] ?? challenge.group}
              </span>
              <span className="challenge-collection-count">
                {(collectionContext?.currentIndex ?? 0) + 1}/
                {collectionContext?.challenges.length ?? 1}
              </span>
            </button>
          </div>
          <button
            type="button"
            className="challenge-nav-button"
            onClick={() =>
              collectionContext?.next && navigateToChallenge(collectionContext.next.id)
            }
            disabled={!collectionContext?.next}
            aria-label="Следующая задача"
          >
            <ArrowRight size={16} strokeWidth={2.25} />
          </button>
        </div>
        <div className="challenge-action-right">
          <button type="button" className="btn btn-outline btn-sm" onClick={handleReset}>
            <RotateCcw size={14} strokeWidth={2.25} />
            Сбросить
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => void handleRunTests("check")}
            disabled={isRunning || !canRunTests}
          >
            <Play size={14} strokeWidth={2.35} />
            {runButtonLabel}
          </button>
          <button
            type="button"
            className={lastCheckPassed ? "btn btn-accent btn-sm" : "btn btn-outline btn-sm"}
            disabled={isRunning || (!isChallengeCompleted && !canRunTests)}
            onClick={handleCompleteOrNext}
          >
            {isChallengeCompleted ? "Следующее задание" : "Завершить"}
            {isChallengeCompleted ? (
              <ArrowRight size={14} strokeWidth={2.35} />
            ) : (
              <Check size={14} strokeWidth={2.35} />
            )}
          </button>
        </div>
      </div>
      <ChallengeCollectionNavigator
        id="challenge-collection-navigator"
        isOpen={isCollectionNavigatorOpen}
        title={collectionContext?.collection.title ?? "Список задач"}
        count={collectionContext?.challenges.length ?? 1}
        search={collectionSearch}
        challenges={filteredCollectionChallenges}
        currentChallengeId={challenge.id}
        passedChallengeIds={passedChallengeIds}
        drawerRef={collectionDrawerRef}
        onSearchChange={setCollectionSearch}
        onClose={() => setIsCollectionNavigatorOpen(false)}
        onNavigate={navigateToChallenge}
      />
    </div>
  );
}

function EditorShortcutsPanel() {
  return (
    <div className="editor-tab-panel editor-shortcuts-panel">
      <p className="editor-tab-intro">
        Foruntendo использует Monaco Editor, тот же редактор, который лежит в основе Visual Studio
        Code. Большинство привычных сочетаний VS Code работает здесь так же.
      </p>
      <div className="editor-shortcut-list">
        {[...monacoShortcuts, ...activeHotkeys, ...leetcodeReferenceHotkeys].map((item) => {
          const keys = typeof item.keys === "string" ? item.keys.split(" + ") : [...item.keys];
          return (
            <div key={`${item.title}:${keys.join(":")}`} className="editor-shortcut-row">
              <span>{item.title}</span>
              <span className="editor-shortcut-keys">
                {keys.map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface EditorNewTabPanelProps {
  onOpenCode: () => void;
  onOpenTests: () => void;
  onOpenShortcuts: () => void;
  onRunTests: () => void;
}

function EditorNewTabPanel({
  onOpenCode,
  onOpenTests,
  onOpenShortcuts,
  onRunTests,
}: EditorNewTabPanelProps) {
  return (
    <div className="editor-tab-panel editor-new-tab-panel">
      <h2>Вкладки</h2>
      <div className="editor-tab-picker">
        <button type="button" onClick={onOpenCode}>
          <Code2 size={17} strokeWidth={2.25} />
          Код
        </button>
        <button type="button" onClick={onOpenTests}>
          <ListChecks size={17} strokeWidth={2.25} />
          Тесткейсы
        </button>
        <button type="button" onClick={onOpenShortcuts}>
          <Keyboard size={17} strokeWidth={2.25} />
          Шорткаты редактора
        </button>
        <button type="button" onClick={onRunTests}>
          <Play size={17} strokeWidth={2.25} />
          Запустить тесты
        </button>
        <button type="button" disabled>
          <PanelBottom size={17} strokeWidth={2.25} />
          Консоль
        </button>
        <button type="button" disabled>
          <FileText size={17} strokeWidth={2.25} />
          Описание
        </button>
      </div>
    </div>
  );
}
