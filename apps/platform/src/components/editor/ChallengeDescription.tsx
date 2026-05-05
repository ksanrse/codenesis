import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { highlightJavaScriptCode } from "../../lib/syntax-highlight.tsx";

interface ChallengeDescriptionProps {
  markdown: string;
}

function extractCodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractCodeText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return extractCodeText(props.children);
  }
  return "";
}

interface Section {
  title: string | null;
  body: string;
  collapsible: boolean;
}

const COLLAPSIBLE_TITLES = new Set(["Требования", "Интерфейс"]);

function splitSections(markdown: string): Section[] {
  const lines = markdown.split("\n");
  const sections: Section[] = [{ title: null, body: "", collapsible: false }];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const title = headingMatch[1]!.trim();
      sections.push({ title, body: "", collapsible: COLLAPSIBLE_TITLES.has(title) });
      continue;
    }
    const current = sections[sections.length - 1]!;
    current.body += (current.body ? "\n" : "") + line;
  }

  return sections.filter((section) => section.title !== null || section.body.trim() !== "");
}

const markdownComponents = {
  code({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      const raw = extractCodeText(children).replace(/\n$/, "");
      return <code {...props}>{highlightJavaScriptCode(raw)}</code>;
    }
    return (
      <code className="description-inline-code" {...props}>
        {children}
      </code>
    );
  },
  p({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
      <p className="description-copy" {...props}>
        {children}
      </p>
    );
  },
  li({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
    return (
      <li className="description-list-item" {...props}>
        {children}
      </li>
    );
  },
  ul({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
    return (
      <ul className="description-list" {...props}>
        {children}
      </ul>
    );
  },
  ol({ children, ...props }: React.OlHTMLAttributes<HTMLOListElement>) {
    return (
      <ol className="description-list description-list-ordered" {...props}>
        {children}
      </ol>
    );
  },
  pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
    return (
      <pre className="attempt-code-block description-pre" {...props}>
        {children}
      </pre>
    );
  },
} as const;

function MarkdownBody({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {source}
    </ReactMarkdown>
  );
}

export function ChallengeDescription({ markdown }: ChallengeDescriptionProps) {
  const sections = splitSections(markdown);

  return (
    <div className="challenge-description">
      {sections.map((section, index) => {
        const key = `section-${index}`;
        if (!section.title) {
          return <MarkdownBody key={key} source={section.body} />;
        }
        if (section.collapsible) {
          return (
            <details key={key} className="description-collapsible" open={true}>
              <summary className="description-collapsible-summary">
                <span>{section.title}</span>
              </summary>
              <div className="description-collapsible-body">
                <MarkdownBody source={section.body} />
              </div>
            </details>
          );
        }
        return (
          <div key={key} className="description-section">
            <h2 className="description-section-title">{section.title}</h2>
            <MarkdownBody source={section.body} />
          </div>
        );
      })}
    </div>
  );
}
