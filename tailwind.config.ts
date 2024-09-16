import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const MIN_LINE_HEIGHT = "1.13";
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    letterSpacing: {
      "2024_14": "0.14px",
    },
    extend: {
      fontSize: {
        // sans: ['Inter Variable', 'Inter'],
        // Text sizes:
        body: ["14px", MIN_LINE_HEIGHT],
        bodySmall: ["13px", MIN_LINE_HEIGHT],
        subtitle: ["12px", MIN_LINE_HEIGHT],
        subtitleSmall: ["11px", MIN_LINE_HEIGHT],
        subtitleSmallExtra: ["10px", MIN_LINE_HEIGHT],
        caption: ["12px", MIN_LINE_HEIGHT],
        captionSmall: ["11px", MIN_LINE_HEIGHT],
        captionSmallExtra: ["10px", MIN_LINE_HEIGHT],
        iconTextLarge: ["48px", MIN_LINE_HEIGHT],

        // Heading sizes:
        heading1: ["28px", MIN_LINE_HEIGHT],
        heading2: ["24px", MIN_LINE_HEIGHT],
        heading3: ["20px", MIN_LINE_HEIGHT],
        heading4: ["18px", MIN_LINE_HEIGHT],
        heading5: ["17px", MIN_LINE_HEIGHT],
        heading6: ["16px", MIN_LINE_HEIGHT],

        // Paragraph sizes:
        pHeading6: ["16px", "1.4"],
        pBody: ["14px", "1.4"],
        pBodySmall: ["13px", "1.4"],
        pSubtitle: ["12px", "1.4"],
        pSubtitleSmall: ["11px", "1.4"],

        // V2 design font sizes
        "2024_h1-super-88": [
          "88px",
          { lineHeight: "120%", letterSpacing: "-1.76px" },
        ],
        "2024_h2-super-76": [
          "76px",
          { lineHeight: "100%", letterSpacing: "-1.52px" },
        ],
        "2024_h3-super-48": [
          "48px",
          { lineHeight: "120%", letterSpacing: "-0.48px" },
        ],
        "2024_h4-super-36": ["36px", { lineHeight: "90%" }],
        "2024_h5-super-32": ["32px", { lineHeight: "115%" }],
        "2024_h5-extrabold-32": ["32px", { lineHeight: "115%" }],
        "2024_body1": ["32px", { lineHeight: "90%" }],
        "2024_body2": ["28px", { lineHeight: "100%" }],
        "2024_body3": ["24px", { lineHeight: "125%" }],
        "2024_body4": ["18px", { lineHeight: "90%" }],
        "2024_body5": ["16px", { lineHeight: "115%", letterSpacing: "0.16px" }],
        "2024_body6": ["14px", { lineHeight: "90%", letterSpacing: "0.14px" }],
        "2024_body7": ["12px", { lineHeight: "120%", letterSpacing: "0.25px" }],
        "2024_caption": [
          "14px",
          { lineHeight: "100%", letterSpacing: "0.7px" },
        ],
        "2024_p1": ["18px", { lineHeight: "150%" }],
        "2024_p2": ["16px", { lineHeight: "150%" }],
        "2024_p3": ["14px", { lineHeight: "150%" }],
        "2024_x-Large": ["30px", { lineHeight: "150%" }],
        "2024_large": ["18px", { lineHeight: "150%" }],
        "2024_regular": [
          "16px",
          { lineHeight: "18px", letterSpacing: "0.16px" },
        ],
        "2024_small": ["14px", { lineHeight: "150%" }],
        "2024_small-semibold": [
          "12px",
          { lineHeight: "12px", letterSpacing: "0.12px" },
        ],
      },
      fontFamily: {
        // sans: ['Inter Variable', 'Inter'],
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        inter: ["var(--font-inter)"],
        heading: ["Inter Variable", "Inter", "Roboto", "Arial", "sans-serif"],
        paragraph: [
          "Inter Variable",
          "Inter",
          "Poppins",
          "Arial",
          "sans-serif",
        ],
        base: [
          "Inter Variable",
          "Inter",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
        ],
        arial: ["Arial Rounded MT", "sans-serif"],
        arialBold: ["Arial Rounded MT Bold", "sans-serif"],
        // mono: ['Red Hat Mono Variable', 'Red Hat Mono'],
        "2024_everett-super": ["TWKEverettSuper", "sans-serif"],
        "2024_everett-extrabold": ["TWKEverettExtraBold", "sans-serif"],
        "2024_everett-bold": ["TWKEverettBold", "sans-serif"],
        "2024_everett-regular": ["TWKEverettRegular", "sans-serif"],
        "2024_inter-tight": ["InterTight", "Inter"],
      },
      lineHeight: {
        "2024_14": "14px",
        "2024_18": "18px",
      },
      colors: {
        walletItemSelected: "#221c36",
        purple: {
          500: "#5C5089",
          600: "#4B416C",
          700: "#3C345B",
          800: "#2E2747",
          900: "#221C36",
          dropdownMenu: "#372D57",
          defaultName: "#4E37A0",
        },
        gray: {
          50: "#DCDEF3",
          90: "#383F47",
          100: "#ABADC6",
          200: "#9396B2",
          300: "#DCDEF380",
          400: "#605683",
          500: "#424867",
          650: "#3B3C4E",
          800: "#1E2235",
          containerBorder: "#2A3043",
        },
        //TODO: remove suiGray and use gray instead (after updating all components)
        suiGray: {
          100: "#182435",
          95: "#2A3645",
          90: "#383F47",
          85: "#5A6573",
          80: "#636870",
          75: "#767A81",
          70: "#898D93",
          65: "#9C9FA4",
          60: "#C3C5C8",
          55: "#D7D8DA",
          50: "#E9EAEB",
          45: "#E3E6E8",
          40: "#F3F6F8",
          35: "#FEFEFE",
        },
        cyan: {
          250: "#67e8f9",
        },
        success: {
          DEFAULT: "#2DD7A7",
          dark: "#008C65",
          light: "#D5F7EE",
          bright: "#22C55E",
        },
        orange: {
          DEFAULT: "#F97316",
          vivid: "#EA580C",
        },
        issue: {
          dark: "#EB5A29",
          light: "#FFECE5",
          feedback: "#EB5A29",
        },
        warning: {
          dark: "#8D6E15",
          light: "#FFF8E5",
          feedback: "#F2BD24",
          feedbackDark: "#8D6E15",
        },
        sui: {
          DEFAULT: "#6FBCF0",
          hero: "#15527B",
          blue: "#4CA3FF",
          "blue-dark": "#2563EB",
          "blue-light": "#E1F3FF",
        },
        hero: {
          dark: "#007195",
        },
        brand: {
          buttercup: "#F5CF54",
        },
        black: {
          100: "#000",
        },
        "2024_fillContent": {
          orange: "#FF794B",
          primary: {
            DEFAULT: "#FFFFFF",
            dark: "#241D3D",
            darker: "#221C36",
            inactive: "#62519C",
          },
          secondary: "#DAD0FF",
          tertiary: "#6E609F",
          good: "#4BFFA6",
          warning: "#F2BD24",
          link: "#D34BFF",
          purple: {
            light: "#C1B8F6",
          },
          issue: "#EB5A29",
        },
        "2024_fillBackground": {
          good: "#4BFFA6",
          primary: "#221C36",
          secondary: {
            DEFAULT: "#332C4E",
            Highlight: "#62519C",
          },
          warning: "#F2BD24",
          issue: "#EB5A29",
          blue: "#4CA2FF",
          pink: "#D962FF",
          green: "#4BFFA6",
          bad: "#FF1D53",
          searchBg: "#2D2743",
        },
        "2024_pink": "#D34BFF",
        "2024_green": "#4BFFA6",
        "2024_bad": "#FF1D53",
        "2024_BRAND_COLORS": {
          blue: "#4CA2FF",
        },
        // TODO: rename once Figma is updated
        "2024_temp_dark_purple": "#241D3DCC",
      },

      maxWidth: {
        160: "40rem",
        300: "18.75rem",
        400: "25rem",
        512: "32rem",
        672: "42rem",
        780: "48.75rem",
        800: "50rem",
        820: "51.25rem",
        900: "56.25rem",
      },
      width: {
        50: "12.5rem",
        modalLarge: "51.313rem",
      },
      height: {
        50: "12.5rem",
      },
      spacing: {
        780: "48.75rem",
        600: "37.5rem",
        585: "36.563rem",
        400: "25rem",
        398: "24.875rem",
        392: "24.5rem",
        300: "18.75rem",
        293: "18.313rem",
        280: "17.5rem",
        247: "15.438rem",
        248: "15.5rem",
        250: "15.625rem",
        240: "15rem",
        208: "13rem",
        209: "13.063rem",
        180: "11.25rem",
        120: "7.5rem",
        60: "3.75rem",
        26: "1.625rem",
        1.25: "0.3125rem",
        "2024_NONE": "0px",
        "2024_XS": "4px",
        "2024_S": "8px",
        "2024_R": "12px",
        "2024_M": "16px",
        "2024_L": "20px",
        "2024_XL": "24px",
        "2024_2XL": "32px",
        "2024_3XL": "40px",
        "2024_3.2XL": "44px",
        "2024_3.5XL": "56px",
        "2024_4XL": "80px",
        "2024_5XL": "100px",
        "2024_C8XL": "230px",
        "2024_C10XL": "272px",
        "2024_menuWidth": "390px",
        "2024_maxWidth": "1280px",
      },
      borderRadius: {
        12: "0.75rem",
        16: "1rem",
        "2024_20": "80px",
        "2024_XXS": "6px",
        "2024_3XS": "8px",
        "2024_XS": "12px",
        "2024_S": "20px",
        "2024_R": "24px",
        "2024_M": "32px",
        "2024_L": "40px",
      },
      aspectRatio: {
        square: "1 / 1",
      },
      backgroundImage: {
        "suins-background": "url('/images/suins-background-pattern.svg')",
        "nft-background-image":
          "url('/assets/img/token-claim/nft-pattern.svg')",
        "2024_gradient-fill-background-purple":
          "linear-gradient(77deg, #241D3D -14.93%, #2E2747 132.1%)",
        "2024_gradient-fill-background-transparent":
          "linear-gradient(109deg, rgba(75, 255, 166, 0.05) 10.42%, rgba(235, 136, 101, 0.05) 40.76%, rgba(211, 75, 255, 0.05) 59.1%, rgba(76, 162, 255, 0.05) 98.19%), linear-gradient(0deg, rgba(211, 75, 255, 0.05) 0%, rgba(211, 75, 255, 0.05) 100%)",
        "2024_community-carousel-fade-left":
          "linear-gradient(to right, #241D3D 24.42%, rgba(38, 29, 67, 0.00) 100%)",
        "2024_community-carousel-fade-right":
          "linear-gradient(to left, #241D3D 24.42%, rgba(38, 29, 67, 0.00) 100%)",
        "2024_community-fade-top":
          "linear-gradient(to bottom, #241D3D 24.42%, rgba(38, 29, 67, 0.00) 100%)",
        "2024_community-fade-bottom":
          "linear-gradient(to top, #241D3D 24.42%, rgba(38, 29, 67, 0.00) 100%)",
        "2024_terms-and-condition-overlay":
          "linear-gradient(to bottom, rgba(51,44,78,0) 0%, rgba(51,44,78,0.8) 100%)",
        "2024_ecosystem-carousel-fade-left":
          "linear-gradient(to right, #2D2549 24.42%, rgba(38, 29, 67, 0.00) 100%)",
        "2024_ecosystem-carousel-fade-right":
          "linear-gradient(to left, #2D2549 24.42%, rgba(38, 29, 67, 0.00) 100%)",
        "2024_button-gradient":
          "linear-gradient(135deg, #4bffa6 10%, #d34bff 50%, #4ca2ff 90%)",
        "2024_gradient-fill-orange-pink-blue":
          "linear-gradient(93deg, #FF794B -10.3%, #D962FF 45.29%, #4CA2FF 100%)",
        "2024_gradient-active":
          "linear-gradient(93deg, rgba(255, 121, 75, 0.20) -10.3%, rgba(217, 98, 255, 0.20) 45.29%, rgba(76, 162, 255, 0.20) 100%)",
        "2024_gradient-dropdown-menu":
          "linear-gradient(30deg, #4ca2ff, #565b77)",
        "2024_green_blue_pink":
          "linear-gradient(90deg, #4BFFA6 0%, #4CA2FF 50.31%, #D34BFF 100%)",
        "2024_green_blue_pink_active":
          "linear-gradient(311deg, #4BFFA6 10.89%, #D34BFF 97.88%)",
        "2024_recent-searches-fade-left":
          "linear-gradient(to right, #332C4E 24.42%, rgba(51, 44, 78, 0) 100%)",
        "2024_recent-searches-fade-right":
          "linear-gradient(to left, #332C4E 24.42%, rgba(51, 44, 78, 0) 100%)",
        "2024_modal-background":
          "linear-gradient(135deg, #4BFFA6, #4CA2FF, #D34BFF)",
        "2024_gradient-fill-border":
          "conic-gradient(from 0deg, #4bffa6, #d34bff, #4ca2ff, #4bffa6)",
        "show-more-gradient":
          "linear-gradient(0deg, #221C36 29.04%, rgba(34, 28, 54, 0.00) 100%)",
      },
      borderWidth: {
        "2024_1": "1px",
        "2024_3": "3px",
      },
      scale: {
        "2024_130": "1.30",
      },
      backdropBlur: {
        "2024_20": "20px",
      },
      zIndex: {
        "2024_max": "99999",
      },
    },
    boxShadow: {
      mistyEdge:
        "0px 5px 30px rgba(86, 104, 115, 0.2), 0px 0px 0px 1px rgba(160, 182, 195, 0.08)",
      "3xl": "0px 4px 12px rgba(black, 0.15)",
      "5xl": "0px 4px 16px rgba(black, 0.3)",
      modalEdge: "0px 10px 80px 1px rgba(0, 0, 0, 0.30)",
      dropdownMenuContent: "0px 5px 20px 10px rgba(16, 13, 26, 0.42)",
      "2024_searchButton": "0px 0px 24px 0px #4BFFA6, 0px 0px 24px 0px #4BFFA6",
      "2024_carousel_button": "0px 14px 24px 0px rgba(0, 0, 0, 0.35)",
      "2024_blue-glow-active": "0px 0px 30px 0px #4CA2FF",
      "2024_blue-glow-inactive": "0px 0px 20px 0px #4CA2FF",
      "2024_green-glow-active": "0px 0px 30px 0px #4BFFA6",
      "2024_green-glow-inactive": "0px 0px 20px 0px #4BFFA6",
      "2024_pink-glow-active": "0px 0px 30px 0px #D34BFF",
      "2024_pink-glow-inactive": "0px 0px 20px 0px #D34BFF",
      "2024_orange-glow-active": "0px 0px 30px 0px #FF794B",
      "2024_orange-glow-inactive": "0px 0px 33.6px 0px #FF794B",
      previewMenu: "0px 24px 44px 0px rgba(0, 0, 0, 0.45)",
    },
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      200: "200%",
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@xpd/tailwind-3dtransforms")],
} satisfies Config;
