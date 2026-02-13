const BLOCKED_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "svg",
  "math",
];

const BLOCKED_TAGS_PATTERN = BLOCKED_TAGS.join("|");

function removeBlockedTags(value: string): string {
  const pairedTagPattern = new RegExp(`<(${BLOCKED_TAGS_PATTERN})\\b[^>]*>[\\s\\S]*?<\\/\\1>`, "gi");
  const singleTagPattern = new RegExp(`<\\/?(${BLOCKED_TAGS_PATTERN})\\b[^>]*>`, "gi");
  return value.replace(pairedTagPattern, "").replace(singleTagPattern, "");
}

function removeEventHandlers(value: string): string {
  return value.replace(/\son[a-z]+\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, "");
}

function removeUnsafeUrlAttributes(value: string): string {
  return value
    .replace(/\s(href|src|xlink:href)\s*=\s*"\s*(javascript:|data:text\/html)[^"]*"/gi, "")
    .replace(/\s(href|src|xlink:href)\s*=\s*'\s*(javascript:|data:text\/html)[^']*'/gi, "")
    .replace(/\s(href|src|xlink:href)\s*=\s*([^\s>]*)(javascript:|data:text\/html)[^\s>]*/gi, "");
}

function removeUnsafeAttributes(value: string): string {
  return value
    .replace(/\sstyle\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\sxmlns(:[a-z]+)?\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, "");
}

export function sanitizeRichTextHtml(html: string | null | undefined): string {
  if (!html) return "";

  const cleanInput = String(html).replace(/\u0000/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const removedBlockedTags = removeBlockedTags(cleanInput);
  const removedEvents = removeEventHandlers(removedBlockedTags);
  const removedUnsafeUrls = removeUnsafeUrlAttributes(removedEvents);
  const removedUnsafeAttrs = removeUnsafeAttributes(removedUnsafeUrls);

  return removedUnsafeAttrs.trim();
}

export function stripHtmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeRichTextHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
