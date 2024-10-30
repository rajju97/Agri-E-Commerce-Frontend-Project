/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui';
export default {
  daisyui: {
    themes: [{
      light: {
        primary: '#4CAF50',
        secondary: '#FFA726',
        accent: '#FFA726',
        neutral: '#3D4451',
        'base-100': '#FFFFFF',
        info: '#3ABFF8',
        success: '#36D399',
        warning: '#FBBD23',
        error: '#F87272',
      }
    }],
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        soil: '#795548',
        sand: '#A1887F',
        cream: '#FAF9F6',
        accent: '#FFA726',
        darkGreen: '#2E7D32',
      },
    },
  },
  plugins: [daisyui],
}

