/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        background: "rgb(var(--background)/<alpha-value>)",
        "home-heading": "rgb(var(--home-heading)/<alpha-value>)",
        "home-button": "rgb(var(--home-button)/<alpha-value>)",
        "home-button-border": "rgb(var(--home-button-border)/<alpha-value>)",
        "home-button-text": "rgb(var(--home-button-text)/<alpha-value>)",
        "home-form-text": "rgb(var(--home-form-text)/<alpha-value>)",
        "home-form-title": "rgb(var(--home-form-title)/<alpha-value>)",
        "home-form-field-background":
          "rgb(var(--home-form-field-background)/<alpha-value>)",
        "text-link": "rgb(var(--text-link)/<alpha-value>)",
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      gridTemplateRows: {
        10: "repeat(10, minmax(0, 1fr))",
      },
      boxShadow: {
        "home-button-shadow": "4px 4px 10px 0px var(--home-button-shadow)",
        "home-button-inner-shadow": "inset 0 0 10px #00000040",
        "home-form-shadow": "0px 0px 10px 6px var(--home-form-shadow)",
        "home-form-field-shadow":
          "inset 0 0 10px  var(--home-form-field-shadow)",
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwindcss-animate"), nextui()],
};
