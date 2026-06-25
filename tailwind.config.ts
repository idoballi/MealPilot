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
        pilot: {
          50: "#f0faf6",
          100: "#d4f0e6",
          200: "#a8e0cc",
          500: "#2d9f7f",
          600: "#248f72",
          700: "#1d7359",
          dark: "#3d4f5f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
