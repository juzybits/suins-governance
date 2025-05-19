type DisplayTextVariant =
  | "display/XLarge"
  | "display/Large"
  | "display/Regular"
  | "display/Small"
  | "display/XSmall"
  | "display/XSmall Light"
  | "display/XXSmall Light"
  | "display/XXXSmall Light";

type HeadingTextVariant =
  | "heading/Large SemiBold"
  | "heading/Large Medium"
  | "heading/Regular Bold"
  | "heading/Regular Medium"
  | "heading/Regular Regular"
  | "heading/Small Bold"
  | "heading/Small Medium"
  | "heading/Small Regular"
  | "heading/XSmall Medium";

type LabelTextVariant =
  | "label/Large Bold"
  | "label/Large Medium"
  | "label/Large Regular"
  | "label/Regular Bold"
  | "label/Regular Bold Mono"
  | "label/Small Bold"
  | "label/Small Medium"
  | "label/Small Medium Mono"
  | "label/XSmall SemiBold";

type ParagraphTextProps =
  | "paragraph/XLarge"
  | "paragraph/Large"
  | "paragraph/Large Link"
  | "paragraph/Regular"
  | "paragraph/Regular Link"
  | "paragraph/Small"
  | "paragraph/XSmall";

export type TypographyVariant =
  | DisplayTextVariant
  | HeadingTextVariant
  | LabelTextVariant
  | ParagraphTextProps;

export interface TypographyProps {
  variant: TypographyVariant;
}
