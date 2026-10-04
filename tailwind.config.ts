import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-surface)",
          muted: "var(--color-surface-muted)",
        },
        border: "var(--color-border)",
        lumera: {
          text: "var(--color-text)",
          "text-muted": "var(--color-text-muted)",
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          accent: "var(--color-accent)",
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          danger: "var(--color-danger)",
          info: "var(--color-info)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(43 38 35 / 0.06)",
        lifted: "0 8px 24px rgb(43 38 35 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
