/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'transition-pop': 'button-pop var(--animation-btn, 0.25s) ease-out',
        fade: 'fadeOut 1s ease-in-out'
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1.2)' },
          '100%': { opacity: 0, transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root' // The element that receives theme color CSS variables
  }
  // important: true,
}
