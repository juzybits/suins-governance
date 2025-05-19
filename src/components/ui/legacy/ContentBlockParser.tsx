import parse from "html-react-parser";

export function ContentBlockParser({ text }: { text: string }) {
  return <>{parse(text)}</>;
}
