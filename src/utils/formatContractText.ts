export function formatContractText(text: string) {
  return text
    .replaceAll("[B]", "<strong>")
    .replaceAll("[/B]", "</strong>")
    .split("\n[PS]\n");
}
