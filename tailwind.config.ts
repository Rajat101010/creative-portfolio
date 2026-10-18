import type { Config } from "tailwindcss";
const config: Config = { darkMode: "class", content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { fontFamily: { sans: ["Inter", "Arial", "sans-serif"] }, colors: { ink:"#101014", lime:"#c9fa59", violet:"#8b5cf6" }, boxShadow: { glow:"0 0 60px rgba(201,250,89,.13)" } } }, plugins: [] };
export default config;
