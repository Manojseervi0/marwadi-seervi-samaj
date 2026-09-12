/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chakra UI default theme scales, copied 1:1 so colorScheme="orange" / color="orange.700"
        // etc. from the original app render identically after the Tailwind migration.
        orange: {
          50: "#FFFAF0",
          100: "#FEEBC8",
          200: "#FBD38D",
          300: "#F6AD55",
          400: "#ED8936",
          500: "#DD6B20",
          600: "#C05621",
          700: "#9C4221",
          800: "#7B341E",
          900: "#652B19",
        },
        gray: {
          50: "#F7FAFC",
          100: "#EDF2F7",
          200: "#E2E8F0",
          300: "#CBD5E0",
          400: "#A0AEC0",
          500: "#718096",
          600: "#4A5568",
          700: "#2D3748",
          800: "#1A202C",
          900: "#171923",
        },
      },
    },
  },
  plugins: [],
};
