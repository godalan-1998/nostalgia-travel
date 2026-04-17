import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFBF3",
          100: "#FFF4E1",
          200: "#F7E7CF",
          300: "#EFD8B3",
        },
        teal: {
          900: "#0B2D2E",
          800: "#0F3D3F",
          700: "#145357",
        },
        orange: {
          700: "#B55A2A",
          600: "#C86B2E",
          500: "#E07B39",
        },
        ink: "#111214",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 18px 50px rgba(11,45,46,0.18)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(1200px 600px at 50% 10%, rgba(224,123,57,0.24), rgba(255,244,225,0) 55%)",
      },
    },
  },
  plugins: [],
};

export default config;

