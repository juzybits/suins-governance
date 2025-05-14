/* eslint-disable @typescript-eslint/no-require-imports */
const tailwindConfig = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // TYPOGRAPHY
      fontFamily: {
        main: ["Inter Tight", "sans-serif"],
        highlight: ["TWK Everett", "sans-serif"],
        mono: ["TWK Everett Mono", "monospace"],
      },
      fontSize: {
        "9xl": "5.5rem",
        "8xl": "4.75rem",
        "7xl": "3rem",
        "6xl": "2.25rem",
        "5xl": "2rem",
        "4xl": "1.875rem",
        "3xl": "1.75rem",
        "2xl": "1.5rem",
        xl: "1.25rem",
        l: "1.125rem",
        m: "1rem",
        s: "0.875rem",
        xs: "0.75rem",
      },
      lineHeight: {
        "8xl": "5.5rem",
        "7xl": "4.75rem",
        "6xl": "3.5rem",
        "5xl": "2.625rem",
        "4xl": "2.25rem",
        "3xl": "2rem",
        "2xl": "1.875rem",
        xl: "1.75rem",
        l: "1.688rem",
        m: "1.5rem",
        s: "1.313rem",
        xs: "1.125rem",
        "2xs": "1rem",
        "3xs": "0.875rem",
        "4xs": "0.75rem",
      },
      letterSpacing: {
        tighter: "-2%",
        tight: "-1%",
        normal: "0",
        wide: "1%",
      },
    },
  },
  plugins: [
    require("@xpd/tailwind-3dtransforms"),
    require("@tailwindcss/postcss"),
  ],
};

export default tailwindConfig;
