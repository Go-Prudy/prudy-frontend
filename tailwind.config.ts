import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        scaleAndFadeIn: 'scale-and-fade-in 150ms cubic-bezier(.25, .75, .6, .98)',
        scaleAndFadeOut: 'scale-and-fade-out 75ms ease-out',
        slideUp: 'slide-up  300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideDown: 'slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
      colors: {
        white: '#FFFFFF',
        black: {
          100: '',
          800: '#2D2D2D',
          900: '#121212',
          970: '#070D04',
          950: '#000000',
        },
        gray: {
          100: '#F7F7F9',
          300: '#707170',
          400: '#828282',
          600: '#575757',
        },

        lemonGreen: {
          50: '#E8FCD8',
          400: '#78EF2C',
          // 500: '#8EF846',
          600: '#66C227',
          900: '#33810A',
          950: '#103003',
        },

        success: {
          500: '#219653',
        },
      },
      fontSize: {
        // sm: [
        //   '14px',
        //   {
        //     lineHeight: '22px',
        //   },
        // ],
      },
      transitionDuration: {
        DEFAULT: '75ms',
      },
      boxShadow: {
        md: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        aeonik: ['var(--font-aeonik)'],
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(20.37deg, #66C227 15.2%, #2A860A 74.4%);',
        'onboarding-overlay':
          'linear-gradient(180deg, rgba(18, 18, 18, 0) 50%, rgba(15, 45, 0, 0.43) 179.64%)',
        'header-gradient':
          'radial-gradient(316.4% 252.92% at 50% 263.33%, #C3FD99 20%, #FFFFFF 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
