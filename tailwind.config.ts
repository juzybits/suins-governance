/* eslint-disable @typescript-eslint/no-require-imports */
const tailwindConfig = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "#FFFFFF",
          inactive: "#62519C",
          dark: "#241D3D",
          darker: "#221C36",
        },
        secondary: "#DAD0FF",
        tertiary: "#6E609F",
        link: "#D348FF",
        semantic: {
          perfect: "#00F9FB",
          good: "#4BFF6A",
          warning: "#F2BD24",
          issue: "#EB5A29",
        },
        bg: {
          primary: "#221C36",
          primary_dark: "#1A142E",
          modal: "#2D2743",
          secondary: "#332C4E",
          secondary_highlight: "#62519C",
          good: "#4BFFA6",
          warning: "#F2BD24",
          issue: "#EB5A29",
          error: "#FF1D53",
          blue: "#4CA2FF",
        },
      },
      spacing: {
        "5xl": "6.25rem",
        "4xl": "5rem",
        "3xl": "2.5rem",
        "2xl": "2rem",
        xl: "1.5rem",
        l: "1.25rem",
        m: "1rem",
        s: "0.75rem",
        xs: "0.5rem",
        "2xs": "0.25rem",
        none: "0rem",
        page_max_width: "80rem",
      },
      borderRadius: {
        xl: "2.5rem",
        l: "2rem",
        m: "1.5rem",
        s: "1.25rem",
        xs: "0.75rem",
        "2xs": "0.375rem",
      },
      backgroundImage: {
        gradient: {
          fade: "linear-gradient(90deg, #1A142E00, #1A142E)",
          fadeText:
            "linear-gradient(0deg, #221C36 29.04%, rgba(34, 28, 54, 0) 100%)",
          green: "linear-gradient(90deg, #00FF87, #60FFCA)",
          pink: "linear-gradient(90deg, #FF00C7, #FF85DD)",
          orange: "linear-gradient(90deg, #FFA500, #FFCC70)",
          blue: "linear-gradient(90deg, #00A2FF, #60CCFF)",
          pink_green: "linear-gradient(90deg, #FF00C7, #00FF87)",
          green_pink_blue: "linear-gradient(90deg, #00FF87, #FF00C7, #00A2FF)",
          green_blue_pink: "linear-gradient(90deg, #00FF87, #00A2FF, #FF00C7)",
          green_orange_pink_blue:
            "linear-gradient(90deg, #00FF87, #FFA500, #FF00C7, #00A2FF)",
        },
        button_pink_green:
          "linear-gradient(311.01deg, #4BFFA6 10.89%, #D34BFF 97.88%)",
        button_orange_pink_blue:
          "linear-gradient(92.74deg, #FF794B -10.3%, #D962FF 45.29%, #4CA2FF 100%)",
        button_green_orange_pink:
          "linear-gradient(92.74deg, #4BFFA6 -10.3%, #FF794B 51.54%, #D962FF 100%)",
        stroke_green_blue_pink:
          "linear-gradient(90deg, #4BFFA6 0%, #4CA2FF 50.31%, #D34BFF 100%)",
        bg: {
          purples: "linear-gradient(90deg, #221C36, #332C4E)",
          transparent: "transparent",
        },
      },
      blur: {
        high: "2.5rem",
      },
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
