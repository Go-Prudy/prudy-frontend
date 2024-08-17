import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        scaleAndFadeIn: 'scale-and-fade-in 150ms cubic-bezier(.25, .75, .6, .98)',
        scaleAndFadeOut: 'scale-and-fade-out 75ms ease-out',
        slideUp: 'slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideDown: 'slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
      colors: ({ colors }) => ({
        grayCaption: '#828282',
        graySubtitle: '#575757',
        base: {
          gray: '#2D2D2D',
          black: '#121212',
        },
        lemonGreen: {
          500: '#8EF846',
          600: '#90F24C',
          700: '#66C227',
        },
      }),
      transitionDuration: {
        DEFAULT: '75ms',
      },
      boxShadow: {
        md: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        aeonik: ['var(--font-aeonik)'],
      },
    },
  },
  plugins: [],
};
export default config;
