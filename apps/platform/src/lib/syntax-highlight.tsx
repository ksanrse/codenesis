import type { ReactNode } from "react";

const TOKEN_PATTERN =
  /(\/\/.*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:export|function|const|let|var|return|if|else|switch|case|default|throw|new|true|false|null|undefined|class|extends|import|from|async|await)\b|\b\d+(?:\.\d+)?n?\b)/g;
const KEYWORD_PATTERN =
  /^(export|function|const|let|var|return|if|else|switch|case|default|throw|new|class|extends|import|from|async|await)$/;
const LITERAL_PATTERN = /^(true|false|null|undefined)$/;

export function highlightJavaScriptCode(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(code.slice(lastIndex, index));

    const className =
      token.startsWith("//") || token.startsWith("/*")
        ? "syntax-comment"
        : token.startsWith("'") || token.startsWith('"') || token.startsWith("`")
          ? "syntax-string"
          : KEYWORD_PATTERN.test(token)
            ? "syntax-keyword"
            : LITERAL_PATTERN.test(token)
              ? "syntax-literal"
              : /^\d/.test(token)
                ? "syntax-number"
                : undefined;

    nodes.push(
      className ? (
        <span key={`${tokenIndex}:${index}`} className={className}>
          {token}
        </span>
      ) : (
        token
      ),
    );
    lastIndex = index + token.length;
    tokenIndex += 1;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes;
}
