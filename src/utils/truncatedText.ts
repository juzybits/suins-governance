const MAX_LENGTH = 200;
export function truncatedText({
  text,
  maxLength = MAX_LENGTH,
}: {
  text: string;
  maxLength?: number;
}) {
  // Truncate the text if it's longer than MAX_LENGTH
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
