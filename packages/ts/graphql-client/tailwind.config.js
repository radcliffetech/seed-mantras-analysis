/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Noto Sans Devanagari",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        text: {
          DEFAULT: "#1b2e1b", // deep forest green
          muted: "#6b7280", // gray-500
        },
        brand: {
          primary: "#14532d", // deep forest green
          dark: "#0b2612", // darker forest green
          light: "#d1fae5", // light green (emerald-100)
        },
        divider: "#14532d", // deep forest green
        muted: "#cccccc", // Tailwind gray-200
        surface: {
          dark: "#0b2612", // very dark green
          light: "#ffffff", // white
          muted: "#e6f4ea", // very light green
        },
        overlay: {
          dark: "rgba(20, 83, 45, 0.5)", // semi-transparent deep forest green
        },
        "surface-muted": "#e6f4ea",
        "on-dark": "#d1fae5", // light green
        "surface-dark": "#0b2612", // very dark green
        "hover-dark": "#166534", // slightly lighter forest green
        "active-dark": "#14532d", // deep forest green
      },
    },
    typography: (theme) => ({
      DEFAULT: {
        css: {
          h2: { marginBottom: theme("spacing.4") },
          h3: { marginBottom: theme("spacing.3") },
          h4: { marginBottom: theme("spacing.2") },
        },
      },
    }),
  },
  plugins: [],
};
