import { useMemo } from "react";

interface MarkdownPreviewProps {
  content: string;
  title?: string;
}

const MarkdownPreview = ({ content, title }: MarkdownPreviewProps) => {
  const rendered = useMemo(() => {
    if (!content.trim()) {
      return '<p class="text-muted-foreground italic">Nothing to preview yet. Start writing in the editor.</p>';
    }

    let html = content
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Images: ![alt](url)
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4 border border-border" />'
      )
      // Links: [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-500 underline hover:text-blue-400" target="_blank" rel="noopener">$1</a>'
      )
      // Headings
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-serif font-bold mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-serif font-bold mt-6 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-serif font-bold mt-6 mb-3">$1</h1>')
      // Bold & Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      // Code blocks
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.slice(3, -3).trim();
        return `<pre class="bg-muted rounded-lg p-4 my-4 overflow-x-auto text-sm"><code>${code}</code></pre>`;
      })
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Blockquotes
      .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-gold pl-4 my-3 italic text-muted-foreground">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      // Unordered lists
      .replace(/^[•\-\*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

    // Wrap consecutive <li> in <ul>/<ol>
    html = html.replace(
      /((?:<li class="ml-4 list-disc">.+<\/li>\n?)+)/g,
      '<ul class="my-3 space-y-1">$1</ul>'
    );
    html = html.replace(
      /((?:<li class="ml-4 list-decimal">.+<\/li>\n?)+)/g,
      '<ol class="my-3 space-y-1">$1</ol>'
    );

    // Paragraphs: wrap remaining plain lines
    html = html
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<hr") ||
          trimmed.startsWith("<ul") ||
          trimmed.startsWith("<ol") ||
          trimmed.startsWith("<li") ||
          trimmed.startsWith("<img") ||
          trimmed.startsWith("</")
        ) {
          return line;
        }
        return `<p class="my-2 leading-relaxed">${trimmed}</p>`;
      })
      .join("\n");

    return html;
  }, [content]);

  return (
    <div className="p-6 font-serif text-sm">
      {title && (
        <h1 className="text-2xl font-bold font-serif mb-6 pb-4 border-b border-border">
          {title}
        </h1>
      )}
      <div
        className="prose-custom leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    </div>
  );
};

export default MarkdownPreview;
