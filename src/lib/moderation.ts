// Normalize user-submitted text before storing: strip control characters,
// collapse blank lines and horizontal whitespace, trim and cap length. No HTML
// is ever rendered (clients print plain text), so this plus the profanity
// filter is the sanitisation surface for comments, topics and replies.
export function cleanText(input: unknown, max = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/\p{Cc}/gu, (c) => (c === "\n" ? c : ""))
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}
