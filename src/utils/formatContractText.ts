export function formatContractText(text: string) {
  const groups = text.split("\n[PS]\n");
  // Process each group
  const processedGroups = groups.map((group) => {
    return `<div>${group
      // Bold text
      .replaceAll("[B]", "<strong>")
      .replaceAll("[/B]", "</strong>")
      // Lists
      .replaceAll("[L]", "<ul class='list-disc list-inside'>")
      .replaceAll("[/L]", "</ul>")
      .replaceAll("[SL]", "<ul class='ml-7 space-y-1 list-inside'>")
      .replaceAll("[/SL]", "</ul>")
      .replaceAll("[NL]", "<ol class='ml-7 list-decimal list-inside'>")
      .replaceAll("[/NL]", "</ol>")
      .replaceAll("[LI]", "<li>")
      .replaceAll("[/LI]", "</li>")
      // Line breaks
      .replaceAll("[LB]", "<br/>")
      .replaceAll("[PS]", "<br/>")
      // Clean up any extra newlines that might affect formatting
      .trim()
      .replace(/\n+/g, "\n")}</div>`;
  });

  // Join the processed groups with proper spacing between sections
  return processedGroups;
}
