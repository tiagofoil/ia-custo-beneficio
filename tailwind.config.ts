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
        'bg-primary': '#0A0A0A',
        'bg-surface-1': '#141414',
        'bg-surface-2': '#1E1E1E',
        'bg-surface-3': '#2A2A2A',
        'accent-cyan': '#00D9FF',
        'accent-cyan-hover': '#33E1FF',
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'text-primary': '#EAEAEA',
        'text-secondary': '#808080',
        'text-muted': '#666666',
        'border-subtle': '#2A2A2A',
        'border-hover': '#3A3A3A',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
