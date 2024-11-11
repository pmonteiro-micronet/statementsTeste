const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    //addCommonColors: true,
    themes: {
      light: {
        colors: {
          background: "#FAFAFA",
          foreground: "#001517",
          primary: {
            50: '#f7e9dc',
            100: '#FAE7D6',
            DEFAULT: '#FC9D25',
            foreground: "#f5f5f5",
          },
          focus: "#0D9488",
          tableFooter: "#edebeb",
          tableFooterBorder: "#DADADA",
          lightBlue: "#E6EDF4",
          green: '#159F46',
          tableCol: '#F8F8F8',
          tableColWeekend: '#E3F1FC',
          lightBlueCol: '#F4F7FE',
        },

      }
    }
  })],
}
