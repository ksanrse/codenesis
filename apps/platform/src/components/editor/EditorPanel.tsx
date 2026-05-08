import Editor, { type OnMount } from "@monaco-editor/react";
import type { ChallengeFile } from "@foruntendo/challenges";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface EditorPanelProps {
  files: ChallengeFile[];
  fullTestFiles?: ChallengeFile[];
  onFileChange: (path: string, content: string) => void;
  onRunTests: () => void;
  onSave: (files: Record<string, string>) => Promise<void> | void;
  view: "code" | "tests" | "full-tests";
  theme: string;
  fontSize: number;
}

declare global {
  interface Window {
    __foruntendoSetEditorValue?: (value: string) => void;
  }
}

function languageFromPath(path: string): string {
  if (path.endsWith(".tsx")) return "typescriptreact";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".jsx")) return "javascriptreact";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".svelte")) return "html";
  if (path.endsWith(".vue")) return "html";
  return "plaintext";
}

export function EditorPanel({
  files,
  fullTestFiles = [],
  onFileChange,
  onRunTests,
  onSave,
  view,
  theme,
  fontSize,
}: EditorPanelProps) {
  const allPanelFiles = useMemo(() => {
    const publicPaths = new Set(files.map((file) => file.path));
    return [...files, ...fullTestFiles.filter((file) => !publicPaths.has(file.path))];
  }, [files, fullTestFiles]);
  const editableFiles = useMemo(
    () => files.filter((file) => !file.path.includes(".test.") && file.path !== "package.json"),
    [files],
  );
  const testFiles = useMemo(() => files.filter((file) => file.path.includes(".test.")), [files]);
  const visibleFiles =
    view === "full-tests" ? fullTestFiles : view === "tests" ? testFiles : editableFiles;
  const isReadOnly = view === "tests" || view === "full-tests";
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const runTestsRef = useRef(onRunTests);
  const saveTimerRef = useRef<number | null>(null);
  const fileContentsRef = useRef<Record<string, string>>({});
  const dirtyRef = useRef(false);
  const saveCurrentStateRef = useRef<() => Promise<void>>(async () => {});

  const [activeFile, setActiveFile] = useState(visibleFiles[0]?.path ?? "");
  const [fileContents, setFileContents] = useState<Record<string, string>>(() =>
    Object.fromEntries(allPanelFiles.map((f) => [f.path, f.content])),
  );

  useEffect(() => {
    runTestsRef.current = onRunTests;
  }, [onRunTests]);

  useEffect(() => {
    const nextContents = Object.fromEntries(allPanelFiles.map((f) => [f.path, f.content]));
    setFileContents(nextContents);
    fileContentsRef.current = nextContents;
    dirtyRef.current = false;
  }, [allPanelFiles]);

  useEffect(() => {
    if (visibleFiles.length === 0) {
      if (activeFile !== "") setActiveFile("");
      return;
    }

    if (!visibleFiles.some((file) => file.path === activeFile)) {
      setActiveFile(visibleFiles[0]?.path ?? "");
    }
  }, [activeFile, visibleFiles]);

  const saveCurrentState = useCallback(async () => {
    if (editorRef.current && activeFile && !isReadOnly) {
      await editorRef.current.getAction("editor.action.formatDocument")?.run();
      const raw = editorRef.current.getValue();
      const collapsed = raw
        .replace(/\n{3,}/g, "\n\n")
        .replace(/^\n+/, "")
        .replace(/\n+$/, "\n");
      if (collapsed !== raw) editorRef.current.setValue(collapsed);
      const formatted = editorRef.current.getValue();
      fileContentsRef.current = { ...fileContentsRef.current, [activeFile]: formatted };
      setFileContents(fileContentsRef.current);
      onFileChange(activeFile, formatted);
    }

    dirtyRef.current = false;
    await onSave(fileContentsRef.current);
  }, [activeFile, isReadOnly, onFileChange, onSave]);

  useEffect(() => {
    saveCurrentStateRef.current = saveCurrentState;
  }, [saveCurrentState]);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined || isReadOnly || !activeFile) return;
      fileContentsRef.current[activeFile] = value;
      setFileContents((prev) => ({ ...prev, [activeFile]: value }));
      dirtyRef.current = true;
      onFileChange(activeFile, value);

      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = window.setTimeout(() => {
        void onSave(fileContentsRef.current);
        dirtyRef.current = false;
      }, 5000);
    },
    [activeFile, isReadOnly, onFileChange, onSave],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSaveKey =
        event.code === "KeyS" ||
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ы" ||
        event.key === "Ы";
      if ((event.ctrlKey || event.metaKey) && isSaveKey) {
        event.preventDefault();
        event.stopPropagation();
        void saveCurrentState();
      }
    };

    const handleBeforeUnload = () => {
      if (dirtyRef.current) {
        void onSave(fileContentsRef.current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [onSave, saveCurrentState]);

  const currentContent = fileContents[activeFile] ?? "";

  return (
    <div className="editor-panel">
      <div className="file-tabs">
        {visibleFiles.map((f) => (
          <button
            key={f.path}
            type="button"
            className={`file-tab ${f.path === activeFile ? "active" : ""}`}
            onClick={() => setActiveFile(f.path)}
          >
            {f.path.split("/").pop()}
          </button>
        ))}
      </div>
      <div className="editor-container">
        <Editor
          key={`${view}:${activeFile}`}
          path={activeFile || `${view}.js`}
          height="100%"
          language={languageFromPath(activeFile)}
          value={currentContent}
          onChange={handleChange}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            window.__foruntendoSetEditorValue = (value: string) => {
              if (isReadOnly) return;
              editor.setValue(value);
            };
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
              runTestsRef.current();
            });
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
              () => {
                runTestsRef.current();
              },
            );
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
              void saveCurrentStateRef.current();
            });
          }}
          theme={theme}
          options={{
            minimap: { enabled: false },
            fontSize,
            fontFamily: "'Geist Mono', ui-monospace, 'Cascadia Code', Consolas, monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 12 },
            readOnly: isReadOnly,
            readOnlyMessage: { value: "Тесты доступны для чтения." },
          }}
        />
      </div>
    </div>
  );
}
